const Joi = require('joi');

// Common validation schemas
const emailSchema = Joi.string().email().required();
const passwordSchema = Joi.string().min(6).required();
const nameSchema = Joi.string().min(2).max(100).required();

// User validation schemas
const userRegistration = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
  dateOfBirth: Joi.date().optional(),
  address: Joi.string().max(500).optional(),
  city: Joi.string().max(100).optional(),
  state: Joi.string().max(50).optional(),
  zipCode: Joi.string().max(10).optional()
});

const userLogin = Joi.object({
  email: emailSchema,
  password: Joi.string().required()
});

const userUpdate = Joi.object({
  firstName: Joi.string().min(2).max(100).optional(),
  lastName: Joi.string().min(2).max(100).optional(),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
  dateOfBirth: Joi.date().optional(),
  address: Joi.string().max(500).optional(),
  city: Joi.string().max(100).optional(),
  state: Joi.string().max(50).optional(),
  zipCode: Joi.string().max(10).optional()
});

// Tax Package validation schemas
const courseCreate = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().optional(),
  price: Joi.string().max(50).required(),
  revenueShare: Joi.string().max(20).optional(),
  efinRequired: Joi.boolean().optional(),
  efinDescription: Joi.string().max(255).optional(),
  ptinRequired: Joi.boolean().optional(),
  ptinDescription: Joi.string().max(255).optional(),
  minReturns: Joi.number().integer().min(0).optional(),
  minReturnsDescription: Joi.string().max(255).optional(),
  categoryId: Joi.number().integer().positive().optional(),
  process: Joi.array().items(Joi.string()).optional(),
  includes: Joi.array().items(Joi.string()).optional(),
  imageUrl: Joi.string().max(500).optional(),
  link: Joi.string().uri().max(1000).optional(),
  isActive: Joi.boolean().optional(),
  featured: Joi.boolean().optional(),
  sortOrder: Joi.number().integer().min(0).optional()
});

const courseUpdate = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  description: Joi.string().optional(),
  price: Joi.string().max(50).optional(),
  revenueShare: Joi.string().max(20).optional(),
  efinRequired: Joi.boolean().optional(),
  efinDescription: Joi.string().max(255).optional(),
  ptinRequired: Joi.boolean().optional(),
  ptinDescription: Joi.string().max(255).optional(),
  minReturns: Joi.number().integer().min(0).optional(),
  minReturnsDescription: Joi.string().max(255).optional(),
  categoryId: Joi.number().integer().positive().optional(),
  process: Joi.array().items(Joi.string()).optional(),
  includes: Joi.array().items(Joi.string()).optional(),
  imageUrl: Joi.string().max(500).optional(),
  link: Joi.string().uri().max(1000).optional(),
  seoKeywords: Joi.string().max(500).allow('', null).optional(),
  seoDescription: Joi.string().allow('', null).optional(),
  isActive: Joi.boolean().optional(),
  featured: Joi.boolean().optional(),
  sortOrder: Joi.number().integer().min(0).optional()
});

// Service validation schemas
const serviceCreate = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(5000).allow('', null).optional(),
  shortDescription: Joi.string().max(500).allow('', null).optional(),
  price: Joi.number().precision(2).min(0).required(),
  durationMinutes: Joi.number().integer().min(15).optional(),
  serviceType: Joi.string().valid('consultation', 'tax_preparation', 'financial_planning', 'business_advisory').required(),
  imageUrl: Joi.string().max(500).allow('', null).optional(),
  link: Joi.string().uri().allow('', null).max(1000).optional(),
  isActive: Joi.boolean().optional(),
  featured: Joi.boolean().optional(),
  requirements: Joi.string().max(5000).allow('', null).optional(),
  seoKeywords: Joi.string().max(500).allow('', null).optional(),
  seoDescription: Joi.string().max(500).allow('', null).optional()
});

