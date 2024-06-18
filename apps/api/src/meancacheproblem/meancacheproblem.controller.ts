import { Body, Controller, Get, Logger, Post, Req, Res } from '@nestjs/common';
import { MeanCacheProblemService } from './meanCacheProblem.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddRecordDto } from './dto/addRecordDto';
import { FingerprintDto } from './dto/Fingerprint.dto';
import { v4 as uuidv4 } from 'uuid';

@Controller('api')
export class MeanCacheProblemController {
    private readonly logger = new Logger(MeanCacheProblemController.name);

    constructor(private readonly meanCacheService: MeanCacheProblemService) {}

    @Post('records')
    @ApiOperation({ summary: 'Add a new record' })
    @ApiResponse({
        status: 201,
        description: 'Record added successfully',
    })
    @ApiTags('mean-cache-problem')
    @ApiBody({ type: AddRecordDto })
    async addRecord(
        @Req() req: any,
        @Body() { value }: AddRecordDto,
    ): Promise<void> {
        const fingerprint = req.cookies['fingerprint'];
        logger.log(
            `Adding record with value: ${value} to the fingerprint: ${fingerprint}`,
        );
        this.meanCacheService.addRecord(fingerprint, value);
    }

    @Get('mean')
    @ApiOperation({ summary: 'Calculate the mean of the records' })
    @ApiResponse({
        status: 200,
        description: 'Returns the mean of the records',
    })
    @ApiTags('mean-cache-problem')
    async calculateMean(@Req() req: any): Promise<number> {
        const fingerprint = req.cookies['fingerprint'];
        logger.log(`Calculating mean for the fingerprint: ${fingerprint}`);
        return this.meanCacheService.calculateMean(fingerprint);
    }

    @Post('initialization')
    @ApiOperation({ summary: 'Initialize the service with a fingerprint' })
    @ApiResponse({
        status: 200,
        description: 'Service initialized successfully',
    })
    @ApiTags('mean-cache-problem')
    @ApiBody({ type: FingerprintDto })
    async initialize(
        @Body() body: FingerprintDto,
        @Req() req: any,
        @Res({ passthrough: true }) res: any,
    ): Promise<void> {
        let { fingerprint } = body;
        fingerprint = req.cookies['fingerprint'] || fingerprint;
        if (!fingerprint) {
            fingerprint = uuidv4();
        }
        logger.log(`Initializing service with fingerprint: ${fingerprint}`);
        this.meanCacheService.initialize(fingerprint);
        res.cookie('fingerprint', fingerprint, {
            httpOnly: true,
            path: '/',
        });
    }
}
