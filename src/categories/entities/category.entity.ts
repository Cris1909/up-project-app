import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Category extends Document {

  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  })
  name: string

  @Prop({
    type: String,
    trim: true
  })
  img: string
  
}

export const CategorySchema = SchemaFactory.createForClass(Category)