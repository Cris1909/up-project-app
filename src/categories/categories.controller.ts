import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Errors } from 'src/constants';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

const createCategory400 = `${Errors.CATEGORY_ALREADY_EXIST} | ${Errors.NAME_NOT_SEND} | ${Errors.NAME_MUST_BE_STRING} | ${Errors.NAME_TOO_SHORT}`;

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Ruta para crear una categoría' })
  @ApiResponse({ status: 201, description: 'Categoría creada', type: Category })
  @ApiResponse({
    status: 400,
    description: createCategory400,
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
  @ApiResponse({
    status: 400,
    description: Errors.CATEGORIES_NOT_FOUND,
  })
  @Get()
  findAll() {
    return this.categoriesService.findAllActive();
  }

  @ApiOperation({ summary: 'Ruta para actualizar una categoría - solo nombre'})
  @ApiResponse({
    status: 200,
    description: 'Actualizado correctamente',
    type: Category,
  })
  @ApiResponse({
    status: 400,
    description: Errors.CATEGORIES_NOT_FOUND,
  })
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
