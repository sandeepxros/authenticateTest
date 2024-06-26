import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PhoneNumberLabel } from 'src/api/entities/phoneNumber.entity';

export class CreatePhoneNumberDto {
  @ApiProperty({
    description: 'The phone number',
    example: '+1234567890',
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  number: string;

  @ApiProperty({
    description: 'The label for the phone number (e.g., home, work, mobile)',
    example: 'home',
    enum: PhoneNumberLabel,
  })
  @IsEnum(PhoneNumberLabel)
  @IsNotEmpty()
  label: PhoneNumberLabel;
}

export class CreateContactDto {
  @ApiProperty({
    description: 'The name of the contact',
    example: 'Johe',
  })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({
    description: 'The name of the contact',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    description: 'The email of the contact',
    example: 'abc@xyz.com',
  })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'A list of phone numbers associated with the contact',
    type: () => CreatePhoneNumberDto,
  })
  @ValidateNested()
  @Type(() => CreatePhoneNumberDto)
  phoneNumber: CreatePhoneNumberDto;
}

export class CreateMultipleContactsDto {
  @ApiProperty({
    description: 'A list of contacts to be added',
    type: () => [CreateContactDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateContactDto)
  contacts: CreateContactDto[];
}

export class CreateSpamReportDto {
  @ApiProperty({
    description: 'The phone number to be marked as spam',
    example: '+123456',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  number: string;

  @ApiProperty({
    description: 'comment releted to marking spam',
    example: 'comment releted to marking spam',
  })
  @IsString()
  @IsOptional()
  comment: string;
}
