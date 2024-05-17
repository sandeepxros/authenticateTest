import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class LogoutDTO {
  @ApiProperty({
    description:
      'A valid boolean value set to true if want to logout from all devices',
  })
  @IsBoolean()
  @IsOptional()
  fromAllDevice: boolean;
}
