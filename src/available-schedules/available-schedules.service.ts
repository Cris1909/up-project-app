import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ObjectId } from 'mongoose';

import { AvailableSchedule } from './entities';
import { CreateAvailableScheduleDto, UpdateAvailableScheduleDto } from './dto';
import {
  getStartOfDay,
  getUTCHours,
  isPreviousDay,
  isSameDay,
} from 'src/helpers';
import { Errors } from 'src/enum';

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
    teacherId: string,
  ) {
    const { date, hours } = createAvailableScheduleDto;

    // Valida que las horas sean posteriores a la hora del dia que se crea
    if (isSameDay(new Date(), date)) this.hoursValidator(date, hours);

    // Filtra las horas que se repiten
    const filteredHours = this.filterRepeatHours(hours).sort((a, b) => a - b);

    // Fecha en la que inicia el dia ( horas, minutos y segundos en 0 )
    const startOfDay = getStartOfDay(date);

    try {
      const availableSchedule = await this.availableScheduleModel.create({
        teacherId,
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

  private async findOne(query: FilterQuery<AvailableSchedule>) {
    const availableSchedule = await this.availableScheduleModel.findOne(query);
    if (!availableSchedule)
      throw new NotFoundException(Errors.AVAILABLE_SCHEDULE_NOT_FOUND);
    return availableSchedule;
  }

  async update(
    _id: string,
    updateAvailableScheduleDto: UpdateAvailableScheduleDto,
  ) {
    const availableSchedule = await this.findOne({ _id });

    const { date } = availableSchedule;

    if (isPreviousDay(date))
      throw new BadRequestException(Errors.DATE_IS_PREVIOUS);

    const { hours } = updateAvailableScheduleDto;

    // Filtra las horas que se repiten
    const filteredHours = this.filterRepeatHours(hours).sort((a, b) => a - b);

    try {
      await availableSchedule.updateOne({ hours: filteredHours });
      return { ...availableSchedule.toJSON(), ...updateAvailableScheduleDto };
    } catch (error) {
      this.handleExceptions(error);
    }
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
