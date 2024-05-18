import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshSessionDTO {
  @ApiProperty({
    description: 'The refresh token of the user.',
    example: 'your_refresh_token_here',
  })
  @IsString()
  refreshToken: string;
}
