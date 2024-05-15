import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    description:
      'A valid phone number including the country code, with no spaces or special characters. Example: +1234567890.',
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ description: 'The password of the user.' })
  @IsString()
  password: string;
}
