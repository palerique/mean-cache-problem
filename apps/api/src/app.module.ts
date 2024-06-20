import { Logger, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { KafkaModule } from './Kafka.module';
import { MeanCacheProblemModule } from './meancacheproblem/meancacheproblem.module';

@Module({
    imports: [
        CacheModule.register({
            isGlobal: true,
            store: redisStore,
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
        }),
        KafkaModule,
        MeanCacheProblemModule,
    ],
})
export class AppModule {
    logger = new Logger('AppModule');

    constructor() {
        this.logger.log(`Redis host: ${process.env.REDIS_HOST}`);
        this.logger.log(`Redis port: ${process.env.REDIS_PORT}`);
        this.logger.log(`Redis password: ${process.env.REDIS_PASSWORD}`);
    }
}
