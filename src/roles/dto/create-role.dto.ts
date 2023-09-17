
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { Errors, ValidRoles } from 'src/enum';

export class CreateRoleDto {
  
  @ApiProperty({
    description: 'Nombre del rol',
    enum:ValidRoles,
    uniqueItems: true,
    nullable: false,
    minLength: 3,
    example: ValidRoles.PARENT
  })
  @MinLength(3, { message: Errors.NAME_TOO_SHORT })
  @IsEnum(ValidRoles,{ message: Errors.ROLE_MUST_BE_ENUM})
  @IsString({ message: Errors.NAME_MUST_BE_STRING })
  @IsNotEmpty({ message: Errors.NAME_NOT_SEND })
  name: string;

}



