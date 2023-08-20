import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { Errors } from 'src/constants';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    uniqueItems: true,
    nullable: false,
    minLength: 3,
    example: "Dulces"
  })
  @MinLength(3, { message: Errors.NAME_TOO_SHORT })
  @IsString({ message: Errors.NAME_MUST_BE_STRING })
  @IsNotEmpty({ message: Errors.NAME_NOT_SEND })
  name: string;
}
