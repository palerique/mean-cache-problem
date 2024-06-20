import { Module } from '@nestjs/common';
import { MeanCacheProblemController } from './meancacheproblem.controller';
import { MeanCacheProblemService } from './meancacheproblem.service';

@Module({
    controllers: [MeanCacheProblemController],
    providers: [MeanCacheProblemService],
})
export class MeanCacheProblemModule {}
