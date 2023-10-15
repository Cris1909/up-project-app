import { Injectable } from '@nestjs/common';
import { CreateAvailableScheduleDto } from './dto/create-available-schedule.dto';
import { UpdateAvailableScheduleDto } from './dto/update-available-schedule.dto';

@Injectable()
export class AvailableSchedulesService {
  create(createAvailableScheduleDto: CreateAvailableScheduleDto, idTeacher: string) {
    return 'This action adds a new availableSchedule';
  }

  findAll() {
    return `This action returns all availableSchedules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} availableSchedule`;
  }

  update(id: number, updateAvailableScheduleDto: UpdateAvailableScheduleDto) {
    return `This action updates a #${id} availableSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} availableSchedule`;
  }
}
