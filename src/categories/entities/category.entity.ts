import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Category extends Document {

  @ApiProperty({
    example: '64e03066a03320deead383b1',
    description: 'Id de la categoría',
    nullable: false,
    uniqueItems: true,
  })
  _id: string;

  @ApiProperty({
    example: "Dulces",
    description: 'Nombre de la categoría',
    uniqueItems: true,
    nullable: false,
    minLength: 3,
  })
  @Prop({
    required: true,
    unique: true,
    index: true,
    trim: true,
  })
  name: string;

  @ApiProperty({
    nullable: true,
    example: null,
    description: 'Imagen de la categoría'
  })
  @Prop({
    trim: true,
    default: null
  })
  img: string;

  @ApiProperty({
    example: true,
    description: 'Status de la categoría'
  })
  @Prop({
    default: true
  })
  active: boolean
}

export const CategorySchema = SchemaFactory.createForClass(Category);
