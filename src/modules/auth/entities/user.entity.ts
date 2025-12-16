import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';

import { ValidRoles } from 'src/enum';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @ApiProperty({
    example: '64e03066a03320deead383b1',
    description: 'Id del usuario',
    nullable: false,
    uniqueItems: true,
  })
  _id: string;

  @ApiProperty({
    example: 'crisvera1909@gmail.com',
    description: 'Email del usuario',
    nullable: false,
    uniqueItems: true,
  })
  @Prop({
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    index: true,
  })
  email: string;

  @ApiProperty({
    example: 'Cris Vera Villamizar',
    description: 'Id del usuario',
    nullable: false,
  })
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @ApiHideProperty()
  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @ApiProperty({
    example: [ValidRoles.USER, ValidRoles.STUDENT],
    description: 'Roles del usuario',
    nullable: false,
  })
  @Prop({
    default: [ValidRoles.USER, ValidRoles.STUDENT],
  })
  roles: string[];

  @ApiProperty({
    description: 'Estado del usuario',
    example: true,
    nullable: false,
  })
  @Prop({
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Numero de celular del usuario',
    example: '3024525612',
  })
  @Prop({
    unique: true,
    index: true,
    uniqueItems: true,
    required: true,
  })
  phoneNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (doc, ret, opt) => {
    delete ret.password;
    return ret;
  },
});
