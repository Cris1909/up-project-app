import { BadRequestException } from '@nestjs/common';
import { Errors } from 'src/enum';

export const getUTCHours = (date: Date) => {
  const timezoneOffsetMinutes = date.getTimezoneOffset();
  return -timezoneOffsetMinutes / 60;
};

export const getStartOfDay = (date: Date) => {
  const startOfDay = new Date(date);
  // Establecer la hora a las 00:00:00.000
  startOfDay.setHours(0 + getUTCHours(date), 0, 0, 0);
  return startOfDay;
};

export const getEndPreviousDay = (date: Date) => {
  const timezoneOffsetHours = getUTCHours(date);
  const endOfPreviousDay = new Date(date);
  endOfPreviousDay.setDate(endOfPreviousDay.getDate() - 1); // Restar un día
  endOfPreviousDay.setHours(23 + timezoneOffsetHours, 59, 59, 999); // Establecer la hora a las 23:59:59.999
  return endOfPreviousDay;
};

export const dateValidator = (date: Date) => {
  const startOfDay = getStartOfDay(date);
  if (date < startOfDay) throw new BadRequestException(Errors.DATE_INVALID);
};

export const isPreviousDay = (date: Date) =>
  getStartOfDay(date).getTime() < getStartOfDay(new Date()).getTime();

export const isSameDay = (date1: Date, date2: Date) =>
  getStartOfDay(date1).getTime() === getStartOfDay(date2).getTime();
