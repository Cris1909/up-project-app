import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, FilterQuery } from 'mongoose';

import { Appointment } from './entities';
import { AvailableSchedule } from 'src/available-schedules/entities';
import { CreateAppointmentDto, UpdateAppointmentDto, UpdateAppointmentStatusDto } from './dto';

import { DateHelper } from 'src/helpers';
import { AppointmentStatus, Errors } from 'src/enum';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: PaginateModel<Appointment>,
    private readonly dateHelper: DateHelper,
    @InjectModel(AvailableSchedule.name) 
    private readonly availableScheduleModel: PaginateModel<AvailableSchedule>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, userId: string) {
    const { date, hours,description, teacher, subject } = createAppointmentDto;
  
    const parseDate = this.dateHelper.getDate(date);
    const providedDate = this.dateHelper.getStartOfDay(parseDate);
  
    if (this.dateHelper.isPreviousDay(providedDate)) {
      throw new BadRequestException(Errors.DATE_IS_PREVIOUS);
    }

    const availableSchedule = await this.availableScheduleModel.findOne({ date });

    if (!availableSchedule) {
      throw new BadRequestException(Errors.AVAILABLE_SCHEDULE_NOT_FOUND);
    }
  
    if (this.dateHelper.isToday(providedDate)) {
      this.validateHours(hours);
    }

    this.validateAvailability(hours, availableSchedule);

    const existingAppointments = await this.appointmentModel.find({
      date,
      // user: userId,
    });

    this.validateNoTimeConflict(hours, existingAppointments);
  
    const filteredHours = this.filterRepeatHours(hours).sort((a, b) => a - b);
  
    try {
      const appointment = await this.appointmentModel.create({
        user: userId,
        date,
        hours: filteredHours,
        description, teacher, subject
      });
      return appointment;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  
  private validateAvailability(appointmentHours: number[], availableSchedule: AvailableSchedule) {
    const availableHoursSet = new Set(availableSchedule.hours);
    const invalidHours = appointmentHours.filter(hour => !availableHoursSet.has(hour));
    
    if (invalidHours.length > 0) {
      throw new BadRequestException(Errors.HOURS_NOT_AVAILABLE);
    }
  }
  
  private validateNoTimeConflict(appointmentHours: number[], existingAppointments: Appointment[]) {
    const existingHoursSet = new Set(existingAppointments.flatMap(appointment => appointment.hours));
    const conflictHours = appointmentHours.filter(hour => existingHoursSet.has(hour));
    
    if (conflictHours.length > 0) {
      throw new BadRequestException(Errors.TIME_CONFLICT);
    }
  }
  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const { hours, description } = updateAppointmentDto;
  
    const appointment = await this.findOne({ _id: id });
    const { date, user } = appointment;
  
    const availableSchedule = await this.availableScheduleModel.findOne({ date });
  
    if (!availableSchedule) {
      throw new BadRequestException(Errors.AVAILABLE_SCHEDULE_NOT_FOUND);
    }
  
    this.validateAvailability(hours, availableSchedule);
  
    const existingAppointments = await this.appointmentModel.find({
      date,
      user,
      _id: { $ne: id },
    });
  
    this.validateNoTimeConflict(hours, existingAppointments);
  
    const filteredHours = this.filterRepeatHours(hours).sort((a, b) => a - b);
  
    try {
      await appointment.updateOne({ hours: filteredHours, description });
      return { ...appointment.toJSON(), ...updateAppointmentDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async updateStatus(id: string, updateStatusDto: UpdateAppointmentStatusDto) {
    const { status } = updateStatusDto;

    if (!Object.values(AppointmentStatus).includes(status)) {
      throw new BadRequestException(Errors.INVALID_APPOINTMENT_STATUS);
    }

    try {
      const appointment = await this.findOne({ _id: id });
      appointment.status = status;
      await appointment.save();
      return { ...appointment.toJSON(), status };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByWeek(date: Date) {
    const parseDate = this.dateHelper.getDate(date);
    const { startOfWeek, endOfWeek } = this.dateHelper.getStartAndEndWeek(parseDate);

    const query: FilterQuery<Appointment> = {
      date: {
        $gte: startOfWeek.format('YYYY-MM-DD'),
        $lte: endOfWeek.format('YYYY-MM-DD'),
      },
    };

    const appointments = await this.appointmentModel.find(query).populate(['teacher', 'user', 'subject']);

    return appointments;
  }

  async delete(id: string) {
    await this.findOne({ _id: id });
    try {
      await this.appointmentModel.deleteOne({ _id: id });
      return { success: true };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private async findOne(query: FilterQuery<Appointment>) {
    const appointment = await this.appointmentModel.findOne(query);
    if (!appointment) {
      throw new NotFoundException(Errors.APPOINTMENT_NOT_FOUND);
    }
    return appointment;
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
      throw new BadRequestException(Errors.APPOINTMENT_ALREADY_EXIST);
    }
    this.logger.error(error);
    throw new BadRequestException(Errors.SERVER_ERROR);
  }
}