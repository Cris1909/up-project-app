import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsMongoId,
  IsPositive,
  Max,
  Min,
  MinDate,
} from 'class-validator';
import { Errors } from 'src/enum';
import { parseToStartDay } from 'src/helpers/dates';

export class CreateAvailableScheduleDto {
  @ApiProperty({
    description: 'Id del docente que sube su horario',
    nullable: false,
    example: '65244efed6e784f7b7e7e224',
  })
  @IsMongoId({ message: Errors.INVALID_MONGO_ID })
  teacherId: string;

  @ApiProperty({
    example: '2023-10-09T00:00:00.000Z',
    description: 'Fecha del horario disponible (debe comenzar a las 00:00)',
  })
  @MinDate(parseToStartDay(new Date()), {
    message: Errors.DATE_INVALID,
  })
  @IsDate({ message: Errors.DATE_INVALID })
  date: Date;

  @ApiProperty({
    example: [7, 8, 9],
    description: 'Horas del dia que tiene disponibles',
  })
  @Min(0, {
    each: true,
    message: Errors.HOURS_INVALID,
  })
  @Max(23, {
    each: true,
    message: Errors.HOURS_INVALID,
  })
  @IsPositive({
    each: true,
    message: Errors.HOURS_INVALID,
  })
  hours: number[];
}
