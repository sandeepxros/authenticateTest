import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsStrongPassword, isBoolean } from "class-validator";

export class UpdatePasswordDTO {
  @ApiProperty({
    description:
      'The new password of the user. Must be at least 6 characters long, including at least one lowercase letter, one uppercase letter, one number, and one special symbol.',
    example: 'NewPassword123!',
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
      'Set to true if the user wants to logout from all sessions after updating the password.',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  removeAllSessions: boolean;
}
