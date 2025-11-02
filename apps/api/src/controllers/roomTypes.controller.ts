import { prisma } from '../prisma/client.js';
import { roomTypeCreateSchema, roomTypeUpdateSchema } from '../schemas/roomTypes.schema.js';

export const listRoomTypes = async (_req: any, res: any, next: any) => {
  try {
    const r = await prisma.roomType.findMany();
    res.json({ data: r });
  } catch (err) {
    next(err);
  }
};

export const createRoomType = async (req: any, res: any, next: any) => {
  try {
    const parsed = roomTypeCreateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ data: null, error: { message: parsed.error.message } });
    const r = await prisma.roomType.create({ data: parsed.data });
    res.status(201).json({ data: r });
  } catch (err) {
    next(err);
  }
};

export const updateRoomType = async (req: any, res: any, next: any) => {
  try {
    const id = req.params.id;
    const parsed = roomTypeUpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ data: null, error: { message: parsed.error.message } });
    const r = await prisma.roomType.update({ where: { id }, data: parsed.data });
    res.json({ data: r });
  } catch (err) {
    next(err);
  }
};

export const deleteRoomType = async (req: any, res: any, next: any) => {
  try {
    const id = req.params.id;
    await prisma.roomType.delete({ where: { id } });
    res.status(204).json({ data: null });
  } catch (err) {
    next(err);
  }
};