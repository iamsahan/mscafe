const express = require('express');
const router = express.Router();
const { validate, schemas } = require('../middleware/validation');
const { auth, requireAdmin, checkPermission } = require('../middleware/auth');
const { courseImageUpload } = require('../utils/imageUpload');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseCategories
} = require('../controllers/courseController');

// @route   GET /api/v1/courses
// @desc    Get all tax packages
// @access  Public
router.get('/', getCourses);

// @route   GET /api/v1/courses/categories
// @desc    Get all tax package categories
// @access  Public
router.get('/categories', getCourseCategories);

// @route   GET /api/v1/courses/:id
// @desc    Get single tax package
// @access  Public
router.get('/:id', getCourse);

// @route   POST /api/v1/courses/upload-image
// @desc    Upload course image
// @access  Private (Admin)
router.post('/upload-image', requireAdmin, checkPermission('courses'), courseImageUpload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const imageUrl = `/uploads/images/courses/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image'
    });
  }
});

// @route   POST /api/v1/courses
// @desc    Create tax package
// @access  Private (Admin)
router.post('/', requireAdmin, checkPermission('courses'), validate(schemas.courseCreate), createCourse);

// @route   PUT /api/v1/courses/:id
// @desc    Update tax package
// @access  Private (Admin)
router.put('/:id', requireAdmin, checkPermission('courses'), validate(schemas.courseUpdate), updateCourse);

// @route   DELETE /api/v1/courses/:id
// @desc    Delete tax package
// @access  Private (Admin)
router.delete('/:id', requireAdmin, checkPermission('courses'), deleteCourse);

module.exports = router;
