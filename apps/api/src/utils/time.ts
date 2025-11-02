import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { env } from '../config/env';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(env.TIMEZONE);

export const tz = (d?: string | Date) => (d ? dayjs(d).tz() : dayjs().tz());

export const isWeekend = (date: Date | string) => {
  const d = tz(date);
  const day = d.day();
  return day === 0 || day === 6; // Sun(0) or Sat(6)
};

export const nightsBetween = (checkIn: string | Date, checkOut: string | Date) => {
  const start = tz(checkIn).startOf('day');
  const end = tz(checkOut).startOf('day');
  const nights: Date[] = [];
  let cur = start;
  while (cur.isBefore(end)) {
    nights.push(cur.toDate());
    cur = cur.add(1, 'day');
  }
  return nights;
};