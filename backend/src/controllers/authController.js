const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, roles } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      passwordHash: password, // will be hashed in pre-save hook
      roles: roles || ['client']
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    let isAdmin = false;

    if (!user) {
      const Admin = require('../models/Admin');
      user = await Admin.findOne({ email });
      isAdmin = true;
    }

    if (user && (await user.matchPassword(password))) {
      // Update login metadata if it's a regular user
      if (!isAdmin) {
        user.loginMetadata.lastLogin = Date.now();
        user.loginMetadata.loginCount += 1;
      } else {
        user.activityLogs.push({
          loginTime: Date.now(),
          ipAddress: req.ip
        });
      }
      
      await user.save();

      res.json({
        _id: user._id,
        firstName: isAdmin ? user.name : user.firstName,
        lastName: isAdmin ? '' : user.lastName,
        email: user.email,
        roles: isAdmin ? [user.role] : user.roles,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  authUser
};
