import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';
import { Errors } from 'src/enum';

export class ApproveAppointmentDto {
  @ApiProperty({ example: 7500, description: 'Valor de pago' })
  @Min(0, {message: Errors.VALUE_CANNOT_BE_NEGATIVE})
  @IsNumber({}, { message: Errors.VALUE_MUST_BE_NUMBER })
  value: number;
}