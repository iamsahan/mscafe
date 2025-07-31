const { Admin } = require('./models');
const bcrypt = require('bcryptjs');

const createPermanentAdmins = async () => {
  try {
    console.log('🔧 Creating permanent admin users...\n');

    // 1. Fix the original admin (admin@taxschool.com)
    let originalAdmin = await Admin.findOne({
      where: { email: 'admin@taxschool.com' }
    });

    if (originalAdmin) {
      // Update existing admin with correct password
      await originalAdmin.update({
        password: 'Admin123!@#',
        firstName: 'Super',
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
      console.log('✅ Fixed original admin: admin@taxschool.com');
    } else {
      // Create new original admin
      originalAdmin = await Admin.create({
        email: 'admin@taxschool.com',
        password: 'Admin123!@#',
        firstName: 'Super',
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
      console.log('✅ Created original admin: admin@taxschool.com');
    }

    // Test original admin password
    const originalIsValid = await originalAdmin.validatePassword('Admin123!@#');
    console.log('   Password validation:', originalIsValid);

    // 2. Ensure test admin exists
    let testAdmin = await Admin.findOne({
      where: { email: 'admin@test.com' }
    });

    if (!testAdmin) {
      testAdmin = await Admin.create({
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
      console.log('✅ Created test admin: admin@test.com');
    } else {
      console.log('✅ Test admin already exists: admin@test.com');
    }

    // Test test admin password
    const testIsValid = await testAdmin.validatePassword('password123');
    console.log('   Password validation:', testIsValid);

    console.log('\n🎯 PERMANENT ADMIN CREDENTIALS:');
    console.log('📧 Production Admin:');
    console.log('   Email: admin@taxschool.com');
    console.log('   Password: Admin123!@#');
    console.log('');
    console.log('🧪 Test Admin:');
    console.log('   Email: admin@test.com');
    console.log('   Password: password123');
    console.log('');
    console.log('✅ Both admins are now PERMANENT in database!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating permanent admins:', error);
    process.exit(1);
  }
};

createPermanentAdmins();
