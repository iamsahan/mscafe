const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const {
  adminLogin,
  getMe,
  updateProfile,
  changePassword,
  adminLogout
} = require('../controllers/adminAuthController');

// @route   POST /api/v1/admin/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', adminLogin);

// @route   GET /api/v1/admin/auth/me
// @desc    Get current admin
// @access  Private (Admin)
router.get('/me', requireAdmin, getMe);

// @route   PUT /api/v1/admin/auth/profile
// @desc    Update admin profile
// @access  Private (Admin)
router.put('/profile', requireAdmin, updateProfile);

// @route   PUT /api/v1/admin/auth/change-password
// @desc    Change admin password
// @access  Private (Admin)
router.put('/change-password', requireAdmin, changePassword);

// @route   POST /api/v1/admin/auth/logout
// @desc    Admin logout
// @access  Private (Admin)
router.post('/logout', requireAdmin, adminLogout);

module.exports = router;
