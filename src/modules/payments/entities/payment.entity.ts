import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { PaymentStatus } from 'src/enum';
import { Appointment } from 'src/modules/appointments/entities/appointment.entity';

@Schema()
export class Payment extends Document {
  @ApiProperty({ example: '64e03066a03320deead383b1', description: 'Id del pago' })
  _id: string;

  @ApiProperty({ example: 'pending', enum: PaymentStatus, description: 'Estatus del pago' })
  @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @ApiProperty({ example: 50, description: 'Valor a pagar' })
  @Prop({ type: Number })
  value: number;

  @ApiProperty({ type: () => Appointment, description: 'Asesoría correspondiente' })
  @Prop({ type: Types.ObjectId, ref: Appointment.name })
  appointment: Appointment;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);