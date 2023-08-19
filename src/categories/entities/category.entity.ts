import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Category extends Document {

  @ApiProperty({
    example: '64e03066a03320deead383b1',
    description: 'Category ID',
    nullable: false,
    uniqueItems: true,
  })
  _id: string;

  @ApiProperty({
    uniqueItems: true,
    nullable: false,
    minLength: 3,
    example: "Dulces"
  })
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
  })
  name: string;

  @ApiProperty({
    nullable: true,
    example: null
  })
  @Prop({
    type: String,
    trim: true,
    default: null
  })
  img: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
