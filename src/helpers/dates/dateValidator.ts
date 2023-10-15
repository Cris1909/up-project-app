import { BadRequestException } from '@nestjs/common';
import { Errors } from 'src/enum';

export const parseToStartDay = (date: Date) => {
  const currentDay = date.setHours(0, 0, 0, 0);
  return new Date (currentDay)
};

export const dateValidator = (date: Date) => {
  const currentDay = parseToStartDay(date);
  console.log({
    date,
    currentDay,
    boolean: date < currentDay
  })
  if (date < currentDay) {
    throw new BadRequestException(Errors.DATE_INVALID);
  }
};
