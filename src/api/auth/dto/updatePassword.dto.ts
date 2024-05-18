import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsStrongPassword, isBoolean } from "class-validator";

export class UpdatePasswordDTO {
  @ApiProperty({
    description:
      'Password must be at least 6 characters long, including at least one lowercase letter, one uppercase letter, one number, and one special symbol.',
  })
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;


  @ApiProperty({
    description:
      'True if user wants to logout from everywhere after updating the password',
  })
  @IsBoolean()
  @IsOptional()
  removeAllSessions: boolean;
}
