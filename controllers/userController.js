const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/users/me
 * @access  Private (User, Admin)
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current logged in user profile
 * @route   PUT /api/users/me
 * @access  Private (User, Admin)
 */
const updateMe = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) {
      user.name = name.trim();
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address' });
      }

      // Check if new email belongs to another account
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email is already taken by another account' });
      }
      user.email = email.toLowerCase().trim();
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters long' });
      }
      user.password = password; // Pre-save hook will hash it
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePic: updatedUser.profilePic,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload avatar (Bonus Task 15)
 * @route   POST /api/users/me/avatar
 * @access  Private (User, Admin)
 */
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please select an image file to upload' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePic = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      profilePic: user.profilePic
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  updateMe,
  uploadAvatar
};
