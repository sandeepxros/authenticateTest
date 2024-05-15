import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginDTO } from './dto/login.dto';
import { SignUpDTO } from './dto/signup.dto';
import { UpdatePasswordDTO } from './dto/updatePassword.dto';
import { UpdateProfileDTO } from './dto/updateProfileDto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDTO: LoginDTO) {
    const user = await this.repository.findOne({
      where: { phoneNumber: loginDTO.phoneNumber },
    });

    if (!user) throw new BadRequestException('user is not registerd');

    const isPasswordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (!isPasswordMatched)
      throw new BadRequestException('Invalid Phone number or Password');

    delete user.password;

    return {
      token: await this.jwtService.signAsync({
        uId: user.id,
        pId: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
      }),
    };
  }

  async signUp(signUpDTO: SignUpDTO) {
    const isPhoneNumberAlreadyRegisterd = await this.repository.count({
      where: { phoneNumber: signUpDTO.phoneNumber },
    });

    if (isPhoneNumberAlreadyRegisterd)
      throw new BadRequestException('User Already Registerd, Please login');

    const user = this.repository.create(signUpDTO);
    await user.save();

    return { message: 'User signed up successfully' };
  }

  async whoAmI(id: number) {
    const user = await this.repository.findOneBy({ id });
    delete user.password;
    delete user["tempPassword"];
    return user;
  }

  async updateProfile(updateProfileDTO: UpdateProfileDTO, id: number) {
    const isUpdated = (await this.repository.update({ id }, updateProfileDTO))
      .affected;
    return {
      message: isUpdated
        ? 'Profile updated successfully'
        : "can't update at this moment",
    };
  }

  async updatePassword(updatePasswordDTO: UpdatePasswordDTO, id: number) {
    const user = await this.repository.findOne({ where: { id } });

    if (!user) throw new BadRequestException('Unauthorised');

    user.password = updatePasswordDTO.password;

    await user.save();

    return {
      message: 'password updated successfully',
    };
  }
}
