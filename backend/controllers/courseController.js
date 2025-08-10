const { TaxPackage, PackageCategory } = require('../models');
const { asyncHandler } = require('../middleware/error');
const { Op } = require('sequelize');

// @desc    Get all tax packages
// @route   GET /api/v1/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const { category, featured, search, page = 1, limit = 1000, includeInactive } = req.query;
  
  // For admin requests, include inactive packages
  const where = {};
  if (!includeInactive || includeInactive !== 'true') {
    where.is_active = true; // Only show active packages for public requests
  }
  
  if (category) where.category_id = category;
  if (featured === 'true') where.is_featured = true;
  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }

  const offset = (page - 1) * limit;

  const { count, rows: packages } = await TaxPackage.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset)
  });

  res.json({
    success: true,
    count: packages.length,
    total: count,
    data: packages,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    }
  });
});

// @desc    Get single tax package
// @route   GET /api/v1/courses/:id
// @access  Public
const getCourse = asyncHandler(async (req, res) => {
  const taxPackage = await TaxPackage.findByPk(req.params.id, {
    include: [{
      model: PackageCategory,
      as: 'category',
      attributes: ['id', 'name', 'slug']
    }]
  });

  if (!taxPackage || !taxPackage.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Tax package not found'
    });
  }

  res.json({
    success: true,
    data: taxPackage
  });
});

// @desc    Create tax package
// @route   POST /api/v1/courses
// @access  Private (Admin)
const createCourse = asyncHandler(async (req, res) => {
  const taxPackage = await TaxPackage.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Tax package created successfully',
    data: taxPackage
  });
});

// @desc    Update tax package
// @route   PUT /api/v1/courses/:id
// @access  Private (Admin)
const updateCourse = asyncHandler(async (req, res) => {
  const taxPackage = await TaxPackage.findByPk(req.params.id);

  if (!taxPackage) {
    return res.status(404).json({
      success: false,
      message: 'Tax package not found'
    });
  }

  await taxPackage.update(req.body);

  res.json({
    success: true,
    message: 'Tax package updated successfully',
    data: taxPackage
  });
});

// @desc    Delete tax package
// @route   DELETE /api/v1/courses/:id
// @access  Private (Admin)
const deleteCourse = asyncHandler(async (req, res) => {
  const taxPackage = await TaxPackage.findByPk(req.params.id);

  if (!taxPackage) {
    return res.status(404).json({
      success: false,
      message: 'Tax package not found'
    });
  }

  await taxPackage.destroy();

  res.json({
    success: true,
    message: 'Tax package deleted successfully'
  });
});

// @desc    Get package categories
// @route   GET /api/v1/courses/categories
// @access  Public
const getCourseCategories = asyncHandler(async (req, res) => {
  const categories = await PackageCategory.findAll({
    where: { isActive: true },
    include: [{
      model: TaxPackage,
      as: 'packages',
      attributes: ['id'],
      where: { isActive: true },
      required: false
    }]
  });

  res.json({
    success: true,
    count: categories.length,
    data: categories
  });
});

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseCategories
};
