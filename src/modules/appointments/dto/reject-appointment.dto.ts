import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Errors } from 'src/enum';

export class RejectAppointmentDto {
  @ApiProperty({
    example: 'El tema que especificaste no está disponible',
    description: 'Mensaje que explica porque se rechazo una asesoría',
    nullable: true,
  })
  @IsNotEmpty({message: Errors.REJECT_MESSAGE_NOT_SEND})
  rejectMessage: string;
}