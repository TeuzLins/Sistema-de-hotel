import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { occupancy, revenue } from '../controllers/reports.controller.js';

const router = Router();
router.get('/occupancy', authenticate, authorize(['ADMIN', 'OWNER']), occupancy);
router.get('/revenue', authenticate, authorize(['ADMIN', 'OWNER']), revenue);

export default router;