const serviceUpdate = Joi.object({
  name: Joi.string().min(3).max(255).optional(),
  description: Joi.string().max(5000).allow('', null).optional(),
  shortDescription: Joi.string().max(500).allow('', null).optional(),
  price: Joi.number().precision(2).min(0).optional(),
  durationMinutes: Joi.number().integer().min(15).optional(),
  serviceType: Joi.string().valid('consultation', 'tax_preparation', 'financial_planning', 'business_advisory').optional(),
  imageUrl: Joi.string().max(500).allow('', null).optional(),
  link: Joi.string().uri().allow('', null).max(1000).optional(),
  isActive: Joi.boolean().optional(),
  featured: Joi.boolean().optional(),
  requirements: Joi.string().max(5000).allow('', null).optional(),
  seoKeywords: Joi.string().max(500).allow('', null).optional(),
  seoDescription: Joi.string().max(500).allow('', null).optional()
});

// Booking validation schemas
const bookingCreate = Joi.object({
  serviceId: Joi.number().integer().positive().required(),
  appointmentDate: Joi.date().greater('now').required(),
  notes: Joi.string().max(1000).optional()
});

const bookingUpdate = Joi.object({
  appointmentDate: Joi.date().greater('now').optional(),
  notes: Joi.string().max(1000).optional(),
  status: Joi.string().valid('pending', 'confirmed', 'in_progress', 'completed', 'cancelled').optional(),
  adminNotes: Joi.string().max(1000).optional(),
  paymentStatus: Joi.string().valid('pending', 'paid', 'refunded').optional(),
  meetingLink: Joi.string().uri().optional()
});

// Event validation schemas
const eventCreate = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().optional(),
  eventType: Joi.string().valid('webinar', 'workshop', 'seminar', 'conference').required(),
  startDate: Joi.date().greater('now').required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required(),
  location: Joi.string().max(255).optional(),
  virtualLink: Joi.string().uri().optional(),
  maxAttendees: Joi.number().integer().min(0).optional(),
  price: Joi.number().precision(2).min(0).optional(),
  featured: Joi.boolean().optional()
});

// Testimonial validation
const testimonialCreate = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().optional(),
  title: Joi.string().max(255).optional(),
  content: Joi.string().min(10).max(2000).required(),
  rating: Joi.number().integer().min(1).max(5).required()
});

// FAQ validation
const faqCreate = Joi.object({
  question: Joi.string().min(10).required(),
  answer: Joi.string().min(10).required(),
  category: Joi.string().valid('general', 'courses', 'services', 'payment', 'technical').optional(),
  orderPriority: Joi.number().integer().optional()
});

// Newsletter subscription validation
const newsletterSubscription = Joi.object({
  email: emailSchema,
  name: Joi.string().min(2).max(100).optional(),
  subscriptionType: Joi.string().valid('general', 'courses', 'services', 'events').optional()
});

// Priority Tradelines AU validation schemas
const priorityTradelineCreate = Joi.object({
  spots: Joi.string().min(1).max(255).required(),
  age: Joi.number().integer().min(1990).max(2025).required(),
  bank: Joi.string().min(2).max(255).required(),
  creditLimit: Joi.number().positive().precision(2).required(),
  statement: Joi.string().max(255).optional(),
  closingDate: Joi.date().required(),
  price: Joi.number().positive().precision(2).required(),
  isActive: Joi.boolean().optional()
});

const priorityTradelineUpdate = Joi.object({
  spots: Joi.string().min(1).max(255).optional(),
  age: Joi.number().integer().min(1990).max(2025).optional(),
  bank: Joi.string().min(2).max(255).optional(),
  creditLimit: Joi.number().positive().precision(2).optional(),
  statement: Joi.string().max(255).optional(),
  closingDate: Joi.date().optional(),
  price: Joi.number().positive().precision(2).optional(),
  isActive: Joi.boolean().optional()
});

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    console.log('Validating request body:', req.body);
    const { error } = schema.validate(req.body);
    if (error) {
      console.log('Validation error details:', error.details);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message),
        receivedData: req.body
      });
    }
    next();
  };
};

module.exports = {
  validate,
  schemas: {
    userRegistration,
    userLogin,
    userUpdate,
    courseCreate,
    courseUpdate,
    serviceCreate,
    serviceUpdate,
    bookingCreate,
    bookingUpdate,
    eventCreate,
    testimonialCreate,
    faqCreate,
    newsletterSubscription,
    priorityTradelineCreate,
    priorityTradelineUpdate
  }
};
