import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserPayload } from 'src/config/common/types/user.type';
import { Public } from 'src/config/decorators/auth.decorator';
import { User } from 'src/config/decorators/user.decorator';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { SignUpDTO } from './dto/signup.dto';
import { UpdatePasswordDTO } from './dto/updatePassword.dto';
import { UpdateProfileDTO } from './dto/updateProfileDto';
import { LogoutDTO } from './dto/logout.dto';
import { RefreshSessionDTO } from './dto/refreshSession.dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: {
          token: 'c847ded7-6c3d-4607-a8e5-.....',
          expireAt: '2024-06-16T10:24:51.196Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: { example: { message: 'Invalid Phone number or Password' } },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: { example: { message: 'Authentication failed.' } },
  })
  login(@Body() loginDTO: LoginDTO) {
    return this.service.login(loginDTO);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'User signed up successfully',
    schema: { example: { message: 'User signed up successfully' } },
  })
  @ApiResponse({
    status: 201,
    description: 'User signed up successfully',
    schema: {
      example: {
        message: 'User Already Registerd, Please login',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation not completed',
    schema: {
      example: {
        message: [
          'phoneNumber must be a valid phone number',
          'email must be an email',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @Post('signup')
  signup(@Body() signUpDTO: SignUpDTO) {
    return this.service.signUp(signUpDTO);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Returns information about the authenticated user',
  })
  @Get('whoAmI')
  whoAmI(@User() user: UserPayload) {
    return this.service.whoAmI(user.uId);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('updateProfile')
  updateProfile(
    @Body() updateProfileDTO: UpdateProfileDTO,
    @User() user: UserPayload,
  ) {
    return this.service.updateProfile(updateProfileDTO, user.uId);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'password updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('updatePassword')
  updatePassword(
    @Body() updatePasswordDTO: UpdatePasswordDTO,
    @User() user: UserPayload,
  ) {
    return this.service.updatePassword(updatePasswordDTO, user.uId);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'user logged out successfully' })
  @ApiResponse({
    status: 200,
    description: 'user logged out from all successfully',
  })
  @Post('logout')
  logout(@Body() logoutDto: LogoutDTO, @User() user: UserPayload) {
    return this.service.logout(user, logoutDto.fromAllDevice);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'token refreshed successfully',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: {
          token: 'c847ded7-6c3d-4607-a8e5-.....',
          expireAt: '2024-06-16T10:24:51.196Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'session expired please login again',
    schema: {
      example: {
        message: 'session expired please login again',
      },
    },
  })
  @Post('refreshSession')
  refreshSession(
    @Body() refreshSessionDTO: RefreshSessionDTO,
    @User() user: UserPayload,
  ) {
    return this.service.refreshSession(refreshSessionDTO.refreshToken, user);
  }
}
