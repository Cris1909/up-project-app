import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { User } from './entities';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Errors } from 'src/enum';
import { errorsToString } from 'src/helpers';

const CREATE_USER_400 = errorsToString(
  Errors.EMAIL_INVALID,
  Errors.PASSWORD_INVALID,
  Errors.NAME_MUST_BE_STRING,
  Errors.NAME_TOO_SHORT,
  Errors.NAME_NOT_SEND,
  Errors.PHONE_NUMBER_INVALID,
  Errors.EMAIL_ALREADY_EXIST,
  Errors.PHONE_NUMBER_ALREADY_EXIST,
);
const LOGIN_400 = errorsToString(
  Errors.EMAIL_INVALID,
  Errors.PASSWORD_INVALID,
  Errors.INVALID_CREDENTIALS,
);
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Ruta para crear un usuario' })
  @ApiCreatedResponse({
    description: 'Usuario creado',
    type: User,
  })
  @ApiBadRequestResponse({
    description: CREATE_USER_400,
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Ruta para iniciar sesión' })
  @ApiOkResponse({
    description: 'Sesión iniciada correctamente',
    type: User,
  })
  @ApiBadRequestResponse({
    description: LOGIN_400,
  })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
