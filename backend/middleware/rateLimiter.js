const rateLimit = require("express-rate-limit");

// Skip rate limiting in development environment
const skipInDevelopment = process.env.NODE_ENV === "development";

// Auth rate limiter - stricter for authentication endpoints
const authLimiter = skipInDevelopment
  ? (req, res, next) => next()
  : rateLimit({
      windowMs:
        parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // 15 minutes
      max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
      message: {
        success: false,
        message: "Too many authentication attempts, please try again later",
      },
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      keyGenerator: (req) => {
        // Simplified key generator to avoid proxy issues
        return req.ip || req.connection.remoteAddress || 'anonymous';
      },
      handler: (req, res) => {
        res.status(429).json({
          success: false,
          message: "Too many authentication attempts, please try again later",
        });
      },
    });

// General API rate limiter
const generalLimiter = skipInDevelopment
  ? (req, res, next) => next()
  : rateLimit({
      windowMs:
        parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
      message: {
        success: false,
        message: "Too many requests, please try again later",
      },
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req) => {
        // Skip rate limiting for internal requests and health checks
        return req.path === '/health' || req.ip === '127.0.0.1';
      },
      keyGenerator: (req) => {
        // Simplified key generator to avoid proxy issues
        return req.ip || req.connection.remoteAddress || 'anonymous';
      },
      handler: (req, res) => {
        res.status(429).json({
          success: false,
          message: "Too many requests, please try again later",
        });
      },
    });

// Strict rate limiter for password reset and sensitive operations
const strictLimiter = skipInDevelopment
  ? (req, res, next) => next()
  : rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // limit each IP to 3 requests per hour
      message: {
        success: false,
        message: "Too many attempts, please try again in an hour",
      },
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => {
        // Simplified key generator to avoid proxy issues
        return req.ip || req.connection.remoteAddress || 'anonymous';
      },
      handler: (req, res) => {
        res.status(429).json({
          success: false,
          message: "Too many attempts, please try again in an hour",
        });
      },
    });

module.exports = {
  authLimiter,
  generalLimiter,
  strictLimiter,
};
