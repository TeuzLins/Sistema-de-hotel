import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { listPriceRules, createPriceRule, updatePriceRule, deletePriceRule } from '../controllers/priceRules.controller.js';

const router = Router();
router.get('/', listPriceRules);
router.post('/', authenticate, authorize(['ADMIN', 'OWNER']), createPriceRule);
router.put('/:id', authenticate, authorize(['ADMIN', 'OWNER']), updatePriceRule);
router.delete('/:id', authenticate, authorize(['ADMIN', 'OWNER']), deletePriceRule);

export default router;