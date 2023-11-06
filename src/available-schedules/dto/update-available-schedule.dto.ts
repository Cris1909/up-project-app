import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAvailableScheduleDto } from './create-available-schedule.dto';

export class UpdateAvailableScheduleDto extends PartialType(
  OmitType(CreateAvailableScheduleDto, ['date']),
) {}
