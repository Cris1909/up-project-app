import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AppointmentStatus, Errors } from 'src/enum';

export class UpdateAppointmentStatusDto {
  @ApiProperty({
    enum: AppointmentStatus,
    description: 'Nuevo estado de la asesoría',
  })
  @IsEnum(AppointmentStatus, { message: Errors.INVALID_APPOINTMENT_STATUS })
  status: AppointmentStatus;
}