const Review = require('../models/Review');
const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Public (should be protected in a real app)
const createReview = async (req, res) => {
  try {
    const { bookingId, reviewerId, reviewedUserId, rating, reviewText, reviewType } = req.body;

    // 1. Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // 2. Create the review
    const review = await Review.create({
      bookingId,
      reviewerId,
      reviewedUserId,
      rating,
      reviewText,
      reviewType
    });

    // 3. Update the User's overall rating
    const reviewedUser = await User.findById(reviewedUserId);
    if (reviewedUser) {
      const currentAverage = reviewedUser.ratings.averageRating || 0;
      const currentTotal = reviewedUser.ratings.totalReviews || 0;

      // Calculate new average
      const newTotal = currentTotal + 1;
      const newAverage = ((currentAverage * currentTotal) + rating) / newTotal;

      reviewedUser.ratings.averageRating = Number(newAverage.toFixed(1));
      reviewedUser.ratings.totalReviews = newTotal;
      
      await reviewedUser.save();
    }

    // 4. Optionally, update the Booking to reflect a rating was given
    if (String(booking.clientId) === String(reviewerId)) {
      booking.providerRating = rating;
    } else if (String(booking.providerId) === String(reviewerId)) {
      booking.clientRating = rating;
    }
    await booking.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for a specific user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const reviews = await Review.find({ reviewedUserId: userId })
      .populate('reviewerId', 'firstName lastName')
      .populate('bookingId', 'serviceCategory')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getUserReviews
};
