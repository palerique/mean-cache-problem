import { Module } from '@nestjs/common';
import { MeanCacheProblemService } from './meanCacheProblem.service';
import { MeanCacheProblemController } from './meanCacheProblem.controller';

@Module({
    controllers: [MeanCacheProblemController],
    providers: [MeanCacheProblemService],
})
export class MeanCacheProblemModule {}
