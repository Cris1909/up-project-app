import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

import { Errors } from 'src/enum';

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
    example: "https://img.freepik.com/vector-gratis/fondo-libro-ingles-dibujado-mano_23-2149483336.jpg?size=626&ext=jpg&ga=GA1.1.1826414947.1699747200&semt=ais",
    description: 'Imagen de la materia',
    nullable: false,
  })
  @IsNotEmpty({ message: Errors.IMG_NOT_SEND })
  @IsUrl({}, {message: Errors.IMG_MUST_BE_URL})
  img: string;

  @ApiProperty({
    description: 'Estado de la materia',
    example: true
  })
  @IsOptional()
  isActive?: boolean
  
}
