-- Migration to add link column to existing tax_packages and services tables
-- Run this if you have an existing database

-- Add link column to tax_packages table
ALTER TABLE tax_packages ADD COLUMN link VARCHAR(1000) AFTER image_url;

-- Add link column to services table  
ALTER TABLE services ADD COLUMN link VARCHAR(1000) AFTER requirements;

-- Update existing records with sample links (optional)
UPDATE tax_packages SET link = 'https://example.com/enroll/basic-tax-course' WHERE id = 1;
UPDATE tax_packages SET link = 'https://example.com/enroll/professional-tax-program' WHERE id = 2;
UPDATE tax_packages SET link = 'https://example.com/enroll/advanced-business-tax' WHERE id = 3;
UPDATE tax_packages SET link = 'https://example.com/enroll/individual-tax-filing' WHERE id = 4;

UPDATE services SET link = 'https://calendly.com/book-tax-consultation' WHERE id = 1;
UPDATE services SET link = 'https://calendly.com/book-business-tax-prep' WHERE id = 2;
UPDATE services SET link = 'https://calendly.com/book-financial-planning' WHERE id = 3;
UPDATE services SET link = 'https://calendly.com/book-business-advisory' WHERE id = 4;
