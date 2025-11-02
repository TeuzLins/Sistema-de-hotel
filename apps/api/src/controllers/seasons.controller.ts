import { prisma } from '../prisma/client.js';
import { seasonCreateSchema, seasonUpdateSchema } from '../schemas/seasons.schema.js';

export const listSeasons = async (_req: any, res: any) => {
  const r = await prisma.season.findMany();
  res.json({ data: r });
};

export const createSeason = async (req: any, res: any) => {
  const parsed = seasonCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ data: null, error: { message: parsed.error.message } });
  const r = await prisma.season.create({ data: parsed.data });
  res.status(201).json({ data: r });
};

export const updateSeason = async (req: any, res: any) => {
  const id = req.params.id;
  const parsed = seasonUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ data: null, error: { message: parsed.error.message } });
  const r = await prisma.season.update({ where: { id }, data: parsed.data });
  res.json({ data: r });
};

export const deleteSeason = async (req: any, res: any) => {
  const id = req.params.id;
  await prisma.season.delete({ where: { id } });
  res.status(204).json({ data: null });
};