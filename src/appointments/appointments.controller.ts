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
  CreateAppointmentDto,
  RejectAppointmentDto,
  UpdateAppointmentStatusDto,
} from './dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { Errors, ValidRoles } from 'src/enum';
import { ParseMongoIdPipe } from 'src/common/pipes';
import { errorsToString, rolesRequired } from 'src/helpers';
import { Appointment } from './entities';

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
  Errors.APPOINTMENT_NOT_FOUND
);

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('create')
  @Auth(ValidRoles.USER)
  @ApiOperation({
    summary: 'Ruta para agendar una asesoría',
    description: rolesRequired(ValidRoles.USER),
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

  @Get('list-by-week')
  @ApiOperation({
    summary: 'Ruta para listar asesorías de la semana actual',
  })
  @ApiOkResponse({
    description: 'Lista de asesorías para la semana actual',
    isArray: true,
    type: Appointment,
  })
  async findByWeek(@Query('date') date: Date) {
    return await this.appointmentsService.findByWeek(date);
  }

  @Delete('delete/:id')
  @Auth(ValidRoles.TEACHER)
  @ApiOperation({
    summary: 'Ruta para eliminar una asesoría',
    description: rolesRequired(ValidRoles.TEACHER),
  })
  @ApiOkResponse({
    description: 'Eliminado con éxito',
  })
  async delete(@Param('id', ParseMongoIdPipe) id: string) {
    return await this.appointmentsService.delete(id);
  }

  @Patch('update-status/:id')
  @ApiOperation({
    summary: 'Actualizar el estado de una asesoría',
  })
  @ApiOkResponse({
    description: 'Estado de la asesoría actualizado con éxito',
  })
  @ApiBadRequestResponse({
    description: REJECTED_APPOINTMENT_400
  })
  @ApiNotFoundResponse({
    description: Errors.APPOINTMENT_NOT_FOUND,
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateAppointmentStatusDto,
  ) {
    await this.appointmentsService.updateStatus(id, updateStatusDto.status);
  }

  @Patch('reject-appointment/:id')
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
  async rejectAppointment(
    @Param('id') id: string,
    @Body() rejectAppointmentDto: RejectAppointmentDto,
  ) {
    await this.appointmentsService.rejectAppointment(id, rejectAppointmentDto);
  }
}
