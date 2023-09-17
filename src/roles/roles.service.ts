import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Role } from './entities';
import { CreateRoleDto } from './dto';

import { Errors } from 'src/enum';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = await this.roleModel.create(createRoleDto);
      return role;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private async findMany(query: FilterQuery<Role>): Promise<Role[]> {
    const roles = await this.roleModel.find(query).select('-__v');
    if (!roles || !roles.length)
      throw new NotFoundException(Errors.ROLE_NOT_FOUND);
    return roles;
  }

  async findOne(query: FilterQuery<Role>) {
    const role = await this.roleModel.findOne(query);
    if (!role) throw new NotFoundException(Errors.ROLE_NOT_FOUND);
    return role;
  }

  async findAll() {
    return await this.findMany({})
  }

  private handleExceptions(error: any) {
    if (error.code === 11000)
      throw new BadRequestException(Errors.ROLE_ALREADY_EXIST);
    this.logger.error(error);
    throw new InternalServerErrorException(Errors.SERVER_ERROR);
  }
}
