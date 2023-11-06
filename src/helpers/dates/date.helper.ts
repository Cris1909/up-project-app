import { Injectable } from '@nestjs/common';

import * as dayjs from 'dayjs';

var utc = require('dayjs/plugin/utc');
var timezone = require('dayjs/plugin/timezone'); // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class DateHelper {
  private readonly timeZone = 'America/Bogota'; // Zona horaria de Colombia

  getCurrentTimeInColombia(): dayjs.Dayjs {
    return dayjs().tz(this.timeZone);
  }

  isPreviousDay(date: dayjs.Dayjs): boolean {
    const colombiaTime = this.getCurrentTimeInColombia();
    return date.isBefore(colombiaTime, 'day');
  }

  getStartOfDay(date: dayjs.Dayjs): dayjs.Dayjs {
    return date.startOf('day').tz(this.timeZone);
  }

  isSameDay(date1: dayjs.Dayjs, date2: dayjs.Dayjs): boolean {
    return date1.isSame(date2, 'day');
  }

  isToday(date: dayjs.Dayjs): boolean {
    const currentDate = this.getCurrentTimeInColombia();
    return this.isSameDay(date, currentDate);
  }

  hour(): number {
    const colombiaTime = this.getCurrentTimeInColombia();
    return colombiaTime.hour();
  }

  getDate(date?: string | Date): dayjs.Dayjs {
    return dayjs(date).tz(this.timeZone);
  }

  getStartAndEndWeek(date: dayjs.Dayjs) {
    const startOfWeek = date.startOf('week').add(1, 'day');
    const endOfWeek = date.endOf('week').add(1, 'day');
    return {
      startOfWeek,
      endOfWeek,
    };
  }
}
