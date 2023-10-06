import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from './entities';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';

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
    description: '',
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  
}
