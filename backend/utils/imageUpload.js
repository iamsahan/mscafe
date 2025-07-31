const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const createImageStorage = (subfolder) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(process.env.UPLOAD_PATH || './uploads', 'images', subfolder);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
};

// Image upload configuration for services
const serviceImageUpload = multer({
  storage: createImageStorage('services'),
  limits: {
    fileSize: parseInt(process.env.MAX_IMAGE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: function (req, file, cb) {
    // Allow common image types
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Course image upload configuration
const courseImageUpload = multer({
  storage: createImageStorage('courses'),
  limits: {
    fileSize: parseInt(process.env.MAX_IMAGE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

module.exports = {
  serviceImageUpload,
  courseImageUpload,
  createImageStorage
};
