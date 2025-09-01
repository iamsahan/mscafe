#!/usr/bin/env node

/**
 * Database Setup Script for VPS
 * This script helps set up the database user and permissions for the MSC project
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'msc',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔄 Setting up database...');
    
    // First, try to connect as root to create the database and user
    console.log('Please enter MySQL root password when prompted.');
    
    // Create connection as root (you'll need to run this with root privileges)
    connection = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: 'root',
      password: '', // You'll need to modify this or run mysql commands manually
    });

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\`;`);
    console.log(`✅ Database '${DB_CONFIG.database}' created or already exists`);

    // Create user if it doesn't exist
    await connection.execute(`CREATE USER IF NOT EXISTS '${DB_CONFIG.user}'@'localhost' IDENTIFIED BY '${DB_CONFIG.password}';`);
    console.log(`✅ User '${DB_CONFIG.user}' created or already exists`);

    // Grant privileges
    await connection.execute(`GRANT ALL PRIVILEGES ON \`${DB_CONFIG.database}\`.* TO '${DB_CONFIG.user}'@'localhost';`);
    await connection.execute(`FLUSH PRIVILEGES;`);
    console.log(`✅ Privileges granted to '${DB_CONFIG.user}' on '${DB_CONFIG.database}'`);

    // Test the new connection
    await connection.end();
    
    const testConnection = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      database: DB_CONFIG.database,
    });

    await testConnection.ping();
    console.log('✅ Database connection test successful!');
    await testConnection.end();

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.log('\n📝 Manual setup instructions:');
    console.log('1. Connect to MySQL as root:');
    console.log('   mysql -u root -p');
    console.log('\n2. Run the following SQL commands:');
    console.log(`   CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\`;`);
    console.log(`   CREATE USER IF NOT EXISTS '${DB_CONFIG.user}'@'localhost' IDENTIFIED BY '${DB_CONFIG.password}';`);
    console.log(`   GRANT ALL PRIVILEGES ON \`${DB_CONFIG.database}\`.* TO '${DB_CONFIG.user}'@'localhost';`);
    console.log('   FLUSH PRIVILEGES;');
    console.log('   EXIT;');
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n⚠️  Access denied: Please run this script with proper MySQL root credentials');
      console.log('   or execute the manual commands above');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
