import { Controller, Get, Post, Body } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Role } from './entities';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto';

import { Errors, ValidRoles } from 'src/enum';

const CREATE_ROLE_400 = `${Errors.ROLE_ALREADY_EXIST} | ${Errors.NAME_NOT_SEND} | ${Errors.NAME_MUST_BE_STRING} | ${Errors.NAME_TOO_SHORT} | ${Errors.ROLE_MUST_BE_ENUM}`;

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('create')
  @ApiOperation({
    summary: `Ruta para crear un rol => [${Object.values(ValidRoles)}]`,
  })
  @ApiCreatedResponse({
    description: 'Rol creado',
    type: Role,
  })
  @ApiBadRequestResponse({
    description: CREATE_ROLE_400,
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get('list-all')
  @ApiOperation({
    summary: 'Ruta para obtener todos los roles',
  })
  @ApiOkResponse({
    description: 'Todas las roles',
    isArray: true,
    type: Role,
  })
  @ApiNotFoundResponse({
    description: Errors.ROLE_NOT_FOUND,
  })
  findAll() {
    return this.rolesService.findAll();
  }
}
