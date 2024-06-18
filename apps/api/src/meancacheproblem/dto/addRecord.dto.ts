import { ApiProperty } from '@nestjs/swagger';

export class AddRecordDto {
    @ApiProperty({
        description: 'The record to add to the cache',
        example: '3',
    })
    value: string;
}
