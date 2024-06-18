import { ApiProperty } from '@nestjs/swagger';

export class FingerprintDto {
    @ApiProperty()
    fingerprint: string;
    @ApiProperty()
    ttl: string;
}
