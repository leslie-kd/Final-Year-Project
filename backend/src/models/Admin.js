const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminActivitySchema = new mongoose.Schema({
  loginTime: { type: Date },
  logoutTime: { type: Date },
  sessionDuration: { type: Number },
  deviceInfo: { type: String },
  ipAddress: { type: String }
});

const adminSchema = new mongoose.Schema({
  adminId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'superadmin' },
  activityLogs: [adminActivitySchema]
}, { timestamps: true });

// Hash password before saving
adminSchema.pre('save', async function() {
  if (!this.isModified('passwordHash')) return;
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Match password
adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
