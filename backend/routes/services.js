const express = require('express');
const router = express.Router();
const { validate, schemas } = require('../middleware/validation');
const { requireAdmin, checkPermission } = require('../middleware/auth');
const { serviceImageUpload } = require('../utils/imageUpload');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

// @route   GET /api/v1/services
// @desc    Get all services
// @access  Public
router.get('/', getServices);

// @route   GET /api/v1/services/:id
// @desc    Get single service
// @access  Public
router.get('/:id', getService);

// @route   POST /api/v1/services/upload-image
// @desc    Upload service image
// @access  Private (Admin)
router.post('/upload-image', requireAdmin, (req, res, next) => {
  console.log('Upload image route hit');
  console.log('Admin user:', req.admin?.email);
  console.log('Headers:', req.headers);
  
  // Check permission manually to debug
  if (req.admin.role !== 'super_admin') {
    const permissions = req.admin.permissions || {};
    console.log('Admin permissions:', permissions);
    if (permissions.service_management !== 'full' && permissions.service_management !== 'edit') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions for service management.'
      });
    }
  }
  
  next();
}, serviceImageUpload.single('image'), (req, res) => {
  try {
    console.log('File upload middleware completed');
    console.log('Uploaded file:', req.file);
    
    if (!req.file) {
      console.log('No file provided in request');
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const imageUrl = `/uploads/images/services/${req.file.filename}`;
    console.log('Generated image URL:', imageUrl);
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
});

// @route   POST /api/v1/services
// @desc    Create service
// @access  Private (Admin)
router.post('/', requireAdmin, checkPermission('service_management'), validate(schemas.serviceCreate), createService);

// @route   PUT /api/v1/services/:id
// @desc    Update service
// @access  Private (Admin)
router.put('/:id', requireAdmin, checkPermission('service_management'), validate(schemas.serviceUpdate), updateService);

// @route   DELETE /api/v1/services/:id
// @desc    Delete service
// @access  Private (Admin)
router.delete('/:id', requireAdmin, checkPermission('service_management'), deleteService);

module.exports = router;
