import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { createPaymentIntent, webhook } from '../controllers/payments.controller.js';

const router = Router();
router.post('/intent', createPaymentIntent);
router.post('/webhook', webhook);

export default router;