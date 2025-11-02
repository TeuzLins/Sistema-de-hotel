import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { listSeasons, createSeason, updateSeason, deleteSeason } from '../controllers/seasons.controller.js';

const router = Router();
router.get('/', listSeasons);
router.post('/', authenticate, authorize(['ADMIN', 'OWNER']), createSeason);
router.put('/:id', authenticate, authorize(['ADMIN', 'OWNER']), updateSeason);
router.delete('/:id', authenticate, authorize(['ADMIN', 'OWNER']), deleteSeason);

export default router;