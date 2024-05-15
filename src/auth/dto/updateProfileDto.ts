import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export class UpdateProfileDTO {
  @ApiProperty({
    description:
      'First name must be a string with a minimum length of 3 characters and a maximum length of 25 characters.',
    required: false,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @IsOptional()
  firstName: string;

  @ApiProperty({
    description:
      'Last name must be a string with a minimum length of 3 characters and a maximum length of 25 characters.',
    required: false,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @IsOptional()
  lastName: string;

  @ApiProperty({
    description:
      'A valid phone number including the country code, with no spaces or special characters. Example: +1234567890.',
    required: false,
  })
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({
    required: false,
    description: 'Email must be a valid email address. This field is optional.',
  })
  @IsEmail()
  @IsOptional()
  email: string;
}
