-- Priority Tradelines AU Inventory Table
-- Date: 2025-07-27

USE `msc`;

-- ========================================
-- PRIORITY TRADELINES AU INVENTORY TABLE
-- ========================================
CREATE TABLE `priority_tradelines_au` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `spots` VARCHAR(255) NOT NULL COMMENT 'Available spots/slots',
  `age` INT NOT NULL COMMENT 'Account opening year (e.g., 2022)',
  `bank` VARCHAR(255) NOT NULL COMMENT 'Bank name',
  `credit_limit` DECIMAL(12, 2) NOT NULL COMMENT 'Credit limit amount',
  `statement` VARCHAR(255) COMMENT 'Statement information',
  `closing_date` DATE NOT NULL COMMENT 'Account closing date',
  `price` DECIMAL(10, 2) NOT NULL COMMENT 'Price for the tradeline',
  `is_active` BOOLEAN DEFAULT TRUE COMMENT 'Whether the tradeline is active/available',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX `idx_priority_tradelines_active` ON `priority_tradelines_au`(`is_active`);
CREATE INDEX `idx_priority_tradelines_bank` ON `priority_tradelines_au`(`bank`);
CREATE INDEX `idx_priority_tradelines_price` ON `priority_tradelines_au`(`price`);
CREATE INDEX `idx_priority_tradelines_age` ON `priority_tradelines_au`(`age`);

-- ========================================
-- SAMPLE DATA
-- ========================================
INSERT INTO `priority_tradelines_au` (`spots`, `age`, `bank`, `credit_limit`, `statement`, `closing_date`, `price`) VALUES
('5 spots available', 2020, 'Chase Bank', 15000.00, 'Monthly statement', '2025-08-15', 750.00),
('3 spots available', 2018, 'Bank of America', 25000.00, 'Bi-monthly statement', '2025-08-20', 1250.00),
('8 spots available', 2022, 'Wells Fargo', 10000.00, 'Monthly statement', '2025-08-10', 550.00),
('2 spots available', 2016, 'Citibank', 30000.00, 'Monthly statement', '2025-08-25', 1800.00),
('6 spots available', 2023, 'Capital One', 8000.00, 'Monthly statement', '2025-08-12', 450.00);
