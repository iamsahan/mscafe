# VPS Database Setup Instructions

## Issues Fixed:

1. **Database Authentication Error** - MySQL access denied for root user
2. **Rate Limiter Configuration** - Trust proxy conflicts
3. **Environment Configuration** - Production settings

## Steps to Fix on Your VPS:

### 1. Update Database Credentials

The `.env` file has been updated with proper database credentials. You need to set a secure password:

```bash
# In your .env file, update this line:
DB_PASSWORD=your_secure_database_password_here
```

### 2. Set Up MySQL Database and User

Connect to MySQL as root on your VPS and run these commands:

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE IF NOT EXISTS `msc`;

-- Create dedicated user for the application
CREATE USER IF NOT EXISTS 'mscafe'@'localhost' IDENTIFIED BY 'your_secure_database_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON `msc`.* TO 'mscafe'@'localhost';
FLUSH PRIVILEGES;

-- Test the connection
USE msc;
EXIT;
```

### 3. Test Database Connection

Run the setup script to verify everything works:

```bash
cd /var/www/mscafe/backend
node setup-database.js
```

### 4. Restart Your Application

```bash
# Stop the current PM2 processes
pm2 stop all

# Restart your application
pm2 start ecosystem.config.js

# Check status
pm2 status
pm2 logs
```

## MySQL User Authentication Methods

If you're still having issues with MySQL authentication, you might need to change the authentication method:

### Option 1: Use mysql_native_password

```sql
-- Connect as root
mysql -u root -p

-- Change authentication method for the user
ALTER USER 'mscafe'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_secure_database_password_here';
FLUSH PRIVILEGES;
```

### Option 2: Check current authentication methods

```sql
-- Check what authentication plugins are being used
SELECT user, host, plugin FROM mysql.user WHERE user='mscafe';

-- If it shows 'auth_socket', change it to 'mysql_native_password'
ALTER USER 'mscafe'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_secure_database_password_here';
```

## Common VPS MySQL Issues and Solutions:

### 1. MySQL not allowing root login
```bash
# If MySQL doesn't allow root login, try:
sudo mysql -u root

# Then create your user from inside MySQL
```

### 2. Permission denied errors
```bash
# Make sure MySQL service is running
sudo systemctl status mysql
sudo systemctl start mysql
```

### 3. Socket authentication issues
```bash
# Check MySQL error logs
sudo tail -f /var/log/mysql/error.log
```

## Security Recommendations:

1. **Use a strong password** for the database user
2. **Don't use root** for application connections
3. **Limit database privileges** to only what's needed
4. **Enable firewall** to restrict database access

## Environment Variables to Update:

Make sure your `.env` file on the VPS has these production values:

```env
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_NAME=msc
DB_USER=mscafe
DB_PASSWORD=your_secure_database_password_here
FRONTEND_URL=https://moneysolutioncafe.com
```

## Testing the Fix:

1. Check if the server starts without database errors:
   ```bash
   pm2 logs project-backend
   ```

2. Test the health endpoint:
   ```bash
   curl http://localhost:5000/health
   ```

3. Test the API endpoints:
   ```bash
   curl http://localhost:5000/api/v1/services
   curl http://localhost:5000/api/v1/courses
   ```

If you continue to have issues, check the specific error messages in the PM2 logs and let me know what they show.
