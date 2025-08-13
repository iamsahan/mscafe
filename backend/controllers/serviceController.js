const { Service } = require('../models');
const { asyncHandler } = require('../middleware/error');
const { serviceImageUpload } = require('../utils/imageUpload');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

// @desc    Get all services
// @route   GET /api/v1/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
  const { serviceType, featured, search, page = 1, limit = 1000, includeInactive } = req.query;
  
  // For admin requests, include inactive services
  const where = {};
  if (!includeInactive || includeInactive !== 'true') {
    where.isActive = true; // Only show active services for public requests
  }
  
  if (serviceType) where.serviceType = serviceType;
  if (featured === 'true') where.featured = true;
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }

  const offset = (page - 1) * limit;

  const { count, rows: services } = await Service.findAndCountAll({
    where,
    order: [['featured', 'DESC'], ['created_at', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset)
  });

  res.json({
    success: true,
    count: services.length,
    total: count,
    data: services,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    }
  });
});

// @desc    Get single service
// @route   GET /api/v1/services/:id
// @access  Public
const getService = asyncHandler(async (req, res) => {
  const service = await Service.findByPk(req.params.id);

  if (!service || !service.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

  res.json({
    success: true,
    data: service
  });
});

// @desc    Create service
// @route   POST /api/v1/services
// @access  Private (Admin)
const createService = asyncHandler(async (req, res) => {
  // Handle image upload if present
  if (req.file) {
    const imageUrl = `/uploads/images/services/${req.file.filename}`;
    req.body.imageUrl = imageUrl;
  }

  const service = await Service.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Service created successfully',
    data: service
  });
});

// @desc    Update service
// @route   PUT /api/v1/services/:id
// @access  Private (Admin)
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByPk(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

  // Handle image upload if present
  if (req.file) {
    // Delete old image file if it exists
    if (service.imageUrl) {
      const oldImagePath = path.join(process.cwd(), 'uploads', 'images', 'services', path.basename(service.imageUrl));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    const imageUrl = `/uploads/images/services/${req.file.filename}`;
    req.body.imageUrl = imageUrl;
  }

  await service.update(req.body);

  res.json({
    success: true,
    message: 'Service updated successfully',
    data: service
  });
});

// @desc    Delete service
// @route   DELETE /api/v1/services/:id
// @access  Private (Admin)
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByPk(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: 'Service not found'
    });
  }

  // Delete image file if it exists
  if (service.imageUrl) {
    const imagePath = path.join(process.cwd(), 'uploads', 'images', 'services', path.basename(service.imageUrl));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await service.destroy();

  res.json({
    success: true,
    message: 'Service deleted successfully'
  });
});

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
};
