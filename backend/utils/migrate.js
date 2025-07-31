const { sequelize } = require('../config/database');
require('dotenv').config();

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync all models (create tables)
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synchronized');
    
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

// Run migration if called directly
if (require.main === module) {
  migrate();
}

module.exports = migrate;
