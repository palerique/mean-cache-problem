import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Producer } from 'kafkajs';
import { KAFKA_CLIENT } from '../Kafka.module';
import Deque = require('double-ended-queue');

export interface Record {
    id: number;
    expiringAt: number;
    value: number;
}

export interface CacheState {
    fingerprint: string;
    ttl: number;
    mean: number;
    runningSum: number;
    deque: Deque<Record>;
}

interface PersistableCacheState {
    fingerprint: string;
    ttl: number;
    runningSum: number;
    dequeAsArray: Record[];
}

@Injectable()
export class MeanCacheProblemService {
    private readonly logger = new Logger(MeanCacheProblemService.name);
    private idSequence = 1;

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject(KAFKA_CLIENT) private kafka: Producer,
    ) {}

    async addRecord(fingerprint: string, value: number) {
        const cacheState = await this.getCacheState(fingerprint);
        if (!cacheState) {
            this.logger.error(
                `Cache state isn't found for fingerprint: ${fingerprint}`,
            );
            throw new Error('Cache state not found');
        }
        cacheState.deque.push({
            id: this.idSequence++,
            expiringAt: new Date().getTime() + cacheState.ttl,
            value: value,
        });
        cacheState.runningSum += value;
        this.logger.log(
            `Adding record with value: ${value} to the fingerprint: ${fingerprint}, current cache state: ${JSON.stringify(
                cacheState,
            )}`,
        );
        await this.sendKafkaMessage(
            `A new record with id: ${this.idSequence} and value: ${value} was added`,
        );
        return await this.expireRecords(cacheState);
    }

    async calculateMean(fingerprint: string) {
        let cacheState = await this.getCacheState(fingerprint);
        this.logger.log(
            `Calculating mean for the fingerprint: ${fingerprint}, current cache state: ${JSON.stringify(
                cacheState,
            )}`,
        );
        if (!cacheState) {
            this.logger.error(
                `Cache state isn't found for fingerprint: ${fingerprint}`,
            );
            throw new Error('Cache state not found');
        }
        if (!cacheState.deque.length) {
            cacheState.mean = 0;
            return cacheState;
        }
        cacheState = await this.expireRecords(cacheState);
        cacheState.mean = cacheState.runningSum / cacheState.deque.length;
        await this.sendKafkaMessage(
            `The mean for the fingerprint: ${fingerprint} is ${cacheState.mean}`,
        );
        return cacheState;
    }

    async initialize(fingerprint: string, ttl: number) {
        this.logger.log(
            `Initializing the service with fingerprint: ${fingerprint} and ttl: ${ttl}`,
        );
        if (isNaN(ttl) || ttl < 0) {
            this.logger.error(`Invalid TTL: ${ttl}`);
            throw new Error(`Invalid TTL: ${ttl}`);
        }
        if (!fingerprint || fingerprint.length === 0) {
            this.logger.error(`Invalid fingerprint: ${fingerprint}`);
            throw new Error(`Invalid fingerprint: ${fingerprint}`);
        }
        const cacheState: CacheState = {
            deque: new Deque<Record>([]),
            runningSum: 0,
            ttl,
            fingerprint,
            mean: 0,
        };
        this.logger.log(
            `Setting the cache state: ${JSON.stringify(cacheState)}`,
        );
        await this.saveCacheState(cacheState);
        await this.sendKafkaMessage(
            `The service was initialized with fingerprint: ${fingerprint} and ttl: ${ttl}`,
        );
        return cacheState;
    }

    private async sendKafkaMessage(message: string) {
        try {
            await this.kafka.connect();
            await this.kafka.send({
                topic: 'my-topic',
                messages: [
                    {
                        value: message,
                    },
                ],
            });
        } catch (error) {
            // Handle the error appropriately.
            // Possibly retry sending message, alert the system, etc.
            this.logger.error('Error sending Kafka message:', error);
        } finally {
            // // Use finally clause so disconnect gets called even if send failed.
            // try {
            //     await this.kafka.disconnect();
            // } catch (error) {
            //     this.logger.error('Error disconnecting from Kafka:', error);
            // }
        }
    }

    private async saveCacheState(cacheState: CacheState) {
        this.logger.log(
            `Saving cache state for the fingerprint: ${
                cacheState.fingerprint
            }, cache state: ${JSON.stringify(cacheState)}`,
        );
        const cacheStateToPersist: PersistableCacheState = {
            fingerprint: cacheState.fingerprint,
            ttl: cacheState.ttl,
            runningSum: cacheState.runningSum,
            dequeAsArray: cacheState.deque.toArray(),
        };
        await this.cacheManager.set(
            cacheState.fingerprint,
            cacheStateToPersist,
        );
    }

    private async getCacheState(
        fingerprint: string,
    ): Promise<CacheState | null> {
        this.logger.log(
            `Getting cache state for the fingerprint: ${fingerprint}`,
        );
        const persistableCacheState: PersistableCacheState =
            await this.cacheManager.get(fingerprint);
        this.logger.log(
            `Cache state: ${JSON.stringify(persistableCacheState)}`,
        );
        if (!persistableCacheState) {
            return null;
        }
        const cacheState: CacheState = {
            fingerprint: persistableCacheState.fingerprint,
            ttl: persistableCacheState.ttl,
            runningSum: persistableCacheState.runningSum,
            deque: new Deque<Record>(persistableCacheState.dequeAsArray),
            mean:
                persistableCacheState.runningSum /
                persistableCacheState.dequeAsArray.length,
        };
        this.logger.log(
            `Cache state after deque conversion: ${JSON.stringify(cacheState)}`,
        );
        return cacheState;
    }

    private async expireRecords(cacheState: CacheState) {
        this.logger.log(
            `Expiring records for the cache state: ${JSON.stringify(
                cacheState,
            )}`,
        );
        const currentTime = new Date().getTime();
        this.logger.log(`Current time: ${currentTime}`);
        while (
            cacheState &&
            cacheState.deque.length &&
            currentTime - cacheState.deque.peekFront()?.expiringAt >= 0
        ) {
            const expiredRecord = cacheState.deque.shift();
            cacheState.runningSum -= expiredRecord.value;
        }
        await this.saveCacheState(cacheState);
        return cacheState;
    }
}
