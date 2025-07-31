const express = require('express');
const router = express.Router();
const { validate, schemas } = require('../middleware/validation');
const { requireAdmin, checkPermission } = require('../middleware/auth');
const {
  getPriorityTradelinesAU,
  getPriorityTradelineAU,
  createPriorityTradelineAU,
  updatePriorityTradelineAU,
  deletePriorityTradelineAU,
  getPriorityTradelinesAUStats
} = require('../controllers/priorityTradelinesAUController');

// @route   GET /api/v1/priority-tradelines-au/stats
// @desc    Get priority tradelines AU statistics
// @access  Public
router.get('/stats', getPriorityTradelinesAUStats);

// @route   GET /api/v1/priority-tradelines-au
// @desc    Get all priority tradelines AU inventory
// @access  Public
router.get('/', getPriorityTradelinesAU);

// @route   GET /api/v1/priority-tradelines-au/:id
// @desc    Get single priority tradeline AU
// @access  Public
router.get('/:id', getPriorityTradelineAU);

// @route   POST /api/v1/priority-tradelines-au
// @desc    Create priority tradeline AU
// @access  Private (Admin)
router.post('/', requireAdmin, checkPermission('priority_tradelines'), validate(schemas.priorityTradelineCreate), createPriorityTradelineAU);

// @route   PUT /api/v1/priority-tradelines-au/:id
// @desc    Update priority tradeline AU
// @access  Private (Admin)
router.put('/:id', requireAdmin, checkPermission('priority_tradelines'), validate(schemas.priorityTradelineUpdate), updatePriorityTradelineAU);

// @route   DELETE /api/v1/priority-tradelines-au/:id
// @desc    Delete priority tradeline AU
// @access  Private (Admin)
router.delete('/:id', requireAdmin, checkPermission('priority_tradelines'), deletePriorityTradelineAU);

module.exports = router;
