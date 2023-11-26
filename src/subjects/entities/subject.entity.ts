import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Subject extends Document {

  @ApiProperty({
    example: '64e03066a03320deead383b1',
    description: 'Id de la materia',
    nullable: false,
    uniqueItems: true,
  })
  _id: string;

  @ApiProperty({
    example: "Ingles",
    description: 'Nombre de la materia',
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
    example: "https://img.freepik.com/vector-gratis/fondo-libro-ingles-dibujado-mano_23-2149483336.jpg?size=626&ext=jpg&ga=GA1.1.1826414947.1699747200&semt=ais",
    description: 'Imagen de la materia',
    nullable: false,
  })
  @Prop({
    required: true,
    trim: true,
  })
  img: string;

  @ApiProperty({
    description: 'Estado de la materia',
    example: true,
  })
  @Prop({
    default: true
  })
  isActive: boolean
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
