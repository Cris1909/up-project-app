import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Delete,
  Query,
  BadRequestException,
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
  UpdateAppointmentDto,
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

const UPDATE_APPOINTMENT_400 = errorsToString(
  Errors.INVALID_MONGO_ID,
  Errors.HOURS_INVALID,
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

  // @Patch('update-hours/:id')
  // @Auth(ValidRoles.TEACHER)
  // @ApiOperation({
  //   summary: 'Ruta para actualizar las horas de una asesoría',
  //   description: rolesRequired(ValidRoles.TEACHER),
  // })
  // @ApiOkResponse({
  //   description: 'Actualizado con éxito',
  //   type: Appointment,
  // })
  // @ApiBadRequestResponse({
  //   description: UPDATE_APPOINTMENT_400,
  // })
  // @ApiNotFoundResponse({
  //   description: Errors.APPOINTMENT_NOT_FOUND,
  // })
  // async update(
  //   @Param('id', ParseMongoIdPipe) id: string,
  //   @Body() updateAppointmentDto: UpdateAppointmentDto,
  // ) {
  //   return await this.appointmentsService.update(id, updateAppointmentDto);
  // }

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
    description: Errors.INVALID_APPOINTMENT_STATUS,
  })
  @ApiNotFoundResponse({
    description: Errors.APPOINTMENT_NOT_FOUND,
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateAppointmentStatusDto,
  ) {
    try {
      await this.appointmentsService.updateStatus(id, updateStatusDto);
      return { success: true };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException(Errors.SERVER_ERROR);
    }
  }

}
