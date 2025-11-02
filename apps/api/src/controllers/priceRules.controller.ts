import { prisma } from '../prisma/client.js';
import { priceRuleCreateSchema, priceRuleUpdateSchema } from '../schemas/priceRules.schema.js';

export const listPriceRules = async (_req: any, res: any) => {
  const r = await prisma.priceRule.findMany();
  res.json({ data: r });
};

export const createPriceRule = async (req: any, res: any) => {
  const parsed = priceRuleCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ data: null, error: { message: parsed.error.message } });
  const r = await prisma.priceRule.create({ data: parsed.data });
  res.status(201).json({ data: r });
};

export const updatePriceRule = async (req: any, res: any) => {
  const id = req.params.id;
  const parsed = priceRuleUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ data: null, error: { message: parsed.error.message } });
  const r = await prisma.priceRule.update({ where: { id }, data: parsed.data });
  res.json({ data: r });
};

export const deletePriceRule = async (req: any, res: any) => {
  const id = req.params.id;
  await prisma.priceRule.delete({ where: { id } });
  res.status(204).json({ data: null });
};