const rateLimit = require('express-rate-limit');

// Skip rate limiting in development environment
const skipInDevelopment = process.env.NODE_ENV === 'development';

// Store for rate limiting (use Redis in production)
const store = process.env.REDIS_URL ? 
  new (require('rate-limit-redis'))({
    client: require('redis').createClient({ url: process.env.REDIS_URL }),
    prefix: 'rl:'
  }) : undefined;

// Auth rate limiter - stricter for authentication endpoints
const authLimiter = skipInDevelopment ? (req, res, next) => next() : rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  store,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later'
    });
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

// General API rate limiter with dynamic limits based on user type
const generalLimiter = skipInDevelopment ? (req, res, next) => next() : rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    // Higher limits for authenticated users
    if (req.user) return 200;
    return parseInt(process.env.RATE_LIMIT_MAX) || 100;
  },
  store,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later'
    });
  },
  skip: (req) => {
    // Skip rate limiting for health checks and static files
    return req.path === '/health' || req.path.startsWith('/uploads');
  }
});

// Strict rate limiter for password reset and sensitive operations
const strictLimiter = skipInDevelopment ? (req, res, next) => next() : rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per hour
  message: {
    success: false,
    message: 'Too many attempts, please try again in an hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many attempts, please try again in an hour'
    });
  }
});

module.exports = {
  authLimiter,
  generalLimiter,
  strictLimiter
};
