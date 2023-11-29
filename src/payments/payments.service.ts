
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment.name) private readonly paymentModel: Model<Payment>) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {
      const payment = await this.paymentModel.create(createPaymentDto);
      return payment;
    } catch (error) {
      throw new BadRequestException('Failed to create payment');
    }
  }
}