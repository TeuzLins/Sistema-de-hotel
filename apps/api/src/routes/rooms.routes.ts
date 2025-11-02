import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { listRooms, createRoom, updateRoom, deleteRoom } from '../controllers/rooms.controller.js';

const router = Router();
router.get('/', listRooms);
router.post('/', authenticate, authorize(['ADMIN', 'OWNER']), createRoom);
router.put('/:id', authenticate, authorize(['ADMIN', 'OWNER']), updateRoom);
router.delete('/:id', authenticate, authorize(['ADMIN', 'OWNER']), deleteRoom);

export default router;