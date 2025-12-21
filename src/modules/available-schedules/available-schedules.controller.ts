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

import { AvailableSchedulesService } from './available-schedules.service';
import { CreateAvailableScheduleDto, UpdateAvailableScheduleDto } from './dto';
import { Auth, GetUser } from 'src/modules/auth/decorators';
import { Errors, ValidRoles } from 'src/enum';
import { ParseMongoIdPipe } from 'src/common/pipes';
import { errorsToString, rolesRequired } from 'src/helpers';
import { AvailableSchedule } from './entities';

const CREATE_AVAILABLE_SCHEDULE_400 = errorsToString(
  Errors.DATE_INVALID_FORMAT,
  Errors.HOURS_INVALID,
  Errors.DATE_IS_PREVIOUS,
  Errors.HOURS_EMPTY,
);

const UPDATE_AVAILABLE_SCHEDULE_400 = errorsToString(
  Errors.INVALID_MONGO_ID,
  Errors.HOURS_INVALID,
);
@ApiTags('AvailableSchedules')
@Controller('available-schedules')
export class AvailableSchedulesController {
  constructor(
    private readonly availableSchedulesService: AvailableSchedulesService,
  ) {}

  @Post('create')
  @Auth(ValidRoles.TEACHER)
  @ApiOperation({
    summary: 'Ruta para registrar un horario disponible',
    description: rolesRequired(ValidRoles.ADMIN),
  })
  @ApiCreatedResponse({
    description: 'Horario disponible creado',
    type: AvailableSchedule,
  })
  @ApiBadRequestResponse({
    description: CREATE_AVAILABLE_SCHEDULE_400,
  })
  async create(
    @Body() createAvailableScheduleDto: CreateAvailableScheduleDto,
    @GetUser('id') teacherId: string,
  ) {
    return await this.availableSchedulesService.create(
      createAvailableScheduleDto,
      teacherId,
    );
  }

  @Patch('update-hours/:id')
  @Auth(ValidRoles.TEACHER)
  @ApiOperation({
    summary: 'Ruta para actualizar las horas un horario disponible',
    description: rolesRequired(ValidRoles.ADMIN),
  })
  @ApiOkResponse({
    description: 'Actualizado correctamente',
    type: AvailableSchedule,
  })
  @ApiBadRequestResponse({
    description: Errors.INVALID_MONGO_ID,
  })
  @ApiNotFoundResponse({
    description: Errors.AVAILABLE_SCHEDULE_NOT_FOUND,
  })
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateAvailableScheduleDto: UpdateAvailableScheduleDto,
  ) {
    return await this.availableSchedulesService.update(
      id,
      updateAvailableScheduleDto,
    );
  }

  @Get('list-by-week')
  @ApiOperation({
    summary:
      'Ruta para listar los horarios disponibles de la semana de una fecha',
  })
  @ApiOkResponse({
    description: 'Lista de horarios disponibles de la semana de una fecha',
    isArray: true,
    type: AvailableSchedule,
  })
  async findByWeek(@Query('date') date: Date) {
    return await this.availableSchedulesService.findByWeek(date);
  }

  @Delete('delete/:id')
  @Auth(ValidRoles.TEACHER)
  @ApiOperation({
    summary: 'Ruta para eliminar un horario disponible',
    description: rolesRequired(ValidRoles.ADMIN),
  })
  @ApiOkResponse({
    description: 'Borrado correctamente',
  })
  async delete(@Param('id', ParseMongoIdPipe) id: string) {
    return await this.availableSchedulesService.delete(id);
  }
}
