-- MSG Services Platform Database Schema
-- Generated based on backend Sequelize models
-- Date: 2025-07-25

-- Create database
CREATE DATABASE IF NOT EXISTS `msc` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `msc`;

-- ========================================
-- ADMINS TABLE
-- ========================================
CREATE TABLE `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `role` ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
  `permissions` JSON,
  `is_active` BOOLEAN DEFAULT TRUE,
  `last_login` DATETIME,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================
-- PACKAGE CATEGORIES TABLE
-- ========================================
CREATE TABLE `package_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================
-- TAX PACKAGES TABLE (COURSES)
-- ========================================
CREATE TABLE `tax_packages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` VARCHAR(50) NOT NULL,
  `revenue_share` VARCHAR(20),
  `efin_required` BOOLEAN DEFAULT FALSE,
  `efin_description` TEXT,
  `ptin_required` BOOLEAN DEFAULT FALSE,
  `ptin_description` TEXT,
  `min_returns` INT DEFAULT 0,
  `min_returns_description` TEXT,
  `category_id` INT,
  `process` JSON,
  `includes` JSON,
  `image_url` VARCHAR(500),
  `link` VARCHAR(1000),
  `featured` BOOLEAN DEFAULT FALSE,
  `sort_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `package_categories`(`id`) ON DELETE SET NULL
);

-- ========================================
-- SERVICES TABLE
-- ========================================
CREATE TABLE `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `short_description` VARCHAR(500),
  `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `duration_minutes` INT DEFAULT 60,
  `service_type` ENUM('consultation', 'tax_preparation', 'financial_planning', 'business_advisory') NOT NULL,
  `image_url` VARCHAR(500),
  `is_active` BOOLEAN DEFAULT TRUE,
  `featured` BOOLEAN DEFAULT FALSE,
  `sort_order` INT DEFAULT 0,
  `link` VARCHAR(1000),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX `idx_tax_packages_category` ON `tax_packages`(`category_id`);
CREATE INDEX `idx_tax_packages_active` ON `tax_packages`(`is_active`);
CREATE INDEX `idx_tax_packages_featured` ON `tax_packages`(`featured`);
CREATE INDEX `idx_services_active` ON `services`(`is_active`);
CREATE INDEX `idx_services_featured` ON `services`(`featured`);
CREATE INDEX `idx_services_type` ON `services`(`service_type`);


-- ========================================
-- SAMPLE DATA
-- ========================================

-- Insert default admin user
INSERT INTO `admins` (`email`, `password`, `first_name`, `last_name`, `role`, `permissions`) VALUES
('admin@taxschool.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewNCopxJzQBEjnCu', 'Super', 'Admin', 'super_admin', '{"courses": "full", "content": "full", "services": "full"}');

-- Insert package categories
INSERT INTO `package_categories` (`name`, `description`, `slug`) VALUES
('Basic', 'Basic course packages for beginners', 'basic'),
('Professional', 'Professional course packages for advanced users', 'professional');

-- Insert sample tax packages
INSERT INTO `tax_packages` (`title`, `description`, `price`, `category_id`, `featured`, `image_url`, `link`) VALUES
('Basic Tax Preparation Course', 'Learn the fundamentals of tax preparation', '$299', 1, TRUE, '/uploads/test.png', 'https://example.com/enroll/basic-tax-course'),
('Professional Tax Consultant Program', 'Advanced tax consultation and business advisory', '$599', 2, TRUE, '/uploads/test2.jpg', 'https://example.com/enroll/professional-tax-program'),
('Advanced Business Tax Strategy', 'Master advanced tax strategies for businesses', '$899', 2, FALSE, '/uploads/test3.jpg', 'https://example.com/enroll/advanced-business-tax'),
('Individual Tax Filing Essentials', 'Complete guide to personal tax filing', '$199', 1, FALSE, '/uploads/test4.jpg', 'https://example.com/enroll/individual-tax-filing');

-- Insert sample services
INSERT INTO `services` (`name`, `description`, `short_description`, `price`, `service_type`, `featured`, `image_url`, `link`) VALUES
('Tax Consultation', 'One-on-one tax consultation with certified professionals', 'Expert tax advice and consultation services', 150.00, 'consultation', TRUE, '/uploads/test.png', 'https://calendly.com/book-tax-consultation'),
('Business Tax Preparation', 'Complete business tax preparation and filing', 'Professional business tax preparation and filing services', 350.00, 'tax_preparation', TRUE, '/uploads/test2.jpg', 'https://calendly.com/book-business-tax-prep'),
('Financial Planning Session', 'Comprehensive financial planning and advisory', 'Personalized financial planning and investment advice', 200.00, 'financial_planning', FALSE, '/uploads/test3.jpg', 'https://calendly.com/book-financial-planning'),
('Business Advisory Services', 'Strategic business consulting and advisory', 'Expert business strategy and growth consulting', 275.00, 'business_advisory', TRUE, '/uploads/test4.jpg', 'https://calendly.com/book-business-advisory');
