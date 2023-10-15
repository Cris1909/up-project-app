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
import { getEndPreviousDay } from 'src/helpers/dates';

export class CreateAvailableScheduleDto {
  @ApiProperty({
    example: '2023-10-09T00:00:00.000Z',
    description: 'Fecha del horario disponible',
  })
  @MinDate(getEndPreviousDay(new Date()), {
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
  hours: number[];
}
