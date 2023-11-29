import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { EnvConfiguration } from './config';
import { SubjectsModule } from './subjects/subjects.module';
import { CustomExceptionFilter } from './common/filters';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { AvailableSchedulesModule } from './available-schedules/available-schedules.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),

    MongooseModule.forRoot(process.env.MONGO_DB),

    CommonModule,

    AuthModule,

    SubjectsModule,

    AvailableSchedulesModule,
    
    AppointmentsModule,

    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },

    AppService,
  ],
})
export class AppModule {}
