const { Admin } = require('./models');
const bcrypt = require('bcryptjs');

const createTestAdmin = async () => {
  try {
    // Delete existing admin if exists
    await Admin.destroy({
      where: { email: 'admin@test.com' }
    });

    // Create new admin with simple credentials
    const admin = await Admin.create({
      email: 'admin@test.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'Admin',
      role: 'super_admin',
      permissions: {
        admin_management: 'full',
        packages: 'full',
        services: 'full',
        priority_tradelines: 'full'
      },
      isActive: true
    });

    console.log('✅ Test admin created successfully!');
    console.log('Email: admin@test.com');
    console.log('Password: password123');

    // Test password validation
    const isValid = await admin.validatePassword('password123');
    console.log('Password validation test:', isValid);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createTestAdmin();
