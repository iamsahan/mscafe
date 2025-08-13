const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 20, // Increased from 10
      min: 5,  // Increased from 0 to maintain minimum connections
      acquire: 60000, // Increased from 30000 (60 seconds)
      idle: 20000, // Increased from 10000 (20 seconds)
      evict: 10000, // Auto-evict idle connections after 10 seconds
      handleDisconnects: true, // Handle disconnections automatically
    },
    retry: {
      max: 3, // Retry failed connections 3 times
      timeout: 5000, // Wait 5 seconds between retries
    },
    dialectOptions: {
      connectTimeout: 60000, // 60 seconds
      acquireTimeout: 60000, // 60 seconds
      timeout: 60000, // 60 seconds
      multipleStatements: false,
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
      } : false
    },
    define: {
      underscored: true,
      freezeTableName: true
    }
  }
);

// Test the connection with retry logic
const testConnection = async (retries = 3) => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successfully established.');
    return true;
  } catch (error) {
    console.error(`❌ Unable to connect to the database (attempt ${4 - retries}/3):`, error.message);
    
    if (retries > 1) {
      console.log(`Retrying database connection in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return testConnection(retries - 1);
    }
    
    console.error('❌ Failed to connect to database after 3 attempts');
    return false;
  }
};

// Health check function
const checkDatabaseHealth = async () => {
  try {
    await sequelize.query('SELECT 1');
    return { healthy: true };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
};

// Graceful shutdown function
const closeDatabase = async () => {
  try {
    await sequelize.close();
    console.log('✅ Database connections closed gracefully');
  } catch (error) {
    console.error('❌ Error closing database connections:', error);
  }
};

module.exports = { sequelize, testConnection, checkDatabaseHealth, closeDatabase };
