import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Subject } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

import { Errors } from 'src/enum';

@Injectable()
export class SubjectsService {
  private readonly logger = new Logger(SubjectsService.name);

  constructor(
    @InjectModel(Subject.name)
    private readonly subjectModel: Model<Subject>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    try {
      const subject = await this.subjectModel.create(createSubjectDto);
      return subject;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private async findMany(query: FilterQuery<Subject>): Promise<Subject[]> {
    const subjects = await this.subjectModel.find(query).select('-__v');
    if (!subjects || !subjects.length)
      throw new NotFoundException(Errors.SUBJECTS_NOT_FOUND);
    return subjects;
  }

  async findAll() {
    return await this.findMany({});
  }

  async findAllActive() {
    return await this.findMany({ isActive: true });
  }

  private async findOne(query: FilterQuery<Subject>) {
    const subject = await this.subjectModel.findOne(query);
    if (!subject) throw new NotFoundException(Errors.SUBJECTS_NOT_FOUND);
    return subject;
  }

  async update(_id: string, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.findOne({ _id });
    try {
      await subject.updateOne(updateSubjectDto);
      return { ...subject.toJSON(), ...updateSubjectDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000)
      throw new BadRequestException(Errors.SUBJECT_ALREADY_EXIST);
    this.logger.error(error);
    throw new InternalServerErrorException(Errors.SERVER_ERROR);
  }
}
