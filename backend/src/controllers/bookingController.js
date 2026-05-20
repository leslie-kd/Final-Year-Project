const Booking = require('../models/Booking');
const { db, admin } = require('../firebase/firebaseAdmin');

// @desc    Create new booking request
// @route   POST /api/bookings
// @access  Public (should be protected by auth middleware in real app)
const createBooking = async (req, res) => {
  try {
    const { clientId, providerId, serviceCategory, serviceDescription, scheduledDate, scheduledTime, locationSnapshot } = req.body;
    const generatedBookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;

    let firebaseChatRoomId = null;

    if (db) {
      const chatRef = db.ref('chats').push();
      firebaseChatRoomId = chatRef.key;
      await chatRef.set({
        bookingId: generatedBookingId,
        clientId,
        providerId,
        createdAt: admin.database.ServerValue.TIMESTAMP
      });
    }

    const booking = await Booking.create({
      bookingId: generatedBookingId,
      clientId,
      providerId,
      serviceCategory,
      serviceDescription,
      scheduledDate,
      scheduledTime,
      locationSnapshot,
      chatMetadata: {
        firebaseChatRoomId,
        visibleUntil: null
      }
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Public (should be protected in real app)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Status can be: pending, accepted, in_progress, completed, cancelled, delayed, no_show
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.bookingStatus = status;

    // Handle timestamp updates based on status
    if (status === 'in_progress') {
      booking.actualStartTime = Date.now();
    } else if (status === 'completed') {
      booking.actualEndTime = Date.now();
      // Calculate duration in minutes if startTime exists
      if (booking.actualStartTime) {
        const diffMs = booking.actualEndTime - booking.actualStartTime;
        booking.durationInMinutes = Math.round(diffMs / 60000);
      }
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user/:userId
// @access  Public
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find bookings where user is either client or provider
    const bookings = await Booking.find({
      $or: [{ clientId: userId }, { providerId: userId }]
    })
    .populate('clientId', 'firstName lastName')
    .populate('providerId', 'firstName lastName providerDetails.jobTitle')
    .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  updateBookingStatus,
  getUserBookings
};
