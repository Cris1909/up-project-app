import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/auth/entities';
import { Subject } from 'src/subjects/entities';
import { AppointmentStatus } from 'src/enum';

export class Review {
  @ApiProperty({
    example: 4.5,
    description: 'Calificación de la asesoría',
    nullable: false,
  })
  @Prop({ required: true })
  value: number;

  @ApiProperty({
    example: 'Buena asesoría, me ayudó mucho',
    description: 'Comentario o texto de la revisión',
    nullable: false,
  })
  @Prop({ required: true })
  text: string;
}

@Schema(
  {
    timestamps: true,
  }
)
export class Appointment extends Document {
  @ApiProperty({
    example: '64e03066a03320deead383b1',
    description: 'Id del agendamiento',
    nullable: false,
    uniqueItems: true,
  })
  _id: string;

  @ApiProperty({
    example: '64e03066a03320deead383b1',
    description: 'Id del usuario que toma la asesoría',
    nullable: false,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @ApiProperty({
    example: '652c16293ca9fb43dc090c25',
    description: 'Id del docente que sube horario',
    nullable: false,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  teacher: User;

  @ApiProperty({
    example: '6550f10ef148e5968c97efc4',
    description: 'Id de la materia de la asesoría',
    nullable: false,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Subject.name })
  subject: Subject;

  @ApiProperty({
    example: 'Necesito una asesoría acerca del uso del verbo to be',
    description: 'Descripción de la asesoría',
    nullable: false,
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    example: '2023-11-20',
    description: 'Fecha del agendamiento',
    nullable: false,
  })
  @Prop({ required: true })
  date: string;

  @ApiProperty({
    example: [7, 8, 9],
    description: 'Horas del agendamiento',
    nullable: false,
    minimum: 0,
    maximum: 23,
  })
  @Prop({ type: [Number], min: 0, max: 23, default: [] })
  hours: number[];

  @ApiProperty({
    example: AppointmentStatus.SOLICITED,
    description: 'Estado del agendamiento',
    nullable: false,
    enum: AppointmentStatus
  })
  @Prop({
    enum: AppointmentStatus,
    default: AppointmentStatus.SOLICITED,
  })
  status: AppointmentStatus;

  @ApiProperty({
    example: 'El tema que especificaste no está disponible',
    description: 'Mensaje que explica porqué se rechazo una asesoría',
    nullable: true,
  })
  @Prop({ required: false })
  rejectMessage: string;

  @ApiProperty({
    example: [
      { text: 'Ejercicio 1', url: 'https://...' },
      { text: 'Ejercicio 2', url: 'https://...' },
    ],
    description: 'Datos asociados a la asesoría completada',
    nullable: true,
  })
  @Prop({ type: [{ text: String, url: String }], required: false })
  data: { text: string; url: string }[];

  @ApiProperty({
    type: Review,
    description: 'Revisiones de la asesoría',
    nullable: true,
  })
  @Prop({ type: Review })
  review: Review;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);