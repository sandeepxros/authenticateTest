import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProfileDTO {
  @ApiProperty({
    description:
      'The first name of the user. Must be a string with a minimum length of 3 characters and a maximum length of 25 characters.',
    required: false,
    example: 'John',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @IsOptional()
  firstName: string;

  @ApiProperty({
    description:
      'The last name of the user. Must be a string with a minimum length of 3 characters and a maximum length of 25 characters.',
    required: false,
    example: 'Doe',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @IsOptional()
  lastName: string;

  @ApiProperty({
    required: false,
    description:
      'The email address of the user. Must be a valid email address. This field is optional.',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsOptional()
  email: string;
}
