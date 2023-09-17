import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Subject } from './entities/subject.entity';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto';

import { ParseMongoIdPipe } from 'src/common/pipes';
import { Errors } from 'src/constants';

const CREATE_SUBJECT_400 = `${Errors.SUBJECT_ALREADY_EXIST} | ${Errors.NAME_NOT_SEND} | ${Errors.NAME_MUST_BE_STRING} | ${Errors.NAME_TOO_SHORT}`;

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Ruta para crear una materia' })
  @ApiCreatedResponse({
    status: 201,
    description: 'Materia creada',
    type: Subject,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: CREATE_SUBJECT_400,
  })
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @ApiOperation({ summary: 'Ruta para obtener todas las materias activas' })
  @ApiResponse({
    status: 200,
    description: 'Todas las materias activas',
    isArray: true,
    type: Subject,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: Errors.SUBJECTS_NOT_FOUND,
  })
  @Get()
  findAllActive() {
    return this.subjectsService.findAllActive();
  }

  @ApiOperation({
    summary: 'Ruta para obtener todas las materias existentes',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas las materias (activas - inactivas)',
    isArray: true,
    type: Subject,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: Errors.SUBJECTS_NOT_FOUND,
  })
  @Get('list-all')
  findAll() {
    return this.subjectsService.findAll();
  }

  @ApiOperation({ summary: 'Ruta para actualizar una materia' })
  @ApiResponse({
    status: 200,
    description: 'Actualizado correctamente',
    type: Subject,
  })
  @ApiBadRequestResponse({
    description: Errors.INVALID_MONGO_ID,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: Errors.SUBJECTS_NOT_FOUND,
  })
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

}
