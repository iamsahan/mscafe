# Database Setup Guide

This directory contains the SQL files needed to set up the MySQL database for the Tax Education & Financial Services Platform.

## Files

- `schema.sql` - Complete database schema with all tables and indexes
- `sample_data.sql` - Sample data for testing and development

## Quick Setup

1. Make sure MySQL is installed and running
2. Create the database and tables:
   ```sql
   mysql -u root -p < schema.sql
   ```

3. Insert sample data:
   ```sql
   mysql -u root -p < sample_data.sql
   ```

## Database Structure

### Core Tables
- **users** - Platform users (students, clients)
- **admins** - Administrative users with role-based permissions
- **courses** - Tax education courses
- **course_categories** - Course categorization
- **enrollments** - Course enrollment tracking
- **services** - Financial services offered
- **bookings** - Service appointment bookings
- **events** - Webinars, workshops, seminars
- **event_registrations** - Event attendance tracking

### Content Tables
- **testimonials** - Customer testimonials and reviews
- **faqs** - Frequently asked questions
- **contacts** - Contact form submissions
- **resources** - Downloadable resources
- **resource_downloads** - Download tracking
- **newsletter_subscriptions** - Email newsletter subscriptions

## Default Admin Credentials
- Email: admin@taxschool.com
- Password: (will be set during backend setup)

## Sample Users
The database includes 5 sample users with different roles and enrollment status for testing purposes.

## Performance Notes
- Indexes are created on frequently queried columns
- Foreign key constraints ensure data integrity
- Timestamps track creation and modification times
- JSON fields store flexible configuration data
