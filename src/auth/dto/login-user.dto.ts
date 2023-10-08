import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';
import { passwordRegex } from 'src/constants';

import { Errors } from 'src/enum';

export class LoginUserDto {
  @ApiProperty({
    description: 'Correo electrónico usuario',
    uniqueItems: true,
    nullable: false,
    example: 'crisvera1909@gmail.com',
  })
  @IsEmail({ ignore_max_length: true }, { message: Errors.EMAIL_INVALID })
  @IsNotEmpty({ message: Errors.EMAIL_INVALID})
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    nullable: false,
    example: 'Cris123.',
  })
  @Length(6, 64, { message: Errors.PASSWORD_INVALID })
  @Matches(passwordRegex, {
    message: Errors.PASSWORD_INVALID,
  })
  password: string;
}
