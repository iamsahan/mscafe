const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const {
  Admin,
  TaxPackage,
  PackageCategory,
  Service
} = require('../models');

require('dotenv').config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Sync database
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    // Create admin user
    const admin = await Admin.create({
      email: process.env.ADMIN_EMAIL || 'admin@taxschool.com',
      password: process.env.ADMIN_PASSWORD || 'Admin123!@#',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'super_admin',
      permissions: {
        courses: 'full',
        content: 'full',
        services: 'full'
      }
    });
    console.log('✅ Admin user created');

    // Create basic package categories (essential for application structure)
    const categories = await PackageCategory.bulkCreate([
      {
        name: 'Basic',
        description: 'Basic course packages for beginners',
        slug: 'basic'
      },
      {
        name: 'Professional',
        description: 'Professional course packages for advanced users',
        slug: 'professional'
      }
    ]);


    console.log('🎉 Database seeding completed successfully!');
    console.log(`📧 Admin credentials: ${process.env.ADMIN_EMAIL || 'admin@taxschool.com'} / ${process.env.ADMIN_PASSWORD || 'Admin123!@#'}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
