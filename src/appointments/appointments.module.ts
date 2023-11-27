import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from './entities';

import { DateHelper } from 'src/helpers';
import { AvailableSchedulesModule } from 'src/available-schedules/available-schedules.module';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, DateHelper],
  imports: [
    MongooseModule.forFeature([
      {
        name: Appointment.name,
        schema: AppointmentSchema,
      },
    ]),
    AvailableSchedulesModule,
  ],
  exports: [MongooseModule],
})
export class AppointmentsModule {}
