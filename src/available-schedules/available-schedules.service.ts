import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, FilterQuery } from 'mongoose';
import { AvailableSchedule } from './entities';
import { CreateAvailableScheduleDto, UpdateAvailableScheduleDto } from './dto';
import { Errors } from 'src/enum';
import { DateHelper } from 'src/helpers';

@Injectable()
export class AvailableSchedulesService {
  private readonly logger = new Logger(AvailableSchedulesService.name);

  constructor(
    @InjectModel(AvailableSchedule.name)
    private readonly availableScheduleModel: PaginateModel<AvailableSchedule>,
    private readonly dateHelper: DateHelper,
  ) {}

  async create(
    createAvailableScheduleDto: CreateAvailableScheduleDto,
    teacherId: string,
  ) {
    const { date, hours } = createAvailableScheduleDto;

    const parseDate = this.dateHelper.getDate(date);

    const providedDate = this.dateHelper.getStartOfDay(parseDate);

    if (this.dateHelper.isPreviousDay(providedDate)) {
      throw new BadRequestException(Errors.DATE_IS_PREVIOUS);
    }

    if (this.dateHelper.isToday(providedDate)) {
      this.validateHours(hours);
    }

    const filteredHours = this.filterRepeatHours(hours).sort((a, b) => a - b);

    try {
      const availableSchedule = await this.availableScheduleModel.create({
        teacherId,
        date,
        hours: filteredHours,
      });
      return availableSchedule;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(
    _id: string,
    updateAvailableScheduleDto: UpdateAvailableScheduleDto,
  ) {
    const { hours } = updateAvailableScheduleDto;

    const availableSchedule = await this.findOne({ _id });

    const { date } = availableSchedule;

    const parseDate = this.dateHelper.getDate(date);

    if (this.dateHelper.isPreviousDay(parseDate)) {
      throw new BadRequestException(Errors.DATE_IS_PREVIOUS);
    }

    if (this.dateHelper.isToday(parseDate)) {
      this.validateHours(hours);
    }

    const filteredHours = this.filterRepeatHours(hours).sort((a, b) => a - b);

    try {
      await availableSchedule.updateOne({ hours: filteredHours });
      return { ...availableSchedule.toJSON(), ...updateAvailableScheduleDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByWeek(date: Date) {
    const parseDate = this.dateHelper.getDate(date);

    const { startOfWeek, endOfWeek } =
      this.dateHelper.getStartAndEndWeek(parseDate);

    const query: FilterQuery<AvailableSchedule> = {
      date: {
        $gte: startOfWeek.format('YYYY-MM-DD'),
        $lte: endOfWeek.format('YYYY-MM-DD'),
      },
    };

    const availableSchedules = await this.availableScheduleModel.find(query);

    return availableSchedules;
  }

  async delete(_id: string) {
    await this.findOne({ _id });
    try {
      await this.availableScheduleModel.deleteOne({ _id });
      return {success: true}
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private async findOne(query: FilterQuery<AvailableSchedule>) {
    const availableSchedule = await this.availableScheduleModel.findOne(query);
    if (!availableSchedule) {
      throw new NotFoundException(Errors.AVAILABLE_SCHEDULE_NOT_FOUND);
    }
    return availableSchedule;
  }

  private filterRepeatHours(hours: number[]) {
    return hours.filter((value, index, self) => self.indexOf(value) === index);
  }

  private validateHours(hours: number[]) {
    const currentHour = this.dateHelper.hour();
    if (hours.some((hour) => hour <= currentHour)) {
      throw new BadRequestException(Errors.HOURS_INVALID);
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(Errors.AVAILABLE_SCHEDULE_EXIST);
    }
    this.logger.error(error);
    throw new BadRequestException(Errors.SERVER_ERROR);
  }
}
