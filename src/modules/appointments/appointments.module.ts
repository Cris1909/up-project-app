import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from './entities';

import { DateHelper } from 'src/helpers';
import { AvailableSchedulesModule } from 'src/modules/available-schedules/available-schedules.module';
import { PaymentsService } from '../payments/payments.service';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, DateHelper, PaymentsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Appointment.name,
        schema: AppointmentSchema,
      },
    ]),
    PaymentsModule,
    AvailableSchedulesModule,
  ],
  exports: [MongooseModule],
})
export class AppointmentsModule {}
