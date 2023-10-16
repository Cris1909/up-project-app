import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import mongoose, {
  AggregatePaginateModel,
  Document,
  PaginateModel,
} from 'mongoose';

import * as mongoosePaginate from 'mongoose-paginate-v2';
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

import { User } from 'src/auth/entities';
@Schema()
export class AvailableSchedule extends Document {
  @ApiProperty({
    example: '64e03066a03320deead383b1',
    description: 'Id del horario disponible',
    nullable: false,
    uniqueItems: true,
  })
  _id: string;

  @ApiProperty({
    example: '64e03066a03320deead383b1',
    description: 'Id del docente que sube horario',
    nullable: false,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  teacherId: string;

  @ApiProperty({
    example: '2023-10-09T00:00:00.000Z',
    description: 'Fecha del horario disponible (debe comenzar a las 00:00)',
    nullable: false,
    uniqueItems: true,
  })
  @Prop({ type: Date, required: true, index: true, unique: true })
  date: Date;

  @ApiProperty({
    example: [7, 8, 9],
    description: 'Horas del día que tiene disponibles',
    nullable: false,
    minimum: 0,
    maximum: 23,
  })
  @Prop({ type: [Number], min: 0, max: 23, default: [] })
  hours: number[];
}

export const AvailableScheduleSchema =
  SchemaFactory.createForClass(AvailableSchedule);

AvailableScheduleSchema.plugin(mongoosePaginate);
AvailableScheduleSchema.plugin(aggregatePaginate);

export interface AvailableScheduleDocument
  extends PaginateModel<AvailableSchedule>,
    AggregatePaginateModel<AvailableSchedule> {}
