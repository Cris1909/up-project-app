import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Errors } from 'src/constants';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger('CategoriesService');

  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.categoryModel.create(createCategoryDto);
      return category;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAllActive() {
    const categories = await this.categoryModel.find({ active: true });
    if (!categories || !categories.length)
      throw new NotFoundException(Errors.CATEGORIES_NOT_FOUND);
    return categories;
  }

  async findOne(_id: string) {
    const category = await this.categoryModel.findOne({ _id, active: true });
    if (!category) throw new NotFoundException(Errors.CATEGORIES_NOT_FOUND);
    return category;
  }

  async update(_id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(_id);
    try {
      await category.updateOne(updateCategoryDto);
      return { ...category.toJSON(), ...updateCategoryDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} category`;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000)
      throw new BadRequestException(Errors.CATEGORY_ALREADY_EXIST);
    this.logger.error(error);
    throw new InternalServerErrorException(Errors.SERVER_ERROR);
  }
}
