import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class LogoutDTO {
  @ApiProperty({
    description:
      'A boolean value indicating whether to logout from all devices. Set to true to logout from all devices.',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  fromAllDevice: boolean;
}
