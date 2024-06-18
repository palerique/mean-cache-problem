import { Injectable, Logger } from '@nestjs/common';
import { StepDto } from './dto/step.dto';

@Injectable()
export class MeanCacheProblemService {
    private readonly logger = new Logger(MeanCacheProblemService.name);

    addRecord(value: number): StepDto[] {
        this.logger.log(`Received solve request with value=${value}`);
        this.logger.log('Input is valid. Calculating solution...');
    }
}
