const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import database connection
const { sequelize, testConnection } = require("./config/database");

// Import middleware
const { errorHandler, notFound } = require("./middleware/error");
const { generalLimiter } = require("./middleware/rateLimiter");

// Import routes
const courseRoutes = require("./routes/courses");
const serviceRoutes = require("./routes/services");
const priorityTradelinesAURoutes = require("./routes/priorityTradelinesAU");
const adminRoutes = require("./routes/admin");
const adminAuthRoutes = require("./routes/adminAuth");

// Import logging configuration
const logger = require("./utils/logger");

const app = express();

// Trust proxy - required when behind nginx reverse proxy
app.set("trust proxy", true);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "http://localhost:5000",
          "http://localhost:3000",
        ],
        connectSrc: [
          "'self'",
          "http://localhost:5000",
          "http://localhost:3000",
        ],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

// Rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "MSC API is running",

    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || "1.0.0",
  });
});

// API Routes
const API_VERSION = process.env.API_VERSION || "v1";

app.use(`/api/${API_VERSION}/courses`, courseRoutes);
app.use(`/api/${API_VERSION}/services`, serviceRoutes);
app.use(
  `/api/${API_VERSION}/priority-tradelines-au`,
  priorityTradelinesAURoutes
);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);
app.use(`/api/${API_VERSION}/admin/auth`, adminAuthRoutes);

// Serve uploads through API route as well
app.use(
  `/api/${API_VERSION}/uploads`,
  (req, res, next) => {
    res.header(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL || "http://localhost:3000"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    res.header("Cache-Control", "public, max-age=31536000"); // 1 year cache
    next();
  },
  express.static("./uploads")
);

// Static file serving for uploads with proper CORS and CSP headers
app.use(
  "/uploads",
  (req, res, next) => {
    res.header(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL || "http://localhost:3000"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    res.header("Cache-Control", "public, max-age=31536000"); // 1 year cache
    next();
  },
  express.static("./uploads")
);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database models (only in development)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: false });
      logger.info("Database models synchronized");
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(
        `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
      );
      console.log(
        `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
      );
      console.log(
        `📚 API Documentation: http://localhost:${PORT}/api/${API_VERSION}`
      );
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  await sequelize.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully");
  await sequelize.close();
  process.exit(0);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Promise Rejection:", err);
  console.error("Unhandled Promise Rejection:", err);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

startServer();

module.exports = app;
