import { ApiProperty } from '@nestjs/swagger';
import { StepDto } from './step.dto';

export class CacheStateDto {
    @ApiProperty({
        type: [StepDto],
        description: 'The steps taken to solve the mean cache problem',
    })
    solution: StepDto[];
}
