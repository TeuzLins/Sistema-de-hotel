import { prisma } from '../prisma/client';
import { tz, nightsBetween, isWeekend } from './time';

type Operator = 'MULTIPLY' | 'ADD' | 'SUBTRACT';

interface QuoteRequest {
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export async function getQuote(req: QuoteRequest) {
  const roomType = await prisma.roomType.findUnique({ where: { id: req.roomTypeId } });
  if (!roomType) throw { status: 404, message: 'RoomType not found', code: 'ROOMTYPE_NOT_FOUND' };

  const nights = nightsBetween(req.checkIn, req.checkOut);
  if (nights.length <= 0) throw { status: 400, message: 'Invalid date range', code: 'INVALID_RANGE' };

  const seasons = await prisma.season.findMany({
    where: {
      OR: nights.map((d) => ({ startDate: { lte: d }, endDate: { gte: d } }))
    }
  });

  const rules = await prisma.priceRule.findMany();

  const breakdown: { date: string; base: number; multiplier: number; adjustments: number; total: number; tags: string[] }[] = [];
  for (const date of nights) {
    const base = Number(roomType.basePrice);
    let multiplier = 1;
    let adjustments = 0;
    const tags: string[] = [];

    const applicableSeasons = seasons.filter((s) => tz(date).isAfter(tz(s.startDate).subtract(1, 'ms')) && tz(date).isBefore(tz(s.endDate).add(1, 'ms')));
    for (const s of applicableSeasons) {
      multiplier *= Number(s.priceMultiplier);
      tags.push(`SEASON:${s.name}`);
    }

    // Weekend rule
    const weekendRule = rules.find((r) => r.ruleType === 'WEEKEND');
    if (weekendRule && isWeekend(date)) {
      ({ multiplier, adjustments } = applyRule(weekendRule.operator as Operator, Number(weekendRule.value), multiplier, adjustments));
      tags.push('WEEKEND');
    }

    // Holiday rule (simplificado: aplica em feriados fixos brasileiros)
    const holidayRule = rules.find((r) => r.ruleType === 'HOLIDAY');
    if (holidayRule && isBrazilHoliday(date)) {
      ({ multiplier, adjustments } = applyRule(holidayRule.operator as Operator, Number(holidayRule.value), multiplier, adjustments));
      tags.push('HOLIDAY');
    }

    const subtotal = base * multiplier + adjustments;
    breakdown.push({ date: tz(date).format('YYYY-MM-DD'), base, multiplier, adjustments, total: round2(subtotal), tags });
  }

  // Long stay rule
  const longStayRule = rules.find((r) => r.ruleType === 'LONG_STAY');
  let longStayAdj = 0;
  if (longStayRule && longStayRule.minNights && nights.length >= longStayRule.minNights) {
    const totalBase = breakdown.reduce((acc, b) => acc + b.total, 0);
    longStayAdj = applyTotalRule(longStayRule.operator as Operator, Number(longStayRule.value), totalBase);
  }

  // Last minute rule (aplica se faltam <= 3 dias do checkIn)
  const lastMinuteRule = rules.find((r) => r.ruleType === 'LAST_MINUTE');
  let lastMinuteAdj = 0;
  if (lastMinuteRule) {
    const daysUntil = tz(req.checkIn).diff(tz(), 'day');
    if (daysUntil <= 3) {
      const totalBase = breakdown.reduce((acc, b) => acc + b.total, 0) + longStayAdj;
      lastMinuteAdj = applyTotalRule(lastMinuteRule.operator as Operator, Number(lastMinuteRule.value), totalBase);
    }
  }

  const totalBefore = breakdown.reduce((acc, b) => acc + b.total, 0);
  const total = round2(totalBefore + longStayAdj + lastMinuteAdj);

  return {
    roomType,
    nights: breakdown,
    total,
    meta: {
      longStayAdj: round2(longStayAdj),
      lastMinuteAdj: round2(lastMinuteAdj),
      currency: 'BRL'
    }
  };
}

function applyRule(operator: Operator, value: number, multiplier: number, adjustments: number) {
  switch (operator) {
    case 'MULTIPLY':
      multiplier *= value;
      break;
    case 'ADD':
      adjustments += value;
      break;
    case 'SUBTRACT':
      adjustments -= value;
      break;
  }
  return { multiplier, adjustments };
}

function applyTotalRule(operator: Operator, value: number, baseTotal: number) {
  switch (operator) {
    case 'MULTIPLY':
      return round2(baseTotal * (value - 1));
    case 'ADD':
      return round2(value);
    case 'SUBTRACT':
      return round2(-value);
  }
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function isBrazilHoliday(date: Date) {
  const d = tz(date);
  const y = d.year();
  const fixed = [
    `${y}-01-01`, // Confraternização Universal
    `${y}-04-21`, // Tiradentes
    `${y}-05-01`, // Dia do Trabalho
    `${y}-09-07`, // Independência
    `${y}-10-12`, // Nossa Sra Aparecida
    `${y}-11-02`, // Finados
    `${y}-11-15`, // Proclamação da República
    `${y}-12-25` // Natal
  ];
  return fixed.includes(d.format('YYYY-MM-DD'));
}