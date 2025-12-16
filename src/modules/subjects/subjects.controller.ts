import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Subject } from './entities/subject.entity';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto';

import { ParseMongoIdPipe } from 'src/common/pipes';
import { Errors, ValidRoles } from 'src/enum';
import { errorsToString, rolesRequired } from 'src/helpers';
import { Auth } from 'src/modules/auth/decorators';

const CREATE_SUBJECT_400 = errorsToString(
  Errors.SUBJECT_ALREADY_EXIST,
  Errors.NAME_NOT_SEND,
  Errors.NAME_MUST_BE_STRING,
  Errors.NAME_TOO_SHORT,
  Errors.IMG_MUST_BE_URL,
  Errors.IMG_NOT_SEND
);
@ApiTags('Subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post('create')
  @Auth(ValidRoles.ADMIN)
  @ApiOperation({
    summary: 'Ruta para crear una materia',
    description: rolesRequired(ValidRoles.ADMIN),
  })
  @ApiCreatedResponse({
    description: 'Materia creada',
    type: Subject,
  })
  @ApiBadRequestResponse({
    description: CREATE_SUBJECT_400,
  })
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get('list-active')
  @Auth()
  @ApiOperation({
    summary: 'Ruta para obtener todas las materias activas',
    description: rolesRequired(),
  })
  @ApiOkResponse({
    description: 'Todas las materias activas',
    isArray: true,
    type: Subject,
  })
  @ApiNotFoundResponse({
    description: Errors.SUBJECTS_NOT_FOUND,
  })
  findAllActive() {
    return this.subjectsService.findAllActive();
  }

  @Get('list-all')
  @Auth(ValidRoles.ADMIN)
  @ApiOperation({
    summary: 'Ruta para obtener todas las materias existentes',
    description: rolesRequired(ValidRoles.ADMIN),
  })
  @ApiOkResponse({
    description: 'Todas las materias (activas - inactivas)',
    isArray: true,
    type: Subject,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: Errors.SUBJECTS_NOT_FOUND,
  })
  findAll() {
    return this.subjectsService.findAll();
  }

  @Patch(['update/:id'])
  @Auth(ValidRoles.ADMIN)
  @ApiOperation({
    summary: 'Ruta para actualizar una materia',
    description: rolesRequired(ValidRoles.ADMIN),
  })
  @ApiOkResponse({
    description: 'Actualizado correctamente',
    type: Subject,
  })
  @ApiBadRequestResponse({
    description: Errors.INVALID_MONGO_ID,
  })
  @ApiNotFoundResponse({
    description: Errors.SUBJECTS_NOT_FOUND,
  })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectsService.update(id, updateSubjectDto);
  }
}
