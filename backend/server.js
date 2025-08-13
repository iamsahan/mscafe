const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import database connection
const { sequelize, testConnection, checkDatabaseHealth, closeDatabase } = require('./config/database');

// Import middleware
const { errorHandler, notFound } = require('./middleware/error');
const { generalLimiter } = require('./middleware/rateLimiter');

// Import routes
const courseRoutes = require('./routes/courses');
const serviceRoutes = require('./routes/services');
const priorityTradelinesAURoutes = require('./routes/priorityTradelinesAU');
const adminRoutes = require('./routes/admin');
const adminAuthRoutes = require('./routes/adminAuth');

// Import logging configuration
const logger = require('./utils/logger');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http://localhost:5000", "http://localhost:3000"],
      connectSrc: ["'self'", "http://localhost:5000", "http://localhost:3000"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbHealth = await checkDatabaseHealth();
  
  const healthStatus = {
    success: true,
    message: 'MSC API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    database: dbHealth,
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };
  
  const statusCode = dbHealth.healthy ? 200 : 503;
  res.status(statusCode).json(healthStatus);
});

// API Routes
const API_VERSION = process.env.API_VERSION || 'v1';

app.use(`/api/${API_VERSION}/courses`, courseRoutes);
app.use(`/api/${API_VERSION}/services`, serviceRoutes);
app.use(`/api/${API_VERSION}/priority-tradelines-au`, priorityTradelinesAURoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);
app.use(`/api/${API_VERSION}/admin/auth`, adminAuthRoutes);

// Serve uploads through API route as well
app.use(`/api/${API_VERSION}/uploads`, (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cache-Control', 'public, max-age=31536000'); // 1 year cache
  next();
}, express.static('./uploads'));

// Static file serving for uploads with proper CORS and CSP headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cache-Control', 'public, max-age=31536000'); // 1 year cache
  next();
}, express.static('./uploads'));

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Prevent multiple server instances on the same port
let server;

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection with retry logic
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      logger.warn('Database connection failed, but starting server anyway...');
      console.warn('⚠️ Database connection failed, but starting server anyway...');
    }
    
    // Sync database models (only in development and if DB is connected)
    if (dbConnected && process.env.NODE_ENV === 'development') {
      try {
        await sequelize.sync({ alter: false });
        logger.info('Database models synchronized');
      } catch (syncError) {
        logger.error('Database sync failed:', syncError);
        console.error('❌ Database sync failed:', syncError.message);
      }
    }
    
    // Start server with error handling
    server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/${API_VERSION}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use`);
        console.error(`❌ Port ${PORT} is already in use. Please kill existing process or use different port.`);
        process.exit(1);
      } else {
        logger.error('Server error:', error);
        console.error('❌ Server error:', error);
      }
    });
    
    // Set server timeout to handle slow requests
    server.timeout = 120000; // 2 minutes
    server.keepAliveTimeout = 65000; // 65 seconds
    server.headersTimeout = 66000; // 66 seconds
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);
  console.log(`🔄 ${signal} received, shutting down gracefully...`);
  
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      console.log('✅ HTTP server closed');
      
      // Close database connections
      await closeDatabase();
      
      logger.info('Graceful shutdown completed');
      console.log('✅ Graceful shutdown completed');
      process.exit(0);
    });
    
    // Force close after 30 seconds
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      console.error('❌ Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 30000);
  } else {
    await closeDatabase();
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection at:', promise, 'reason:', err);
  console.error('❌ Unhandled Promise Rejection:', err);
  
  // Close server gracefully
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  console.error('❌ Uncaught Exception:', err);
  
  // Close server gracefully
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

startServer();

module.exports = app;
