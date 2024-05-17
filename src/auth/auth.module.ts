import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneNumberService } from 'src/config/common/services/utility/phoneNumber.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { GlobalPhoneBook } from 'src/entities/globalPhonebook.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, GlobalPhoneBook])],
  providers: [AuthService, PhoneNumberService],
  controllers: [AuthController],
})
export class AuthModule {}
