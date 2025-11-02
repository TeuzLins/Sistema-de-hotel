import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  const adminEmail = 'admin@example.com';
  const ownerEmail = 'owner@example.com';
  const passwordHash = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { name: 'Admin', email: adminEmail, passwordHash, role: 'ADMIN' }
  });
  await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: { name: 'Owner', email: ownerEmail, passwordHash, role: 'OWNER' }
  });

  const rtStandard = await prisma.roomType.upsert({
    where: { id: 'rt-standard' },
    update: {},
    create: { id: 'rt-standard', name: 'Standard', capacity: 2, basePrice: 200.0, description: 'Quarto padrão' }
  });
  const rtFamily = await prisma.roomType.upsert({
    where: { id: 'rt-family' },
    update: {},
    create: { id: 'rt-family', name: 'Family', capacity: 4, basePrice: 350.0, description: 'Quarto família' }
  });

  const roomsData = Array.from({ length: 12 }).map((_, i) => ({
    number: `${100 + i}`,
    roomTypeId: i < 8 ? rtStandard.id : rtFamily.id,
    status: 'AVAILABLE' as const
  }));
  for (const r of roomsData) {
    await prisma.room.upsert({ where: { number: r.number }, update: {}, create: r });
  }

  const currentYear = new Date().getFullYear();
  await prisma.season.upsert({
    where: { id: 'summer' },
    update: {},
    create: {
      id: 'summer',
      name: 'Alta (Verão)',
      startDate: new Date(`${currentYear}-12-15`),
      endDate: new Date(`${currentYear + 1}-02-28`),
      priceMultiplier: 1.2
    }
  });
  await prisma.season.upsert({
    where: { id: 'winter' },
    update: {},
    create: {
      id: 'winter',
      name: 'Baixa (Inverno)',
      startDate: new Date(`${currentYear}-06-01`),
      endDate: new Date(`${currentYear}-08-31`),
      priceMultiplier: 0.9
    }
  });

  await prisma.priceRule.upsert({
    where: { id: 'rule-weekend' },
    update: {},
    create: { id: 'rule-weekend', ruleType: 'WEEKEND', value: 1.15, operator: 'MULTIPLY' }
  });
  await prisma.priceRule.upsert({
    where: { id: 'rule-longstay' },
    update: {},
    create: { id: 'rule-longstay', ruleType: 'LONG_STAY', value: 0.9, operator: 'MULTIPLY', minNights: 5 }
  });
  await prisma.priceRule.upsert({
    where: { id: 'rule-holiday' },
    update: {},
    create: { id: 'rule-holiday', ruleType: 'HOLIDAY', value: 1.2, operator: 'MULTIPLY' }
  });

  const rooms = await prisma.room.findMany();
  const bookingsSeed = [
    { room: rooms[0], from: `${currentYear}-11-20`, to: `${currentYear}-11-23` },
    { room: rooms[1], from: `${currentYear}-11-22`, to: `${currentYear}-11-25` },
    { room: rooms[2], from: `${currentYear}-12-24`, to: `${currentYear}-12-26` },
    { room: rooms[3], from: `${currentYear}-12-30`, to: `${currentYear + 1}-01-02` },
    { room: rooms[4], from: `${currentYear}-07-10`, to: `${currentYear}-07-15` }
  ];
  for (const b of bookingsSeed) {
    const code = `BK-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const checkIn = new Date(b.from);
    const checkOut = new Date(b.to);
    const total = Number(b.room.roomTypeId === rtFamily.id ? 350 * 2 : 200 * 2);
    await prisma.booking.upsert({
      where: { code },
      update: {},
      create: {
        code,
        roomId: b.room.id,
        guestName: 'Hóspede Demo',
        guestEmail: 'guest@example.com',
        checkIn,
        checkOut,
        guests: 2,
        total,
        status: 'PAID'
      }
    });
  }

  console.log('Seed completed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});