import { prisma } from '../src/prisma/client';
import { getQuote } from '../src/utils/pricingEngine';

describe('pricingEngine', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('calculates weekend multiplier', async () => {
    const rt = await prisma.roomType.create({ data: { name: 'Test', capacity: 2, basePrice: 100, description: '' } });
    await prisma.priceRule.create({ data: { ruleType: 'WEEKEND', operator: 'MULTIPLY', value: 1.15 } });
    const quote = await getQuote({ roomTypeId: rt.id, checkIn: '2025-11-01T15:00:00Z', checkOut: '2025-11-03T12:00:00Z', guests: 2 });
    expect(quote.total).toBeGreaterThan(100);
  });
});