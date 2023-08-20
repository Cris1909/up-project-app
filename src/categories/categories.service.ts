import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
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

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const category = await this.categoryModel.create(createCategoryDto);
      return category;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private async findMany(query: FilterQuery<Category>): Promise<Category[]> {
    const categories = await this.categoryModel.find(query);
    if (!categories || !categories.length)
      throw new NotFoundException(Errors.CATEGORIES_NOT_FOUND);
    return categories;
  }

  async findAll() {
    return this.findMany({});
  }

  async findAllActive() {
    return this.findMany({ active: true });
  }

  private async findOne(query: FilterQuery<Category>) {
    const category = await this.categoryModel.findOne(query);
    if (!category) throw new NotFoundException(Errors.CATEGORIES_NOT_FOUND);
    return category;
  }

  async update(_id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne({ _id, active: true });
    try {
      await category.updateOne(updateCategoryDto);
      return { ...category.toJSON(), ...updateCategoryDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private async changeActivationStatus(_id: string, active: boolean) {
    const category = await this.findOne({ _id });
    if (category.active === active) {
      throw new BadRequestException(
        active
          ? Errors.CATEGORY_ALREADY_ACTIVE
          : Errors.CATEGORY_ALREADY_INACTIVE,
      );
    }
    try {
      await category.updateOne({ active });
      return { success: true };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async deactivate(_id: string) {
    return this.changeActivationStatus(_id, false);
  }

  async activate(_id: string) {
    return this.changeActivationStatus(_id, true);
  }

  private handleExceptions(error: any) {
    if (error.code === 11000)
      throw new BadRequestException(Errors.CATEGORY_ALREADY_EXIST);
    this.logger.error(error);
    throw new InternalServerErrorException(Errors.SERVER_ERROR);
  }
}
