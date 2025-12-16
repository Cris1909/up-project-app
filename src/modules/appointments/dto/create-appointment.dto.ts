import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Errors } from 'src/enum';

export class CreateAppointmentDto {
  @ApiProperty({
    example: '2023-11-20',
    description: 'Fecha de la asesoría (YYYY-MM-DD)',
  })
  @IsDateString({}, { message: Errors.DATE_INVALID_FORMAT })
  date: string;

  @ApiProperty({
    example: [7, 8, 9],
    description: 'Horas de la asesoría',
  })
  @Min(0, {
    each: true,
    message: Errors.HOURS_INVALID,
  })
  @Max(23, {
    each: true,
    message: Errors.HOURS_INVALID,
  })
  @ArrayNotEmpty({ message: Errors.HOURS_EMPTY })
  hours: number[];

  @ApiProperty({
    example: 'Necesito una asesoría acerca del uso del verbo to be',
    description: 'Descripción de la asesoría',
  })
  @MaxLength(300, {message: Errors.DESCRIPTION_TOO_LONG})
  @IsString({ message: Errors.DESCRIPTION_INVALID })
  @IsNotEmpty({ message: Errors.DESCRIPTION_NOT_SEND })
  description: string;

  @ApiProperty({
    example: '652c16293ca9fb43dc090c25',
    description: 'Id del docente que sube horario',
  })
  @IsMongoId({ message: Errors.TEACHER_ID_INVALID })
  teacher: string;

  @ApiProperty({
    example: '6550f10ef148e5968c97efc4',
    description: 'Id de la materia de la asesoría',
  })
  @IsMongoId({ message: Errors.SUBJECT_ID_INVALID })
  subject: string;

}
