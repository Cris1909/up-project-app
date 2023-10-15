import { Module } from '@nestjs/common';
import { AvailableSchedulesService } from './available-schedules.service';
import { AvailableSchedulesController } from './available-schedules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AvailableSchedule, AvailableScheduleSchema } from './entities';

@Module({
  controllers: [AvailableSchedulesController],
  providers: [AvailableSchedulesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: AvailableSchedule.name,
        schema: AvailableScheduleSchema,
      },
    ]),
  ],
  exports: [MongooseModule]
})
export class AvailableSchedulesModule {}
