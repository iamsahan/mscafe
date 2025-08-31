const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/error');
const { checkMissingImages, fixMissingImages } = require('../utils/fixMissingImages');
const ImageMaintenanceManager = require('../utils/imageMaintenance');

// @desc    Check image integrity
// @route   GET /api/v1/admin/images/check
// @access  Private (Admin)
const checkImages = asyncHandler(async (req, res) => {
  const maintenance = new ImageMaintenanceManager();
  
  // Get comprehensive stats
  const stats = await maintenance.getImageStats();
  const missingCheck = await checkMissingImages();
  const orphaned = await maintenance.findOrphanedImages();

  res.json({
    success: true,
    message: 'Image integrity check completed',
    data: {
      statistics: stats,
      missing: {
        services: missingCheck.missingServiceImages.length,
        courses: missingCheck.missingCourseImages.length,
        total: missingCheck.totalMissing,
        details: missingCheck
      },
      orphaned: {
        services: orphaned.services.length,
        courses: orphaned.courses.length,
        total: orphaned.total,
        details: orphaned
      }
    }
  });
});

// @desc    Fix missing images
// @route   POST /api/v1/admin/images/fix
// @access  Private (Admin)
const fixImages = asyncHandler(async (req, res) => {
  const result = await fixMissingImages();
  
  res.json({
    success: true,
    message: 'Missing images fix completed',
    data: result
  });
});

// @desc    Run full image maintenance
// @route   POST /api/v1/admin/images/maintenance
// @access  Private (Admin)
const runMaintenance = asyncHandler(async (req, res) => {
  const { fixMissing = true, cleanOrphaned = false, dryRun = true } = req.body;
  
  const maintenance = new ImageMaintenanceManager();
  
  // Capture console output
  const logs = [];
  const originalLog = console.log;
  const originalError = console.error;
  
  console.log = (...args) => {
    logs.push({ type: 'info', message: args.join(' ') });
    originalLog(...args);
  };
  
  console.error = (...args) => {
    logs.push({ type: 'error', message: args.join(' ') });
    originalError(...args);
  };
  
  try {
    await maintenance.runFullMaintenance({ fixMissing, cleanOrphaned, dryRun });
    
    // Restore console
    console.log = originalLog;
    console.error = originalError;
    
    res.json({
      success: true,
      message: 'Image maintenance completed successfully',
      data: {
        options: { fixMissing, cleanOrphaned, dryRun },
        logs: logs
      }
    });
  } catch (error) {
    // Restore console
    console.log = originalLog;
    console.error = originalError;
    
    throw error;
  }
});

// Routes
router.get('/check', checkImages);
router.post('/fix', fixImages);
router.post('/maintenance', runMaintenance);

module.exports = router;
