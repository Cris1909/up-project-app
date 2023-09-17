import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

import { Errors } from 'src/constants';

export class CreateSubjectDto {

  @ApiProperty({
    description: 'Nombre de la materia',
    uniqueItems: true,
    nullable: false,
    minLength: 3,
    example: "Ingles"
  })
  @MinLength(3, { message: Errors.NAME_TOO_SHORT })
  @IsString({ message: Errors.NAME_MUST_BE_STRING })
  @IsNotEmpty({ message: Errors.NAME_NOT_SEND })
  name: string;

  @ApiProperty({
    description: 'Estado de la materia',
    example: true
  })
  @IsOptional()
  isActive?: boolean
  
}
