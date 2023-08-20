import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ParseMongoIdPipe } from 'src/common/pipes';
import { Errors } from 'src/constants';

const CREATE_CATEGORY_400 = `${Errors.CATEGORY_ALREADY_EXIST} | ${Errors.NAME_NOT_SEND} | ${Errors.NAME_MUST_BE_STRING} | ${Errors.NAME_TOO_SHORT}`;
const DEACTIVATE_CATEGORY_400 = `${Errors.INVALID_MONGO_ID} | ${Errors.CATEGORY_ALREADY_INACTIVE}`;
const ACTIVATE_CATEGORY_400 = `${Errors.INVALID_MONGO_ID} | ${Errors.CATEGORY_ALREADY_ACTIVE}`;

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Ruta para crear una categoría' })
  @ApiCreatedResponse({
    status: 201,
    description: 'Categoría creada',
    type: Category,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: CREATE_CATEGORY_400,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Ruta para obtener todas las categorías activas' })
  @ApiResponse({
    status: 200,
    description: 'Todas las categorías activas',
    isArray: true,
    type: Category,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: Errors.CATEGORIES_NOT_FOUND,
  })
  @Get()
  findAll() {
    return this.categoriesService.findAllActive();
  }

  @ApiOperation({ summary: 'Ruta para actualizar una categoría - solo nombre' })
  @ApiResponse({
    status: 200,
    description: 'Actualizado correctamente',
    type: Category,
  })
  @ApiBadRequestResponse({
    description: Errors.INVALID_MONGO_ID,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: Errors.CATEGORIES_NOT_FOUND,
  })
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Ruta para desactivar una categoría' })
  @ApiResponse({
    status: 200,
    description: 'Desactivada correctamente',
  })
  @ApiBadRequestResponse({
    description: DEACTIVATE_CATEGORY_400,
  })
  @ApiNotFoundResponse({
    description: Errors.CATEGORIES_NOT_FOUND,
  })
  @Patch('deactivate/:id')
  deactivate(@Param('id', ParseMongoIdPipe) id: string) {
    return this.categoriesService.deactivate(id);
  }

  @ApiOperation({ summary: 'Ruta para activar una categoría' })
  @ApiResponse({
    status: 200,
    description: 'Activada correctamente',
  })
  @ApiBadRequestResponse({
    description: ACTIVATE_CATEGORY_400,
  })
  @ApiNotFoundResponse({
    description: Errors.CATEGORIES_NOT_FOUND,
  })
  @Patch('activate/:id')
  activate(@Param('id', ParseMongoIdPipe) id: string) {
    return this.categoriesService.activate(id);
  }
}
