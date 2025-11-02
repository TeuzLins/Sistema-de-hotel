import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { listRoomTypes, createRoomType, updateRoomType, deleteRoomType } from '../controllers/roomTypes.controller.js';

const router = Router();
router.get('/', listRoomTypes);
router.post('/', authenticate, authorize(['ADMIN', 'OWNER']), createRoomType);
router.put('/:id', authenticate, authorize(['ADMIN', 'OWNER']), updateRoomType);
router.delete('/:id', authenticate, authorize(['ADMIN', 'OWNER']), deleteRoomType);

export default router;