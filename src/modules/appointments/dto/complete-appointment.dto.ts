import { IsArray, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DataDto {
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  url: string;
}

export class CompleteAppointmentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataDto)
  @IsOptional()
  data?: DataDto[];
}