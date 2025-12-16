import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class ReviewAppointmentDto {
  @ApiProperty({
    example: 4.5,
    description: 'Calificación de la asesoría',
    nullable: false,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  value: number;

  @ApiProperty({
    example: 'Buena asesoría, me ayudó mucho',
    description: 'Comentario o texto de la revisión',
    nullable: false,
  })
  @IsString()
  text: string;
}
