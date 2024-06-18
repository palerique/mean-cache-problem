import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Inject,
    Logger,
    Post,
} from '@nestjs/common';
import { MeanCacheProblemService } from './meanCacheProblem.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';
import { NoPossibleSolutionDto } from './dto/noPossibleSolution.dto';
import { CacheStateDto } from './dto/cacheStateDto';
import { AddRecordDto } from './dto/addRecordDto';

@Controller('meanCacheProblem')
export class MeanCacheProblemController {
    private readonly logger = new Logger(MeanCacheProblemController.name);

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly meanCacheService: MeanCacheProblemService,
    ) {}

    @Post('solve')
    @ApiOperation({ summary: 'Solve the mean cache problem' })
    @ApiResponse({
        status: 200,
        description: 'Returns the solution to the mean cache problem',
        type: CacheStateDto,
        schema: {
            example: {
                solution: [],
            },
            $ref: getSchemaPath(CacheStateDto),
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Returns an error message if the input values are invalid',
        type: NoPossibleSolutionDto,
        schema: {
            example: {
                message: 'No solution is possible',
            },
            $ref: getSchemaPath(NoPossibleSolutionDto),
        },
    })
    @ApiTags('mean-cache-problem')
    @ApiBody({ type: AddRecordDto })
    async solve(
        @Body() body: AddRecordDto,
    ): Promise<CacheStateDto | NoPossibleSolutionDto> {
        const { value } = body;
        this.logger.log(`Received solve request with value=${value}`, value);

        if (!value) {
            this.logger.error(
                'Invalid input values. Ensure value is provided.',
                value,
            );
            throw new HttpException(
                'Please provide value, y_capacity, and z_amount_wanted.',
                HttpStatus.BAD_REQUEST,
            );
        }

        const parsedValue = parseInt(value, 10);

        if (isNaN(parsedValue)) {
            this.logger.error('Invalid input values');
            throw new HttpException(
                'Invalid input value.',
                HttpStatus.BAD_REQUEST,
            );
        }

        // const cacheKey = `${parsedValue}-${y}-${z}`;
        // const cachedSolution: string = await this.cacheManager.get(cacheKey);
        //
        // if (cachedSolution) {
        //     this.logger.log('Returning cached solution', cachedSolution);
        //     return { solution: JSON.parse(cachedSolution) };
        // }

        this.logger.log('No cached solution found. Calculating solution...');
        const solution = this.meanCacheService.addRecord(parsedValue);
        if (solution) {
            this.logger.log('Solution found', solution);
            // await this.cacheManager.set(
            //     cacheKey,
            //     JSON.stringify(solution),
            //     1800000,
            // );
            return { solution };
        } else {
            this.logger.warn('No solution possible');
            return { message: 'No solution possible' };
        }
    }
}
