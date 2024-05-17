import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshSessionDTO {
  @ApiProperty({
    description:
      'Users refresh token is required',
  })
  @IsString()
  refreshToken: string;
}
