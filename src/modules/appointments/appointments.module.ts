import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from './entities';

import { DateHelper } from 'src/helpers';
import { AvailableSchedulesModule } from 'src/modules/available-schedules/available-schedules.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { PaymentsService } from 'src/payments/payments.service';

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
