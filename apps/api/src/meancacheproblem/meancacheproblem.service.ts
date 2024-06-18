import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import Deque from 'double-ended-queue';

interface Record {
    expiringAt: number;
    value: number;
}

interface CacheState {
    fingerprint: string;
    ttl: number;
    runningSum: number;
    deque: Deque<Record>;
}

@Injectable()
export class MeanCacheProblemService {
    private readonly logger = new Logger(MeanCacheProblemService.name);

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async addRecord(fingerprint: string, value: number) {
        const cacheState: CacheState = await this.cacheManager.get(fingerprint);
        if (!cacheState) {
            throw new Error('Cache state not found');
        }
        cacheState.deque.push({
            expiringAt: new Date().getTime() + cacheState.ttl,
            value: value,
        });
        cacheState.runningSum += value;
        await this.cacheManager.set(fingerprint, cacheState);
        this.logger.log(
            `Adding record with value: ${value} to the fingerprint: ${fingerprint}, current cache state: ${cacheState}`,
        );
        await this.expireRecords(cacheState);
    }

    async calculateMean(fingerprint: string) {
        const cacheState: CacheState = await this.cacheManager.get(fingerprint);
        await this.expireRecords(cacheState);
        this.logger.log(
            `Calculating mean for the fingerprint: ${fingerprint}, current cache state: ${cacheState}`,
        );
        if (!cacheState || !cacheState.deque.length) {
            return 0;
        }
        return cacheState.runningSum / cacheState.deque.length;
    }

    async initialize(fingerprint: string, ttl: number) {
        this.logger.log(
            `Initializing the service with fingerprint: ${fingerprint} and ttl: ${ttl}`,
        );
        await this.cacheManager.set(fingerprint, {
            data: [],
            runningSum: 0,
            ttl: ttl,
        });
    }

    private async expireRecords(cacheState: CacheState) {
        const currentTime = new Date().getTime();
        while (
            cacheState &&
            cacheState.deque.length &&
            currentTime - cacheState.deque.peekFront()?.expiringAt >
                cacheState.ttl
        ) {
            const expiredRecord = cacheState.deque.shift();
            cacheState.runningSum -= expiredRecord.value;
        }
        await this.cacheManager.set(cacheState.fingerprint, cacheState);
    }
}
