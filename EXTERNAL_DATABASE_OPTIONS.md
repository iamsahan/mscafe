# Using Hostinger Managed Database

## Option 1: Hostinger Control Panel Database

1. **Login to Hostinger Control Panel**
   - Go to your VPS management dashboard
   - Look for "Databases" or "MySQL" section

2. **Create Database**
   - Database Name: `msc`
   - Username: `mscafe_user` 
   - Password: Generate strong password
   - Host: Usually `localhost` or provided by Hostinger

3. **Import Schema**
   - Use phpMyAdmin (if available)
   - Or upload schema.sql file through control panel

4. **Update .env File**
   ```env
   DB_HOST=localhost  # or provided host
   DB_PORT=3306
   DB_NAME=msc
   DB_USER=mscafe_user
   DB_PASSWORD=your_generated_password
   ```

## Option 2: External Database Service

Consider using external database services:

### PlanetScale (Free tier available)
- Free 5GB database
- Serverless MySQL platform
- Easy integration

### Railway (Free tier)
- Simple MySQL hosting
- Environment variable integration

### AWS RDS (if budget allows)
- Managed MySQL service
- High availability

## Quick Commands for External DB

```bash
# If using external database, just update your .env file:
cd ~/mscafe/backend
nano .env

# Add external database credentials:
DB_HOST=your-external-db-host.com
DB_PORT=3306
DB_NAME=msc
DB_USER=your_external_user
DB_PASSWORD=your_external_password

# Restart application
pm2 restart mscafe-app
```
