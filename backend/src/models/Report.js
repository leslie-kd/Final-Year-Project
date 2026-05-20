const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: { type: String },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },

  reason: { type: String, required: true },
  description: { type: String },

  status: {
    type: String,
    enum: [
      "pending",
      "under_review",
      "resolved",
      "dismissed"
    ],
    default: "pending"
  },

  resolutionNotes: { type: String },
  reviewedByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  resolvedAt: { type: Date }
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
