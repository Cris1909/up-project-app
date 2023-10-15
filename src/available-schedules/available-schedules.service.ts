import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateAvailableScheduleDto } from './dto/create-available-schedule.dto';
import { UpdateAvailableScheduleDto } from './dto/update-available-schedule.dto';
import { getStartOfDay, getUTCHours } from 'src/helpers';
import { Model, ObjectId } from 'mongoose';
import { Errors } from 'src/enum';
import { InjectModel } from '@nestjs/mongoose';
import { AvailableSchedule } from './entities';

@Injectable()
export class AvailableSchedulesService {
  private readonly logger = new Logger(AvailableSchedulesService.name);

  constructor(
    @InjectModel(AvailableSchedule.name)
    private readonly availableScheduleModel: Model<AvailableSchedule>,
  ) {}

  private hoursValidator = (date: Date, hours: number[]) => {
    const currentHour = date.getHours() - getUTCHours(new Date());
    if (hours.some((hour) => hour <= currentHour))
      throw new BadRequestException(Errors.HOURS_INVALID);
  };

  private filterRepeatHours = (hours: number[]) => {
    return hours.filter((value, index, self) => self.indexOf(value) === index);
  };

  async create(
    createAvailableScheduleDto: CreateAvailableScheduleDto,
    idTeacher: string,
  ) {
    const { date, hours } = createAvailableScheduleDto;

    // Valida que las horas sean posteriores a la hora del dia que se crea
    if (new Date().getTime() > date.getTime()) this.hoursValidator(date, hours);

    // Filtra las horas que se repiten
    const filteredHours = this.filterRepeatHours(hours);

    // Fecha en la que inicia el dia ( horas, minutos y segundos en 0 )
    const startOfDay = getStartOfDay(date);

    try {
      const availableSchedule = await this.availableScheduleModel.create({
        idTeacher,
        date: startOfDay,
        hours: filteredHours,
      });
      return availableSchedule;
    } catch (error) {
      this.handleExceptions(error);
    }
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

  private handleExceptions(error: any) {
    if (error.code === 11000)
      throw new BadRequestException(Errors.AVAILABLE_SCHEDULE_EXIST);
    this.logger.error(error);
    throw new InternalServerErrorException(Errors.SERVER_ERROR);
  }
}
