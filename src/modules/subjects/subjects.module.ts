import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Subject, SubjectSchema } from './entities/subject.entity';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Subject.name,
        schema: SubjectSchema,
      },
    ]),
  ],
  exports: [MongooseModule]
})
export class SubjectsModule {}
