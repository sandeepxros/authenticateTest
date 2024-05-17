import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneNumberService } from 'src/config/common/services/utility/phoneNumber.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { Contact } from './entities/contact.entity';
import { PhoneNumber } from './entities/phoneNumber.entity';
import { SpamReport } from './entities/spamReport.entity';
import { User } from './entities/user.entity';
import { PhoneBookController } from './phoneBook/phoneBook.controller';
import { PhoneBookService } from './phoneBook/phonebook.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, PhoneNumber, SpamReport, Contact])],
  providers: [AuthService, PhoneNumberService, PhoneBookService],
  controllers: [AuthController, PhoneBookController],
})
export class APIModule {}
