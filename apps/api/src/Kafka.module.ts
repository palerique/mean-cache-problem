import { Global, Logger, Module } from '@nestjs/common';
import { Kafka } from 'kafkajs';

export const KAFKA_CLIENT = 'KAFKA_CLIENT';

const kafkaProducer = new Kafka({
    clientId: 'my-app',
    brokers: [
        `${process.env.KAFKA_HOST ?? 'localhost'}:${
            process.env.KAFKA_PORT || '19092'
        }`,
    ],
}).producer();

@Global()
@Module({
    providers: [
        {
            provide: KAFKA_CLIENT,
            useValue: kafkaProducer,
        },
    ],
    exports: [KAFKA_CLIENT],
})
export class KafkaModule {
    logger = new Logger('KafkaModule');

    constructor() {
        this.logger.log(
            `kafka connecting on: ${process.env.KAFKA_HOST ?? 'localhost'}:${
                process.env.KAFKA_PORT || '19092'
            }`,
        );
    }
}
