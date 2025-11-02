import { prisma } from '../src/prisma/client';
import { isRoomAvailable } from '../src/utils/availability';

describe('availability', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('detects overlapping bookings', async () => {
    const rt = await prisma.roomType.create({ data: { name: 'Test', capacity: 2, basePrice: 100, description: '' } });
    const room = await prisma.room.create({ data: { number: 'A1', roomTypeId: rt.id, status: 'AVAILABLE' } });
    await prisma.booking.create({
      data: {
        code: 'BK-TEST',
        roomId: room.id,
        guestName: 'Guest',
        guestEmail: 'g@example.com',
        checkIn: new Date('2025-11-01T15:00:00Z'),
        checkOut: new Date('2025-11-05T12:00:00Z'),
        guests: 2,
        total: 300,
        status: 'PAID'
      }
    });

    const available = await isRoomAvailable(room.id, '2025-11-03T15:00:00Z', '2025-11-06T12:00:00Z');
    expect(available).toBe(false);
  });
});