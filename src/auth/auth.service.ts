import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { User } from './entities';
import { CreateUserDto, LoginUserDto } from './dto';
import { Errors } from 'src/enum';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private selectUserLogin = {
    password: 1,
    email: 1,
    name: 1,
    phoneNumber: 1,
    roles: 1,
  };

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  private async findOne(query: FilterQuery<User>) {
    const user = await this.userModel.findOne(query);
    if (!user) throw new NotFoundException(Errors.USER_NOT_FOUND);
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      const token = this.getJwtToken(user);

      return {
        payload: user,
        token,
      };
    } catch (error: any) {
      this.handleExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userModel
      .findOne({
        email,
        isActive: true,
      })
      .select(this.selectUserLogin);

    if (!user || !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(Errors.INVALID_CREDENTIALS);

    const token = this.getJwtToken(user);

    return {
      payload: user,
      token,
    };
  }

  async checkAuthStatus(user: User) {
    return {
      payload: user,
      token: this.getJwtToken(user),
    };
  }

  private getJwtToken({ _id, email, name, phoneNumber, roles }: JwtPayload) {
    const token = this.jwtService.sign({
      _id,
      email,
      name,
      phoneNumber,
      roles,
    });
    return token;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      if (error.keyPattern.email)
        throw new BadRequestException(Errors.EMAIL_ALREADY_EXIST);
      if (error.keyPattern.phoneNumber)
        throw new BadRequestException(Errors.PHONE_NUMBER_ALREADY_EXIST);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(Errors.SERVER_ERROR);
  }
}
