const express = require('express');
const router = express.Router();
const { requireAdmin, checkPermission } = require('../middleware/auth');
const {
  getDashboardStats,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
} = require('../controllers/adminController');

// @route   GET /api/v1/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', requireAdmin, getDashboardStats);

// @route   GET /api/v1/admin/users
// @desc    Get all admins
// @access  Private (Super Admin)
router.get('/users', requireAdmin, checkPermission('admin_management'), getAdmins);

// @route   POST /api/v1/admin/users
// @desc    Create new admin
// @access  Private (Super Admin)
router.post('/users', requireAdmin, checkPermission('admin_management'), createAdmin);

// @route   PUT /api/v1/admin/users/:id
// @desc    Update admin
// @access  Private (Super Admin)
router.put('/users/:id', requireAdmin, checkPermission('admin_management'), updateAdmin);

// @route   DELETE /api/v1/admin/users/:id
// @desc    Delete admin
// @access  Private (Super Admin)
router.delete('/users/:id', requireAdmin, checkPermission('admin_management'), deleteAdmin);

module.exports = router;
