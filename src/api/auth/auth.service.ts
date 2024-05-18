import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { RedisService } from 'src/config/common/services/redis/redis.service';
import { PhoneNumberService } from 'src/config/common/services/utility/phoneNumber.service';
import { Session } from 'src/config/common/types/session.type';
import { UserPayload } from 'src/config/common/types/user.type';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { PhoneNumber, PhoneNumberLabel } from '../entities/phoneNumber.entity';
import { User } from '../entities/user.entity';
import { PhoneBookService } from '../phoneBook/phonebook.service';
import { LoginDTO } from './dto/login.dto';
import { SignUpDTO } from './dto/signup.dto';
import { UpdatePasswordDTO } from './dto/updatePassword.dto';
import { UpdateProfileDTO } from './dto/updateProfileDto';

type SessionID = string;
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
    private readonly phoneNumberService: PhoneNumberService,
    private readonly phonbookService: PhoneBookService,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(PhoneNumber)
    private phoneNumberRepository: Repository<PhoneNumber>,
  ) {}

  getUserByPhoneId(nonParsePhoneNumber) {
    const phoneNumberMetaData =
      this.phoneNumberService.extractCountryDetails(nonParsePhoneNumber);

    return this.repository.findOne({
      where: {
        phoneId: phoneNumberMetaData.phoneNumber,
      },
      relations: ['userProfile', 'userProfile.phoneNumbers'],
    });
  }

  async login(loginDTO: LoginDTO) {
    const user = await this.getUserByPhoneId(loginDTO.phoneNumber);

    if (!user) throw new BadRequestException('user is not registerd');

    const isPasswordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (!isPasswordMatched)
      throw new BadRequestException('Invalid Phone number or Password');

    delete user.password;

    return this.generateSession(loginDTO, user);
  }

  async signUp(signUpDTO: SignUpDTO) {
    const phoneNumberMetaData = this.phoneNumberService.extractCountryDetails(
      signUpDTO.phoneNumber,
    );

    const countryCode = phoneNumberMetaData.countryCode;
    const countryName = phoneNumberMetaData.countryName;
    const regionCode = phoneNumberMetaData.regionCode;
    const actualNumber = phoneNumberMetaData.phoneNumber;

    const phoneNumber = await this.getUserByPhoneId(signUpDTO.phoneNumber);

    if (phoneNumber)
      throw new BadRequestException('User Already Registerd, Please login');

    const user = this.repository.create();
    user.password = signUpDTO.password;
    user.phoneId = actualNumber;
    await user.save();

    const contact = this.contactRepository.create();
    contact.addedBy = user;
    contact.firstName = signUpDTO.firstName;
    contact.lastName = signUpDTO.lastName;
    contact.isRegistered = true;
    contact.user = user;
    // [];

    let phoneNumberToAdd = await this.phoneNumberRepository.findOne({
      where: { phoneNumber: actualNumber },
    });

    if (!phoneNumberToAdd) {
      phoneNumberToAdd = this.phoneNumberRepository.create();
      phoneNumberToAdd.regionCode = regionCode;
      phoneNumberToAdd.countryCode = countryCode;
      phoneNumberToAdd.countryName = countryName;
      phoneNumberToAdd.phoneNumber = actualNumber;
      phoneNumberToAdd.label = PhoneNumberLabel.primary;
      await phoneNumberToAdd.save();
    }
    contact.phoneNumbers =  phoneNumberToAdd
    console.log(phoneNumberToAdd, "phoneNumberToAdd")

    // contact.phoneNumbers.push(phoneNumberToAdd);

    console.log(contact, "contactcontact")

    await contact.save()

    return { message: 'User signed up successfully' };
  }

  async whoAmI(id: string) {
    const user = await this.repository.findOne({
      where: { id },
      relations: ['userProfile', 'userProfile.phoneNumbers'],
    });
    delete user.password;
    delete user['tempPassword'];
    return user;
  }

  async updateProfile(updateProfileDTO: UpdateProfileDTO, id: string) {
    const isUpdated = (
      await this.contactRepository.update({ user: { id } }, updateProfileDTO)
    ).affected;
    return {
      message: isUpdated
        ? 'Profile updated successfully'
        : "can't update at this moment",
    };
  }

  async updatePassword(updatePasswordDTO: UpdatePasswordDTO, id: string) {
    const user = await this.repository.findOne({ where: { id } });

    if (!user) throw new BadRequestException('Unauthorised');

    user.password = updatePasswordDTO.password;

    await user.save();

    if (updatePasswordDTO.removeAllSessions) {
      this.removeAllSession(id);
    }

    return {
      message: 'password updated successfully',
    };
  }

  async logout(user: UserPayload, fromAllDevice = false) {
    if (fromAllDevice) {
      this.removeAllSession(user.uId);
      return { message: 'user logged out from all successfully' };
    } else {
      this.removeSingleSession(user.uId, user.sessionId);
      return { message: 'user logged out successfully' };
    }
  }

  async refreshSession(refreshToken: string, user: UserPayload) {
    try {
      const session = await this.getCurrentUserSession(user.uId, refreshToken);
      if (!session || session.refreshToken.expireAt < new Date())
        throw new UnauthorizedException('session expired please login again ');
      else
        return this.generateSession(
          { deviceToken: session.deviceToken },
          await this.repository.findOneBy({ id: user.uId }),
          session.sessionId,
        );
    } catch (e) {
      Logger.error(e, 'refreshSession');
      throw new UnauthorizedException('session expired please login again ');
    }
  }

  private createRefreshToken() {
    const expireAt = new Date();
    expireAt.setMonth(expireAt.getMonth() + 1);

    return {
      token: randomUUID(),
      expireAt,
    };
  }

  private getSessionsKey(userId) {
    return `user-session-${userId}`;
  }

  private async registerSession(sessionPayload: Session, sessionId: string) {
    try {
      await this.redis.hset(
        this.getSessionsKey(sessionPayload.userId),
        sessionId,
        JSON.stringify(sessionPayload),
      );
    } catch (error) {
      Logger.error(error, 'Redis - setSession');
      throw new InternalServerErrorException(
        'Some issue occurred, please try again later',
      );
    }
  }
  private async generateSession(
    loginDTO: Partial<LoginDTO>,
    user: User,
    updateSession?: SessionID,
  ) {
    let sessionId = updateSession || randomUUID();

    if (loginDTO.deviceToken && !updateSession) {
      const oldSessionWithSameDeviceID =
        await this.checkUserSessionAgainsDeviceToken(
          user.id,
          loginDTO.deviceToken,
        );
      sessionId = oldSessionWithSameDeviceID
        ? oldSessionWithSameDeviceID.sessionId
        : sessionId;
    }

    const token = await this.jwtService.signAsync({
      uId: user.id,
      firstName: user.userProfile.firstName,
      lastName: user.userProfile.lastName,
      sessionId,
    });

    const refreshToken = this.createRefreshToken();

    const session: Session = {
      deviceToken: loginDTO.deviceToken,
      email: user.userProfile.email,
      sessionId,
      refreshToken,
      userId: user.id,
      firstName: user.userProfile.firstName,
      lastName: user.userProfile.lastName,
      blocked: false,
    };

    await this.registerSession(session, sessionId);

    return {
      token,
      refreshToken,
    };
  }

  private async removeSingleSession(userId: string, sessionId: string) {
    return await this.redis.hDel(this.getSessionsKey(userId), sessionId);
  }

  private async removeAllSession(userId: string) {
    const allSessions = await this.redis.hGetAll(this.getSessionsKey(userId));

    for (const sessionIds of Object.keys(allSessions)) {
      await this.removeSingleSession(userId, sessionIds);
    }
  }

  private async getCurrentUserSession(userId: string, refreshToken: string) {
    const sessions = await this.redis.hGetAll(this.getSessionsKey(userId));
    for (const session of Object.values(sessions)) {
      if (typeof session === 'string') {
        const userSession = JSON.parse(session);
        if (userSession['refreshToken']['token'] === refreshToken) {
          return userSession as Session;
        }
      }
    }
    return null;
  }

  private async checkUserSessionAgainsDeviceToken(
    userId: string,
    deviceToken: string,
  ) {
    const sessions = await this.redis.hGetAll(this.getSessionsKey(userId));
    for (const session of Object.values(sessions)) {
      if (typeof session === 'string') {
        const userSession = JSON.parse(session);
        if (userSession['deviceToken'] === deviceToken) {
          return userSession as Session;
        }
      }
    }
    return null;
  }
}
