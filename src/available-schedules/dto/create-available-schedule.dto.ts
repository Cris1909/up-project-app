import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsMongoId,
  IsPositive,
  Max,
  Min,
  MinDate,
} from 'class-validator';
import { DateFormat } from 'src/common/decorators';
import { Errors } from 'src/enum';

export class CreateAvailableScheduleDto {
  
  @ApiProperty({
    example: '2023-10-09',
    description: 'Fecha del horario disponible (YYYY-MM-DD)',
  })
  @IsDateString({},{ message: Errors.DATE_INVALID_FORMAT})
  date: string;

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
