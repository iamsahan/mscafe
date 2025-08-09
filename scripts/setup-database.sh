#!/bin/bash
# Database Setup Script for VPS
# Run this script on your VPS to set up MySQL database

echo "🗄️ Setting up MySQL Database for MSCafe..."

# Update system packages
sudo apt update

# Install MySQL Server
echo "Installing MySQL Server..."
sudo apt install -y mysql-server

# Start and enable MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL installation
echo "Securing MySQL installation..."
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_secure_root_password';"
sudo mysql -e "DELETE FROM mysql.user WHERE User='';"
sudo mysql -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
sudo mysql -e "DROP DATABASE IF EXISTS test;"
sudo mysql -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test_%';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Create database and user for the application
echo "Creating application database and user..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS msc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p -e "CREATE USER IF NOT EXISTS 'mscafe_user'@'localhost' IDENTIFIED BY 'your_secure_app_password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON msc.* TO 'mscafe_user'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"

echo "✅ Database setup completed!"
echo ""
echo "📝 Next steps:"
echo "1. Import the schema: mysql -u mscafe_user -p msc < /path/to/schema.sql"
echo "2. Create .env file in your backend directory with these credentials"
echo "3. Restart your PM2 application"
