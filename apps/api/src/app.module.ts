import { Logger, Module } from '@nestjs/common';
import { MeanCacheProblemModule } from './meanCacheProblem/meanCacheProblem.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [
        CacheModule.register({
            isGlobal: true,
            store: redisStore,
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
        }),
        MeanCacheProblemModule,
    ],
})
export class AppModule {
    constructor() {
        const logger = new Logger('AppModule');
        logger.log(`Redis host: ${process.env.REDIS_HOST}`);
        logger.log(`Redis port: ${process.env.REDIS_PORT}`);
        logger.log(`Redis password: ${process.env.REDIS_PASSWORD}`);
    }
}
