import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { createBooking, listBookings, getBooking, updateBookingStatus } from '../controllers/bookings.controller.js';

const router = Router();
router.post('/', createBooking);
router.get('/', authenticate, authorize(['ADMIN', 'OWNER', 'STAFF']), listBookings);
router.get('/:id', authenticate, authorize(['ADMIN', 'OWNER', 'STAFF']), getBooking);
router.patch('/:id/status', authenticate, authorize(['ADMIN', 'OWNER', 'STAFF']), updateBookingStatus);

export default router;