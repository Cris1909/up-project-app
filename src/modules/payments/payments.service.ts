import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Errors, PaymentStatus } from 'src/enum';
import { parseToObjectId } from 'src/helpers';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {
      const payment = await this.paymentModel.create(createPaymentDto);
      return payment;
    } catch (error) {
      throw new BadRequestException('Failed to create payment');
    }
  }

  async updatePaymentStatus({
    paymentId,
    appointmentId,
    newStatus,
  }: {
    paymentId?: string;
    appointmentId?: string;
    newStatus: PaymentStatus;
  }): Promise<Payment> {
    const payment = paymentId
      ? await this.paymentModel.findById(paymentId)
      : await this.paymentModel.findOne({
          appointment: parseToObjectId(appointmentId),
        });
    if (!payment) throw new NotFoundException(Errors.PAYMENT_NOT_FOUND);
    try {
      payment.status = newStatus;
      await payment.save();
      return payment;
    } catch (error) {
      throw new BadRequestException(Errors.PAYMENT_ERROR);
    }
  }
}
