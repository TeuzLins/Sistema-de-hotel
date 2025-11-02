import { Router } from 'express';
import { quote } from '../controllers/pricing.controller.js';

const router = Router();
router.get('/quote', quote);

export default router;