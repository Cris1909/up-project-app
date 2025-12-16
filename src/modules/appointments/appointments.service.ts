import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, FilterQuery } from 'mongoose';

import { Appointment } from './entities';
import { AvailableSchedule } from 'src/modules/available-schedules/entities';
import {
  ApproveAppointmentDto,
  CompleteAppointmentDto,
  CreateAppointmentDto,
  RejectAppointmentDto,
  ReviewAppointmentDto,
  UpdateAppointmentDto,
} from './dto';

import { DateHelper, parseToObjectId, validateEnum } from 'src/helpers';
import { AppointmentStatus, Errors, PaymentStatus, ValidRoles } from 'src/enum';
import { User } from 'src/modules/auth/entities';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: PaginateModel<Appointment>,
    private readonly dateHelper: DateHelper,
    @InjectModel(AvailableSchedule.name)
    private readonly availableScheduleModel: PaginateModel<AvailableSchedule>,
    private readonly paymentsService: PaymentsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, userId: string) {
    const { date, hours, description, teacher, subject } = createAppointmentDto;

    const parseDate = this.dateHelper.getDate(date);
    const providedDate = this.dateHelper.getStartOfDay(parseDate);

    if (this.dateHelper.isPreviousDay(providedDate)) {
      throw new BadRequestException(Errors.DATE_IS_PREVIOUS);
    }

    const availableSchedule = await this.availableScheduleModel.findOne({
      date,
    });

    if (!availableSchedule) {
      throw new BadRequestException(Errors.AVAILABLE_SCHEDULE_NOT_FOUND);
    }

    if (this.dateHelper.isToday(providedDate)) {
      this.validateHours(hours);
    }

    this.validateAvailability(hours, availableSchedule);

    const existingAppointments = await this.appointmentModel.find({
      date,
      status: { $ne: AppointmentStatus.REJECTED },
    });

    this.validateNoTimeConflict(hours, existingAppointments);

    const filteredHours = this.filterAndSortHours(hours);

    try {
      const appointment = await this.appointmentModel.create({
        user: userId,
        date,
        hours: filteredHours,
        description,
        teacher,
        subject,
      });

      // Actualizar horas disponibles en el availableSchedule
      await this.availableScheduleModel.updateOne(
        { _id: availableSchedule._id },
        { $pull: { hours: { $in: filteredHours } } },
      );

      return appointment;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private validateAvailability(
    appointmentHours: number[],
    availableSchedule: AvailableSchedule,
  ) {
    const availableHoursSet = new Set(availableSchedule.hours);
    const invalidHours = appointmentHours.filter(
      (hour) => !availableHoursSet.has(hour),
    );

    if (invalidHours.length > 0) {
      throw new BadRequestException(Errors.HOURS_NOT_AVAILABLE);
    }
  }

  private validateNoTimeConflict(
    appointmentHours: number[],
    existingAppointments: Appointment[],
  ) {
    const existingHoursSet = new Set(
      existingAppointments.flatMap((appointment) => appointment.hours),
    );
    const conflictHours = appointmentHours.filter((hour) =>
      existingHoursSet.has(hour),
    );

    if (conflictHours.length > 0) {
      throw new BadRequestException(Errors.TIME_CONFLICT);
    }
  }

  private filterAndSortHours(hours: number[]) {
    const uniqueSortedHours = Array.from(new Set(hours)).sort((a, b) => a - b);
    return uniqueSortedHours;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const { hours, description } = updateAppointmentDto;

    const appointment = await this.findOne({ _id: id });
    const { date, user } = appointment;

    const availableSchedule = await this.availableScheduleModel.findOne({
      date,
    });

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

  async updateStatus(
    id: string,
    status: AppointmentStatus,
    rejectMessage?: string,
  ) {
    // Object.values(AppointmentStatus).includes(status)
    if (!validateEnum(AppointmentStatus, status)) {
      throw new BadRequestException(Errors.INVALID_APPOINTMENT_STATUS);
    }

    try {
      const appointment = await this.findOne({ _id: id });
      appointment.status = status;
      appointment.rejectMessage = rejectMessage;
      await appointment.save();
      return { ...appointment.toJSON(), status };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async approveAppointment(
    id: string,
    approveAppointmentDto: ApproveAppointmentDto,
  ) {
    const { value } = approveAppointmentDto;
    const approvedStatus = AppointmentStatus.PENDING;

    await this.updateStatus(id, approvedStatus);

    try {
      const appointment = await this.findOne({ _id: id });

      await this.paymentsService.create({
        appointment: appointment._id,
        status: PaymentStatus.PENDING,
        value,
      });

      return { ...appointment.toJSON(), status: approvedStatus };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async confirmAppointment(id: string) {
    const confirmStatus = AppointmentStatus.CONFIRMED;

    await this.updateStatus(id, confirmStatus);

    try {
      const appointment = await this.findOne({ _id: id });

      await this.paymentsService.updatePaymentStatus({
        appointmentId: id,
        newStatus: PaymentStatus.CONFIRMED,
      });

      return { ...appointment.toJSON(), status: confirmStatus };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async rejectAppointment(
    id: string,
    rejectAppointmentDto: RejectAppointmentDto,
  ) {
    const { rejectMessage } = rejectAppointmentDto;

    const rejectedStatus = AppointmentStatus.REJECTED;

    await this.updateStatus(id, rejectedStatus, rejectMessage);

    try {
      await this.paymentsService.updatePaymentStatus({
        appointmentId: id,
        newStatus: PaymentStatus.DENIED,
      });
    } catch (error) {}

    try {
      const appointment = await this.findOne({ _id: id });

      await this.restoreHoursInAvailableSchedule(appointment);

      return { ...appointment.toJSON(), status: rejectedStatus };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async completeAppointment(
    id: string,
    completeAppointmentDto?: CompleteAppointmentDto,
  ): Promise<Appointment> {
    const { data } = completeAppointmentDto;
    try {
      const appointment = await this.appointmentModel.findById(id);

      if (!appointment) {
        throw new BadRequestException(Errors.APPOINTMENT_NOT_FOUND);
      }

      const currentDate = new Date();
      const appointmentDate = new Date(appointment.date);

      if (currentDate < appointmentDate) {
        throw new BadRequestException(Errors.APPOINTMENT_IS_BEFORE);
      }

      appointment.status = AppointmentStatus.COMPLETED;
      appointment.data = data;
      await appointment.save();

      return appointment;
    } catch (error) {
      throw new BadRequestException('Failed to complete appointment');
    }
  }

  private async restoreHoursInAvailableSchedule(appointment: Appointment) {
    const { date, hours } = appointment;

    // Obtener el availableSchedule para la fecha de la cita
    const availableSchedule = await this.availableScheduleModel.findOne({
      date,
    });

    if (availableSchedule) {
      // Agregar las horas de la cita de vuelta al availableSchedule
      await this.availableScheduleModel.updateOne(
        { _id: availableSchedule._id },
        { $addToSet: { hours: { $each: hours } } },
      );
    }
  }

  async getAppointmentById(_id: string, user: User) {
    const appointment = await this.appointmentModel.aggregate([
      {
        $match: {
          _id: parseToObjectId(_id),
        },
      },
      {
        $lookup: {
          from: 'payments',
          localField: '_id',
          foreignField: 'appointment',
          as: 'payment',
        },
      },
    ]);

    const parseAppointment: any = appointment[0];

    if (!appointment.length)
      throw new NotFoundException(Errors.APPOINTMENT_NOT_FOUND);

    if (
      user.roles.includes(ValidRoles.STUDENT) &&
      user.id !== parseAppointment.user.toString()
    )
      throw new BadRequestException(Errors.APPOINTMENT_NOT_ACCESSIBLE);

    parseAppointment.payment = parseAppointment?.payment[0];
    return parseAppointment;
  }

  async findByWeek(date: Date, user: User) {
    const { roles, _id } = user;

    const isTeacherOrAdmin = roles.some(
      (e) => e === ValidRoles.TEACHER || e === ValidRoles.ADMIN,
    );

    const parseDate = this.dateHelper.getDate(date);
    const { startOfWeek, endOfWeek } =
      this.dateHelper.getStartAndEndWeek(parseDate);

    const whoGet = isTeacherOrAdmin
      ? {}
      : { user: { $eq: parseToObjectId(_id) } };

    const query: FilterQuery<Appointment> = {
      ...whoGet,
      status: { $ne: AppointmentStatus.REJECTED },
      date: {
        $gte: startOfWeek.format('YYYY-MM-DD'),
        $lte: endOfWeek.format('YYYY-MM-DD'),
      },
    };

    const appointments = await this.appointmentModel
      .find(query)
      .populate(['teacher', 'user', 'subject']);

    return appointments;
  }

  async addReview(
    appointmentId: string,
    reviewDto: ReviewAppointmentDto,
  ): Promise<Appointment> {
    const { value, text } = reviewDto;
    try {
      const appointment = await this.appointmentModel.findById(appointmentId);

      if (!appointment) {
        throw new NotFoundException(Errors.APPOINTMENT_NOT_FOUND);
      }

      appointment.review = { value, text };

      return await appointment.save();
    } catch (error) {
      throw new BadRequestException('Failed to add review');
    }
  }

  async getAppointmentsBySubject() {
    const appointmentsBySubject = await this.appointmentModel.aggregate([
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'subjects',
          localField: '_id',
          foreignField: '_id',
          as: 'subjectDetails',
        },
      },
      {
        $unwind: '$subjectDetails',
      },
      {
        $project: {
          _id: 0,
          subject: '$subjectDetails',
          count: 1,
        },
      },
    ]);

    return appointmentsBySubject;
  }

  async getAppointmentHours() {
    const appointmentHours = await this.appointmentModel.aggregate([
      {
        $match: {
          status: { $eq: AppointmentStatus.COMPLETED },
        },
      },
      {
        $group: {
          _id: { $hour: '$completedAt' },
          totalHours: { $sum: { $size: '$hours' } },
        },
      },
    ]);
    const result = appointmentHours[0]?.totalHours || 0;
    return result;
  }

  async getAverageRating(): Promise<number> {
    const averageRating = await this.appointmentModel.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$review.value' },
        },
      },
    ]);

    return averageRating.length > 0 ? averageRating[0].averageRating : 0;
  }

  async getCompletedAppointments() {
    const result = await this.appointmentModel.count({
      status: AppointmentStatus.COMPLETED,
    });
    // const result = appointmentHours[0]?.totalHours || 0;
    return result;
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
