const express = require('express');
const router = express.Router();
const { createBooking, updateBookingStatus, getUserBookings } = require('../controllers/bookingController');

router.post('/', createBooking);
router.patch('/:id/status', updateBookingStatus);
router.get('/user/:userId', getUserBookings);

module.exports = router;
