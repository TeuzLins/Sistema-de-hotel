import { Router } from 'express';
import authRoutes from './auth.routes.js';
import roomTypesRoutes from './roomTypes.routes.js';
import roomsRoutes from './rooms.routes.js';
import seasonsRoutes from './seasons.routes.js';
import priceRulesRoutes from './priceRules.routes.js';
import pricingRoutes from './pricing.routes.js';
import bookingsRoutes from './bookings.routes.js';
import paymentsRoutes from './payments.routes.js';
import reportsRoutes from './reports.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/room-types', roomTypesRoutes);
apiRouter.use('/rooms', roomsRoutes);
apiRouter.use('/seasons', seasonsRoutes);
apiRouter.use('/price-rules', priceRulesRoutes);
apiRouter.use('/pricing', pricingRoutes);
apiRouter.use('/bookings', bookingsRoutes);
apiRouter.use('/payments', paymentsRoutes);
apiRouter.use('/reports', reportsRoutes);