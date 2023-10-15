import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { AvailableSchedulesService } from './available-schedules.service';
import { CreateAvailableScheduleDto, UpdateAvailableScheduleDto } from './dto';

import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/enum';
import { ObjectId } from 'mongoose';

@Controller('available-schedules')
export class AvailableSchedulesController {
  constructor(
    private readonly availableSchedulesService: AvailableSchedulesService,
  ) {}

  @Post('create')
  @Auth(ValidRoles.TEACHER)
  create(
    @Body() createAvailableScheduleDto: CreateAvailableScheduleDto,
    @GetUser('id') idTeacher: string,
  ) {
    return this.availableSchedulesService.create(createAvailableScheduleDto, idTeacher);
  }

  @Get()
  findAll() {
    return this.availableSchedulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.availableSchedulesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAvailableScheduleDto: UpdateAvailableScheduleDto,
  ) {
    return this.availableSchedulesService.update(
      +id,
      updateAvailableScheduleDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.availableSchedulesService.remove(+id);
  }
}
