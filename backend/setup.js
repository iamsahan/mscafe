#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 MSG Services Platform - Setup Script');
console.log('=====================================\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ Created .env file');
  console.log('⚠️  Please update the database credentials in .env file\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Install dependencies if needed
try {
  console.log('📦 Checking dependencies...');
  execSync('npm list --depth=0', { stdio: 'ignore' });
  console.log('✅ Dependencies are installed\n');
} catch (error) {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed\n');
}

// Setup database
try {
  console.log('🗄️  Setting up database...');
  const setupDatabase = require('./utils/setupDatabase');
  await setupDatabase();
  console.log('✅ Database setup completed\n');
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  console.log('Please check your database credentials in .env file\n');
  process.exit(1);
}

console.log('🎉 Setup completed successfully!');
console.log('\nNext steps:');
console.log('1. Update database credentials in .env file if needed');
console.log('2. Run "npm run dev" to start the development server');
console.log('3. The API will be available at http://localhost:5000');
console.log('\nAPI Endpoints:');
console.log('- GET /api/v1/courses - Get all courses');
console.log('- GET /api/v1/services - Get all services');
console.log('- GET /api/v1/bookings - Get bookings (requires auth)');
