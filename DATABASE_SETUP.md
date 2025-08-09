# Database Setup Guide for MSCafe VPS

## Quick Setup Instructions

### 1. SSH into your VPS
```bash
ssh deploy@148.230.87.141
```

### 2. Install MySQL (One-time setup)
```bash
# Update system
sudo apt update

# Install MySQL
sudo apt install -y mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Check MySQL status
sudo systemctl status mysql
```

### 3. Secure MySQL Installation
```bash
# Set root password and secure installation
sudo mysql
```

Then run these SQL commands:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourSecureRootPassword123!';
DELETE FROM mysql.user WHERE User='';
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test_%';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Create Application Database
```bash
# Login with root password
mysql -u root -p
```

Run these SQL commands:
```sql
CREATE DATABASE msc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mscafe_user'@'localhost' IDENTIFIED BY 'YourAppPassword123!';
GRANT ALL PRIVILEGES ON msc.* TO 'mscafe_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5. Import Database Schema
```bash
# Navigate to your app directory
cd ~/mscafe

# Import the schema (if database folder exists)
mysql -u mscafe_user -p msc < database/schema.sql
```

### 6. Create Environment File
```bash
# Create .env file in backend directory
cd ~/mscafe/backend
nano .env
```

Add this content to `.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=msc
DB_USER=mscafe_user
DB_PASSWORD=YourAppPassword123!

# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_here_change_this

# File Upload Configuration
UPLOAD_PATH=./uploads
```

### 7. Restart Your Application
```bash
# Restart PM2 application to load new environment variables
pm2 restart mscafe-app

# Check if it's running
pm2 status
pm2 logs mscafe-app
```

## Alternative: Using Hostinger's MySQL Service

If your Hostinger plan includes MySQL hosting:

1. **Create Database via Hostinger Panel**
   - Login to your Hostinger control panel
   - Go to "Databases" section
   - Create a new MySQL database
   - Note down the connection details

2. **Update Environment Variables**
   - Use the Hostinger-provided database credentials
   - Update your `.env` file with the remote database details

3. **Import Schema**
   - Use phpMyAdmin or MySQL command line to import your schema

## Troubleshooting

### Check MySQL Status
```bash
sudo systemctl status mysql
```

### Check Database Connection
```bash
mysql -u mscafe_user -p -e "SHOW DATABASES;"
```

### View Application Logs
```bash
pm2 logs mscafe-app
```

### Check if Database Tables Exist
```bash
mysql -u mscafe_user -p msc -e "SHOW TABLES;"
```

## Security Notes

- Always use strong passwords
- Consider setting up firewall rules
- Regularly backup your database
- Keep MySQL updated

## Need Help?

If you encounter issues:
1. Check PM2 logs: `pm2 logs mscafe-app`
2. Check MySQL error logs: `sudo tail -f /var/log/mysql/error.log`
3. Test database connection from your app directory
