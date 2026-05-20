const User = require('../models/User');
const Report = require('../models/Report');
const Booking = require('../models/Booking');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users pending verification
// @route   GET /api/admin/users/pending-verification
// @access  Admin
const getPendingVerifications = async (req, res) => {
  try {
    const users = await User.find({ 'verification.verificationStatus': 'pending', roles: { $in: ['provider'] } })
      .select('-passwordHash');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify or reject a user
// @route   PATCH /api/admin/users/:id/verify
// @access  Admin
const verifyUser = async (req, res) => {
  try {
    const { status } = req.body; // 'verified' or 'rejected'
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.verification.verificationStatus = status;
    user.verification.verifiedAt = status === 'verified' ? Date.now() : null;
    // user.verification.reviewedByAdmin = req.user._id; // In real app with auth middleware

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Suspend or block a user
// @route   PATCH /api/admin/users/:id/suspend
// @access  Admin
const suspendUser = async (req, res) => {
  try {
    const { isSuspended, suspensionReason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.accountStatus.isSuspended = isSuspended;
    if (suspensionReason) {
      user.accountStatus.suspensionReason = suspensionReason;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Admin
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({})
      .populate('reporterId', 'firstName lastName')
      .populate('reportedUserId', 'firstName lastName')
      .populate('bookingId')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve a report
// @route   PATCH /api/admin/reports/:id/resolve
// @access  Admin
const resolveReport = async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body; // 'resolved' or 'dismissed'
    
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    report.resolutionNotes = resolutionNotes;
    report.resolvedAt = Date.now();
    // report.reviewedByAdmin = req.user._id;

    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics for dashboard
// @route   GET /api/admin/analytics
// @access  Admin
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeProviders = await User.countDocuments({ roles: { $in: ['provider'] }, 'accountStatus.isSuspended': false });
    
    // Bookings today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const bookingsToday = await Booking.countDocuments({ createdAt: { $gte: startOfDay } });
    
    const pendingReports = await Report.countDocuments({ status: { $in: ['pending', 'under_review'] } });

    res.json({
      totalUsers,
      activeProviders,
      bookingsToday,
      pendingReports
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getPendingVerifications,
  verifyUser,
  suspendUser,
  getReports,
  resolveReport,
  getAnalytics
};
