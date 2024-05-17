import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDTO {
  @ApiProperty({
    description:
      'First name must be a string with a minimum length of 3 characters and a maximum length of 25 characters.',
  })
  @IsString()
  @MinLength(3, { message: 'First name must be at least 3 characters long.' })
  @MaxLength(25, { message: 'First name cannot be longer than 25 characters.' })
  firstName: string;

  @ApiProperty({
    description:
      'Last name must be a string with a minimum length of 3 characters and a maximum length of 25 characters.',
  })
  @IsString()
  @MinLength(3, { message: 'Last name must be at least 3 characters long.' })
  @MaxLength(25, { message: 'Last name cannot be longer than 25 characters.' })
  lastName: string;

  @ApiProperty({
    description:
      'A valid phone number including the country code, with no spaces or special characters. Example: +1234567890.',
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    required: false,
    description: 'Email must be a valid email address. This field is optional.',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    description:
      'Password must be at least 6 characters long, including at least one lowercase letter, one uppercase letter, one number, and one special symbol.',
  })
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'Password must be at least 6 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special symbol.',
    },
  )
  password: string;
}
