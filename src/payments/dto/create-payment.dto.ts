import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Errors, PaymentStatus } from 'src/enum';

export class CreatePaymentDto {
  @ApiProperty({
    example: PaymentStatus.PENDING,
    enum: PaymentStatus,
    description: 'Estado de pago',
  })
  @IsEnum(PaymentStatus, { message: Errors.PAYMENT_STATUS_MUST_BE_ENUM })
  status: PaymentStatus;

  @ApiProperty({ example: 7500, description: 'Valor de pago' })
  @Min(0, {message: Errors.VALUE_CANNOT_BE_NEGATIVE})
  @IsNumber({}, { message: Errors.VALUE_MUST_BE_NUMBER })
  value: number;

  @ApiProperty({
    example: '64e03066a03320deead383b1',
    description: 'Appointment ID',
  })
  @IsMongoId({ message: Errors.INVALID_MONGO_ID })
  @IsNotEmpty({ message: Errors.APPOINTMENT_NOT_SEND })
  appointment: string;
}
