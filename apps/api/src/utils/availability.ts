import { prisma } from '../prisma/client';
import { tz } from './time';

export async function isRoomAvailable(roomId: string, checkIn: string, checkOut: string) {
  const start = tz(checkIn).toDate();
  const end = tz(checkOut).toDate();
  if (end <= start) return false;

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) throw { status: 404, message: 'Room not found', code: 'ROOM_NOT_FOUND' };
  if (room.status !== 'AVAILABLE') return false;

  const maint = await prisma.maintenance.findMany({
    where: {
      roomId,
      AND: [{ startDate: { lt: end } }, { endDate: { gt: start } }]
    }
  });
  if (maint.length) return false;

  const overlapping = await prisma.booking.findMany({
    where: {
      roomId,
      status: { in: ['PENDING', 'PAID', 'CHECKED_IN'] },
      AND: [{ checkIn: { lt: end } }, { checkOut: { gt: start } }]
    }
  });

  return overlapping.length === 0;
}