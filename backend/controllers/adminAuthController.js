const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Admin } = require('../models');
const { asyncHandler } = require('../middleware/error');

// @desc    Admin login
// @route   POST /api/v1/admin/auth/login
// @access  Public
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // Check for admin
  const admin = await Admin.findOne({ 
    where: { email: email.toLowerCase() } 
  });

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if admin is active
  if (!admin.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is inactive. Please contact system administrator.'
    });
  }

  // Check password
  const isMatch = await admin.validatePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Update last login
  await admin.update({ lastLogin: new Date() });

  // Create token
  const token = jwt.sign(
    { 
      id: admin.id,
      email: admin.email,
      role: admin.role,
      isAdmin: true
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  // Remove password from response
  const adminData = {
    id: admin.id,
    email: admin.email,
    firstName: admin.firstName,
    lastName: admin.lastName,
    role: admin.role,
    permissions: admin.permissions,
    lastLogin: admin.lastLogin
  };

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      admin: adminData,
      token
    }
  });
});

// @desc    Get current admin
// @route   GET /api/v1/admin/auth/me
// @access  Private (Admin)
const getMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findByPk(req.admin.id, {
    attributes: { exclude: ['password'] }
  });

  res.json({
    success: true,
    data: admin
  });
});

// @desc    Update admin profile
// @route   PUT /api/v1/admin/auth/profile
// @access  Private (Admin)
const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;

  const admin = await Admin.findByPk(req.admin.id);

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: 'Admin not found'
    });
  }

  // Check if email is already taken by another admin
  if (email && email !== admin.email) {
    const existingAdmin = await Admin.findOne({
      where: { email: email.toLowerCase() }
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered'
      });
    }
  }

  // Update admin
  await admin.update({
    firstName: firstName || admin.firstName,
    lastName: lastName || admin.lastName,
    email: email ? email.toLowerCase() : admin.email
  });

  // Remove password from response
  const adminData = {
    id: admin.id,
    email: admin.email,
    firstName: admin.firstName,
    lastName: admin.lastName,
    role: admin.role,
    permissions: admin.permissions,
    lastLogin: admin.lastLogin
  };

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: adminData
  });
});

// @desc    Change admin password
// @route   PUT /api/v1/admin/auth/change-password
// @access  Private (Admin)
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current password and new password'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long'
    });
  }

  const admin = await Admin.findByPk(req.admin.id);

  // Check current password
  const isMatch = await admin.validatePassword(currentPassword);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  await admin.update({ password: newPassword });

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Admin logout
// @route   POST /api/v1/admin/auth/logout
// @access  Private (Admin)
const adminLogout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = {
  adminLogin,
  getMe,
  updateProfile,
  changePassword,
  adminLogout
};
