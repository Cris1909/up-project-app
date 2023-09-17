import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

import { ValidRoles } from 'src/enum';

@Schema()
export class Role extends Document {
  @ApiProperty({
    example: '64e03066a03320deead383b1',
    description: 'Id del rol',
    nullable: false,
    uniqueItems: true,
  })
  _id: string;

  @ApiProperty({
    enum: ValidRoles,
    example: ValidRoles.PARENT,
    description: 'Nombre del rol',
    uniqueItems: true,
    nullable: false,
    minLength: 3,
  })
  @Prop({
    enum: ValidRoles,
    required: true,
    unique: true,
    index: true,
    trim: true,
  })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
