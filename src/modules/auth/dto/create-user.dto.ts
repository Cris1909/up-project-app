import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

import { passwordRegex, phoneNumberRegex } from 'src/constants';
import { Errors } from 'src/enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'Correo electrónico usuario',
    uniqueItems: true,
    nullable: false,
    example: 'crisvera1909@gmail.com',
  })
  @IsEmail({ ignore_max_length: true }, { message: Errors.EMAIL_INVALID })
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

  @ApiProperty({
    description: 'Nombre completo del usuario',
    uniqueItems: true,
    nullable: false,
    minLength: 3,
    example: 'Cris Vera Villamizar',
  })
  @MinLength(3, { message: Errors.NAME_TOO_SHORT })
  @IsString({ message: Errors.NAME_MUST_BE_STRING })
  @IsNotEmpty({ message: Errors.NAME_NOT_SEND })
  name: string;

  @ApiProperty({
    description: 'Numero de celular del usuario',
    example: '3024567834',
  })
  @IsString({ message: Errors.PHONE_NUMBER_INVALID})
  @Matches(phoneNumberRegex, {
   message: Errors.PHONE_NUMBER_INVALID
  })
  phoneNumber: string

}
