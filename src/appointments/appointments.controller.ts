import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AppointmentsService } from './appointments.service';
import {
  ApproveAppointmentDto,
  CompleteAppointmentDto,
  CreateAppointmentDto,
  RejectAppointmentDto,
  ReviewAppointmentDto,
  UpdateAppointmentStatusDto,
} from './dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { Errors, ValidRoles } from 'src/enum';
import { ParseMongoIdPipe } from 'src/common/pipes';
import { errorsToString, rolesRequired } from 'src/helpers';
import { Appointment } from './entities';
import { User } from 'src/auth/entities';

const CREATE_APPOINTMENT_400 = errorsToString(
  Errors.DATE_INVALID_FORMAT,
  Errors.HOURS_INVALID,
  Errors.DATE_IS_PREVIOUS,
  Errors.HOURS_EMPTY,
  Errors.DESCRIPTION_INVALID,
  Errors.TEACHER_ID_INVALID,
  Errors.SUBJECT_ID_INVALID,
  Errors.STATUS_INVALID,
);

const REJECTED_APPOINTMENT_400 = errorsToString(
  Errors.INVALID_APPOINTMENT_STATUS,
  Errors.APPOINTMENT_NOT_FOUND,
);

const COMPLETE_APPOINTMENT_400 = Errors.INVALID_APPOINTMENT_STATUS;

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('create')
  @Auth(ValidRoles.STUDENT)
  @ApiOperation({
    summary: 'Ruta para agendar una asesoría',
    description: rolesRequired(ValidRoles.STUDENT),
  })
  @ApiCreatedResponse({
    description: 'Asesoría creada',
    type: Appointment,
  })
  @ApiBadRequestResponse({
    description: CREATE_APPOINTMENT_400,
  })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @GetUser('id') userId: string,
  ) {
    return await this.appointmentsService.create(createAppointmentDto, userId);
  }

  @Auth()
  @Get('list-by-week')
  @ApiOperation({
    summary: 'Ruta para listar asesorías de la semana actual',
  })
  @ApiOkResponse({
    description: 'Lista de asesorías para la semana actual',
    isArray: true,
    type: Appointment,
  })
  async findByWeek(@Query('date') date: Date, @GetUser() user: User,) {
    return await this.appointmentsService.findByWeek(date, user);
  }

  @ApiOperation({
    summary: 'Ruta para eliminar una asesoría',
    description: rolesRequired(ValidRoles.TEACHER),
  })
  @ApiOkResponse({
    description: 'Eliminado con éxito',
  })
  @Auth(ValidRoles.TEACHER)
  @Delete('delete/:id')
  async delete(@Param('id', ParseMongoIdPipe) id: string) {
    return await this.appointmentsService.delete(id);
  }
  
  @ApiOperation({
    summary: 'Actualizar el estado de una asesoría',
  })
  @ApiOkResponse({
    description: 'Estado de la asesoría actualizado con éxito',
  })
  @ApiBadRequestResponse({
    description: REJECTED_APPOINTMENT_400,
  })
  @ApiNotFoundResponse({
    description: Errors.APPOINTMENT_NOT_FOUND,
  })
  @Auth(ValidRoles.TEACHER)
  @Patch('update-status/:id')
  async updateStatus(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateStatusDto: UpdateAppointmentStatusDto,
  ) {
    await this.appointmentsService.updateStatus(id, updateStatusDto.status);
  }

  @ApiOperation({
    summary: 'Pasar a rechazada una asesoría',
  })
  @ApiOkResponse({
    description: 'Asesoría rechazada exitosamente',
  })
  @ApiBadRequestResponse({
    description: Errors.INVALID_APPOINTMENT_STATUS,
  })
  @ApiNotFoundResponse({
    description: Errors.APPOINTMENT_NOT_FOUND,
  })
  @Auth(ValidRoles.TEACHER)
  @Patch('reject-appointment/:id')
  async rejectAppointment(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() rejectAppointmentDto: RejectAppointmentDto,
  ) {
    await this.appointmentsService.rejectAppointment(id, rejectAppointmentDto);
  }

  @ApiOperation({
    summary: 'Aprobar una asesoría por id',
  })
  @Auth(ValidRoles.TEACHER)
  @Post('approve-appointment/:id')
  async approveAppointment(
    @Param('id') id: string,
    @Body() approveAppointmentDto: ApproveAppointmentDto,
  ) {
    return this.appointmentsService.approveAppointment(
      id,
      approveAppointmentDto,
    );
  }

  @ApiOperation({
    summary: 'Obtener una asesoría por id',
  })
  @ApiBadRequestResponse({
    description: Errors.APPOINTMENT_NOT_ACCESSIBLE,
  })
  @ApiNotFoundResponse({
    description: Errors.APPOINTMENT_NOT_FOUND,
  })
  @Auth(ValidRoles.ADMIN, ValidRoles.TEACHER, ValidRoles.STUDENT)
  @Get('/appointment-by-id/:id')
  async getAppointmentById(
    @Param('id', ParseMongoIdPipe) id: string,
    @GetUser() user: User,
  ) {
    return this.appointmentsService.getAppointmentById(id, user);
  }

  @ApiOperation({
    summary: 'Confirmar una asesoría por id',
  })
  @Auth(ValidRoles.TEACHER)
  @Post('confirm-appointment/:id')
  async confirmAppointment(@Param('id') id: string) {
    return this.appointmentsService.confirmAppointment(id);
  }

  @ApiOperation({
    summary: 'Completar una asesoría',
  })
  @ApiOkResponse({
    description: 'Asesoría completada exitosamente',
  })
  @ApiBadRequestResponse({
    description: COMPLETE_APPOINTMENT_400,
  })
  @ApiNotFoundResponse({
    description: Errors.APPOINTMENT_NOT_FOUND,
  })
  @Auth(ValidRoles.TEACHER)
  @Patch('complete-appointment/:id')
  async completeAppointment(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() completeAppointmentDto: CompleteAppointmentDto,
  ) {
    return this.appointmentsService.completeAppointment(id, completeAppointmentDto);
  }

  @ApiOperation({
    summary: 'Agregar una revisión a una asesoría',
  })
  @ApiOkResponse({
    description: 'Revisión agregada con éxito',
    type: Appointment,
  })
  @ApiBadRequestResponse({
    description: Errors.INVALID_REVIEW_DATA,
  })
  @ApiNotFoundResponse({
    description: Errors.APPOINTMENT_NOT_FOUND,
  })
  @Auth(ValidRoles.STUDENT, ValidRoles.TEACHER)
  @Post('add-review/:id')
  async addReview(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() reviewDto: ReviewAppointmentDto,
  ) {
    return await this.appointmentsService.addReview(id, reviewDto);
  }
}
