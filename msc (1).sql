-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 10, 2025 at 02:18 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `msc`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `role` enum('super_admin','admin','moderator') DEFAULT 'admin',
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `email`, `password`, `first_name`, `last_name`, `role`, `permissions`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(2, 'admin@test.com', '$2a$12$haV57DhckSYqpKy0BXCjLek4zR8CCciVCdaT3s1eUd3e.Xa91Xq62', 'Main ', 'Admin', 'super_admin', '{\"admin_management\":\"full\",\"packages\":\"full\",\"services\":\"full\",\"priority_tradelines\":\"full\"}', 1, '2025-08-08 09:24:50', '2025-07-28 13:53:16', '2025-08-08 09:24:50');

-- --------------------------------------------------------

--
-- Table structure for table `package_categories`
--

CREATE TABLE `package_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `slug` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `package_categories`
--

INSERT INTO `package_categories` (`id`, `name`, `description`, `slug`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Basic', 'Basic course packages for beginners', 'basic', 1, '2025-07-28 11:33:29', '2025-07-28 11:33:29'),
(2, 'Professional', 'Professional course packages for advanced users', 'professional', 1, '2025-07-28 11:33:29', '2025-07-28 11:33:29');

-- --------------------------------------------------------

--
-- Table structure for table `priority_tradelines_au`
--

CREATE TABLE `priority_tradelines_au` (
  `id` int(11) NOT NULL,
  `spots` varchar(255) NOT NULL COMMENT 'Available spots/slots',
  `age` int(11) NOT NULL COMMENT 'Account opening year (e.g., 2022)',
  `bank` varchar(255) NOT NULL COMMENT 'Bank name',
  `credit_limit` decimal(12,2) NOT NULL COMMENT 'Credit limit amount',
  `statement` varchar(255) DEFAULT NULL COMMENT 'Statement information',
  `closing_date` date NOT NULL COMMENT 'Account closing date',
  `price` decimal(10,2) NOT NULL COMMENT 'Price for the tradeline',
  `is_active` tinyint(1) DEFAULT 1 COMMENT 'Whether the tradeline is active/available',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `priority_tradelines_au`
--

INSERT INTO `priority_tradelines_au` (`id`, `spots`, `age`, `bank`, `credit_limit`, `statement`, `closing_date`, `price`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 45000.00, 'Monthly statement', '2025-08-15', 255.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 25000.00, 'Monthly statement', '2025-08-15', 210.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 30000.00, 'Monthly statement', '2025-08-15', 230.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(4, '6 spots available', 2022, 'CITI', 4500.00, 'Monthly statement', '2025-08-15', 145.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(5, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 21800.00, 'Monthly statement', '2025-08-15', 200.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(6, '2 spots available', 2022, 'WELL FARGO', 20000.00, 'Monthly statement', '2025-08-15', 215.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(7, '3 spots available', 2022, 'CAPITAL ONE', 2600.00, 'Monthly statement', '2025-08-15', 145.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(8, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 35000.00, 'Monthly statement', '2025-08-15', 225.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(9, '3 spots available', 2021, 'CITI', 4000.00, 'Monthly statement', '2025-08-15', 145.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(10, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 15000.00, 'Monthly statement', '2025-08-15', 160.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(11, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 3000.00, 'Monthly statement', '2025-08-15', 110.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(12, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 29000.00, 'Monthly statement', '2025-08-15', 220.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(13, '2 spots available', 2022, 'WELLS FARGO', 20000.00, 'Monthly statement', '2025-08-15', 215.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(14, '3 spots available', 2023, 'BARCLAYS', 13800.00, 'Monthly statement', '2025-08-15', 185.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(15, '5 spots available', 2024, 'BARCLAYS', 7500.00, 'Monthly statement', '2025-08-15', 140.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(16, '1 spots available', 2013, 'CITI', 25000.00, 'Monthly statement', '2025-08-15', 295.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(17, '6 spots available', 2024, 'BARCLAYS', 11200.00, 'Monthly statement', '2025-08-15', 155.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(18, '1 spots available', 2019, 'CITI', 21700.00, 'Monthly statement', '2025-08-15', 250.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(19, '1 spots available', 2022, 'BARCLAYS', 6200.00, 'Monthly statement', '2025-08-15', 145.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(20, '11 spots available', 2019, 'WELLS FARGO', 20000.00, 'Monthly statement', '2025-08-15', 250.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(21, '14 spots available', 2019, 'WELLS FARGO', 4400.00, 'Monthly statement', '2025-08-15', 150.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(22, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 35000.00, 'Monthly statement', '2025-08-15', 230.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(23, '4 spots available', 2021, 'WELLS FARGO', 25000.00, 'Monthly statement', '2025-08-15', 215.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(24, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 20000.00, 'Monthly statement', '2025-08-15', 200.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(25, '1 spots available', 2011, 'CITI', 5000.00, 'Monthly statement', '2025-08-15', 255.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(26, '1 spots available', 2011, 'BARCLAYS', 5800.00, 'Monthly statement', '2025-08-15', 255.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(27, '9 spots available', 2021, 'WELLS FARGO', 18000.00, 'Monthly statement', '2025-08-15', 235.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(28, '4 spots available', 2024, 'GOLDMAN', 12000.00, 'Monthly statement', '2025-08-15', 175.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(29, '1 spots available', 2024, 'CHASE', 11500.00, 'Monthly statement', '2025-08-15', 160.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(30, '7 spots available', 2019, 'CAPITAL ONE', 5500.00, 'Monthly statement', '2025-08-15', 155.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(31, '1 spots available', 2014, 'CHASE', 36700.00, 'Monthly statement', '2025-08-15', 300.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(32, '1 spots available', 2019, 'CAPITAL ONE', 5500.00, 'Monthly statement', '2025-08-15', 160.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(33, '1 spots available', 2015, 'CITI', 5000.00, 'Monthly statement', '2025-08-15', 225.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(34, '3 spots available', 2020, '6 mon. DISCOVER', 10000.00, 'Monthly statement', '2025-08-15', 160.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(35, '9 spots available', 2020, 'WELLS FARGO', 9000.00, 'Monthly statement', '2025-08-15', 180.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(36, '1 spots available', 2022, 'CITI', 5000.00, 'Monthly statement', '2025-08-15', 140.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(37, '1 spots available', 2019, 'WELLS FARGO', 9000.00, 'Monthly statement', '2025-08-15', 165.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(38, '3 spots available', 2015, 'CITI', 2200.00, 'Monthly statement', '2025-08-15', 215.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(39, '10 spots available', 2021, 'CITI', 6200.00, 'Monthly statement', '2025-08-15', 155.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(40, '10 spots available', 2024, 'CAPITAL ONE', 10000.00, 'Monthly statement', '2025-08-15', 160.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(41, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 58000.00, 'Monthly statement', '2025-08-15', 260.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(42, '4 spots available', 2023, 'WELLS FARGO', 16000.00, 'Monthly statement', '2025-08-15', 175.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(43, '1 spots available', 2021, 'TD', 6000.00, 'Monthly statement', '2025-08-15', 150.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(44, '6 spots available', 2024, 'BARCLAYS', 12000.00, 'Monthly statement', '2025-08-15', 175.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(45, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 5000.00, 'Monthly statement', '2025-08-15', 120.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(46, '5 spots available', 2021, 'CAPITAL ONE', 7300.00, 'Monthly statement', '2025-08-15', 155.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(47, '3 spots available', 2017, 'CHASE', 5000.00, 'Monthly statement', '2025-08-15', 185.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(48, '1 spots available', 2024, 'CAPITAL ONE', 20000.00, 'Monthly statement', '2025-08-15', 215.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(49, 'MANY spots available', 2021, 'CITI', 20000.00, 'Monthly statement', '2025-08-15', 235.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(50, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 15000.00, 'Monthly statement', '2025-08-15', 170.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(51, '1 spots available', 2019, 'CITI', 12200.00, 'Monthly statement', '2025-08-15', 180.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(52, '10 spots available', 2020, '6 MO. CAP ONE', 3000.00, 'Monthly statement', '2025-08-15', 100.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(53, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 56000.00, 'Monthly statement', '2025-08-15', 265.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(54, '2 spots available', 2022, 'CHASE', 35800.00, 'Monthly statement', '2025-08-15', 265.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(55, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 17000.00, 'Monthly statement', '2025-08-15', 175.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(56, '5 spots available', 2004, 'CITI', 21000.00, 'Monthly statement', '2025-08-15', 365.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(57, '7 spots available', 2024, 'BARCLAYS', 22000.00, 'Monthly statement', '2025-08-15', 200.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(58, '5 spots available', 2015, 'CITI', 9900.00, 'Monthly statement', '2025-08-15', 240.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(59, 'MANY spots available', 2019, 'CHASE', 45000.00, 'Monthly statement', '2025-08-15', 285.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(60, '1 spots available', 2024, 'CITI', 6200.00, 'Monthly statement', '2025-08-15', 135.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(61, '1 spots available', 2022, 'CAPITAL ONE', 20000.00, 'Monthly statement', '2025-08-15', 225.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(62, '1 spots available', 2018, 'CAPITAL ONE', 3000.00, 'Monthly statement', '2025-08-15', 150.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(63, '1 spots available', 2013, 'CITI', 17000.00, 'Monthly statement', '2025-08-15', 265.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(64, '3 spots available', 2022, 'CITI', 12300.00, 'Monthly statement', '2025-08-15', 165.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(65, '11 spots available', 2024, 'CHASE', 22000.00, 'Monthly statement', '2025-08-15', 210.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(66, '1 spots available', 2016, 'DISCOVER', 3800.00, 'Monthly statement', '2025-08-15', 230.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(67, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 10000.00, 'Monthly statement', '2025-08-15', 155.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(68, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 35000.00, 'Monthly statement', '2025-08-15', 225.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(69, '1 spots available', 2017, 'CITI', 20000.00, 'Monthly statement', '2025-08-15', 245.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(70, '5 spots available', 2024, 'BARCLAYS', 20000.00, 'Monthly statement', '2025-08-15', 200.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(71, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 11500.00, 'Monthly statement', '2025-08-15', 160.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(72, '1 spots available', 2022, 'WELLS FARGO', 20000.00, 'Monthly statement', '2025-08-15', 215.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(73, '4 spots available', 2023, 'CAPITAL ONE', 11000.00, 'Monthly statement', '2025-08-15', 180.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(74, '5 spots available', 2022, 'CAPITAL ONE', 3300.00, 'Monthly statement', '2025-08-15', 150.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(75, '1 spots available', 2013, 'WELLS FARGO', 7500.00, 'Monthly statement', '2025-08-15', 215.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(76, '1 spots available', 2024, '2024 US BANK $500', 0.00, 'Monthly statement', '2025-08-15', 95.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(77, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 8000.00, 'Monthly statement', '2025-08-15', 140.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(78, '8 spots available', 2022, '2022 BARCLAYS $500', 0.00, 'Monthly statement', '2025-08-15', 105.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(79, '5 spots available', 2021, 'CAPITAL ONE', 11000.00, 'Monthly statement', '2025-08-15', 185.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(80, '1 spots available', 2020, 'CITI', 3500.00, 'Monthly statement', '2025-08-15', 140.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(81, '6 spots available', 2021, 'CITI', 2500.00, 'Monthly statement', '2025-08-15', 140.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(82, '3 spots available', 2022, 'BARCLAYS', 16000.00, 'Monthly statement', '2025-08-15', 195.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(83, '1 spots available', 2021, 'WELLS FARGO', 5000.00, 'Monthly statement', '2025-08-15', 130.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(84, '8 spots available', 2024, 'WELLS FARGO', 12000.00, 'Monthly statement', '2025-08-15', 160.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(85, 'MANY spots available', 2008, 'CAPITAL ONE', 1500.00, 'Monthly statement', '2025-08-15', 240.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(86, '1 spots available', 2006, 'DISCOVER', 9900.00, 'Monthly statement', '2025-08-15', 300.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(87, '3 spots available', 2017, 'DISCOVER', 4800.00, 'Monthly statement', '2025-08-15', 230.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(88, '1 spots available', 2011, 'CITI', 17500.00, 'Monthly statement', '2025-08-15', 275.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(89, '10 spots available', 2022, 'WELLS FARGO', 5000.00, 'Monthly statement', '2025-08-15', 155.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(90, '10 spots available', 2024, 'CITI', 13000.00, 'Monthly statement', '2025-08-15', 185.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(91, '3 spots available', 2018, 'CITI', 4100.00, 'Monthly statement', '2025-08-15', 160.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(92, '1 spots available', 2021, 'CITI', 10000.00, 'Monthly statement', '2025-08-15', 160.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(93, '2 spots available', 2021, 'DISCOVER', 3000.00, 'Monthly statement', '2025-08-15', 130.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(94, '1 spots available', 2023, 'FNBO', 10000.00, 'Monthly statement', '2025-08-15', 150.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(95, '2 spots available', 2018, 'CITI', 6000.00, 'Monthly statement', '2025-08-15', 180.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(96, '2 spots available', 2024, 'TD', 8000.00, 'Monthly statement', '2025-08-15', 130.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(97, '10 spots available', 2024, 'CITI', 13000.00, 'Monthly statement', '2025-08-15', 175.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(98, '1 spots available', 2023, 'US BANK', 4700.00, 'Monthly statement', '2025-08-15', 140.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(99, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 68800.00, 'Monthly statement', '2025-08-15', 285.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(100, '9 spots available', 2022, 'BARCLAYS', 6700.00, 'Monthly statement', '2025-08-15', 145.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(101, '1 spots available', 2023, 'CAPITAL ONE', 3000.00, 'Monthly statement', '2025-08-15', 115.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(102, '1 spots available', 2019, 'USAA', 9500.00, 'Monthly statement', '2025-08-15', 185.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(103, '1 spots available', 2016, 'CAPITAL ONE', 4300.00, 'Monthly statement', '2025-08-15', 190.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(104, '9 spots available', 2018, 'CAPITAL ONE', 20000.00, 'Monthly statement', '2025-08-15', 250.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(105, '1 spots available', 2021, 'CITI', 8000.00, 'Monthly statement', '2025-08-15', 160.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(106, '2 spots available', 2022, 'CITI', 17500.00, 'Monthly statement', '2025-08-15', 195.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(107, '5 spots available', 2024, 'WELLS FARGO', 8000.00, 'Monthly statement', '2025-08-15', 140.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(108, '1 spots available', 2023, 'CITI', 5000.00, 'Monthly statement', '2025-08-15', 140.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(109, '1 spots available', 2023, '2023 BARCLAYS $750', 0.00, 'Monthly statement', '2025-08-15', 100.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(110, '1 spots available', 2017, 'FNBO', 11200.00, 'Monthly statement', '2025-08-15', 210.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(111, '1 spots available', 2017, 'CHASE', 7200.00, 'Monthly statement', '2025-08-15', 215.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(112, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 20000.00, 'Monthly statement', '2025-08-15', 200.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(113, '3 spots available', 2022, 'TD', 10000.00, 'Monthly statement', '2025-08-15', 170.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(114, '1 spots available', 2022, 'WELLS FARGO', 9200.00, 'Monthly statement', '2025-08-15', 150.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(115, '1 spots available', 2022, 'CAPITAL ONE', 10000.00, 'Monthly statement', '2025-08-15', 180.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(116, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 46000.00, 'Monthly statement', '2025-08-15', 250.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(117, '3 spots available', 2017, 'CITI', 5800.00, 'Monthly statement', '2025-08-15', 195.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(118, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 18000.00, 'Monthly statement', '2025-08-15', 195.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(119, '10 spots available', 2023, 'CITI', 12800.00, 'Monthly statement', '2025-08-15', 170.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(120, '1 spots available', 2024, 'CHASE', 22500.00, 'Monthly statement', '2025-08-15', 190.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(121, '3 spots available', 2016, 'TD', 1000.00, 'Monthly statement', '2025-08-15', 165.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(122, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 74000.00, 'Monthly statement', '2025-08-15', 295.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(123, '1 spots available', 2020, 'CITI', 6000.00, 'Monthly statement', '2025-08-15', 150.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(124, '1 spots available', 2018, 'CITI', 15000.00, 'Monthly statement', '2025-08-15', 240.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(125, '1 spots available', 2020, 'TRUIST', 10500.00, 'Monthly statement', '2025-08-15', 185.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(126, '1 spots available', 2005, 'CITI', 36000.00, 'Monthly statement', '2025-08-15', 385.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(127, '8 spots available', 2024, 'CAPITAL ONE', 1000.00, 'Monthly statement', '2025-08-15', 125.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(128, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 1000.00, 'Monthly statement', '2025-08-15', 90.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(129, '1 spots available', 2019, 'CAPITAL ONE', 3000.00, 'Monthly statement', '2025-08-15', 155.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(130, '1 spots available', 2021, 'CAPITAL ONE', 4400.00, 'Monthly statement', '2025-08-15', 145.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(131, '10 spots available', 2014, 'WELLS FARGO', 17100.00, 'Monthly statement', '2025-08-15', 265.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(132, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 33000.00, 'Monthly statement', '2025-08-15', 225.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(133, '1 spots available', 2017, 'CAPITAL ONE', 20000.00, 'Monthly statement', '2025-08-15', 260.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(134, '2 spots available', 2019, 'DISCOVER', 4000.00, 'Monthly statement', '2025-08-15', 160.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(135, '11 spots available', 2021, 'CHASE', 27000.00, 'Monthly statement', '2025-08-15', 260.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(136, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 25000.00, 'Monthly statement', '2025-08-15', 215.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(137, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 8000.00, 'Monthly statement', '2025-08-15', 140.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(138, '15 spots available', 2024, 'WELLS FARGO', 12000.00, 'Monthly statement', '2025-08-15', 180.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(139, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 28000.00, 'Monthly statement', '2025-08-15', 210.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(140, '3 spots available', 2021, 'CITI', 4000.00, 'Monthly statement', '2025-08-15', 180.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(141, '10 spots available', 2021, 'WELLS FARGO', 6000.00, 'Monthly statement', '2025-08-15', 175.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(142, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 2000.00, 'Monthly statement', '2025-08-15', 100.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(143, '7 spots available', 2023, 'WELLS FARGO', 11500.00, 'Monthly statement', '2025-08-15', 175.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(144, '3 spots available', 2023, 'TD', 22000.00, 'Monthly statement', '2025-08-15', 225.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(145, '1 spots available', 2019, 'WELLS FARGO', 11000.00, 'Monthly statement', '2025-08-15', 220.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(146, '1 spots available', 2014, '2014 USAA $800', 0.00, 'Monthly statement', '2025-08-15', 165.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(147, '1 spots available', 2018, 'CITI', 5000.00, 'Monthly statement', '2025-08-15', 185.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(148, '2 spots available', 2019, 'Citi', 33500.00, 'Monthly statement', '2025-08-15', 260.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(149, '1 spots available', 2019, 'WELLS FARGO', 12500.00, 'Monthly statement', '2025-08-15', 225.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(150, '1 spots available', 2021, 'CITI', 6400.00, 'Monthly statement', '2025-08-15', 150.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(151, '2 spots available', 2019, 'CITI', 25000.00, 'Monthly statement', '2025-08-15', 250.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(152, '8 spots available', 2021, 'CAPITAL ONE', 4400.00, 'Monthly statement', '2025-08-15', 145.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(153, '1 spots available', 2022, 'WELLS FARGO', 30000.00, 'Monthly statement', '2025-08-15', 235.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(154, '3 spots available', 2020, '6 MO. CAP ONE', 3000.00, 'Monthly statement', '2025-08-15', 100.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(155, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 10000.00, 'Monthly statement', '2025-08-15', 150.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(156, '4 spots available', 2021, 'CITI', 3000.00, 'Monthly statement', '2025-08-15', 125.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(157, '1 spots available', 2015, 'CITI', 3000.00, 'Monthly statement', '2025-08-15', 200.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(158, '1 spots available', 2019, 'CITI', 1500.00, 'Monthly statement', '2025-08-15', 125.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(159, '3 spots available', 2023, 'TD', 2000.00, 'Monthly statement', '2025-08-15', 120.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(160, '6 spots available', 2023, 'CITI', 4000.00, 'Monthly statement', '2025-08-15', 125.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(161, '7 spots available', 2021, 'CHASE', 22800.00, 'Monthly statement', '2025-08-15', 220.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(162, '1 spots available', 2018, 'CITI', 3600.00, 'Monthly statement', '2025-08-15', 145.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(163, '1 spots available', 2023, 'DISCOVER', 3000.00, 'Monthly statement', '2025-08-15', 125.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(164, '1 spots available', 2020, 'BARCLAYS', 16500.00, 'Monthly statement', '2025-08-15', 195.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(165, '1 spots available', 2016, 'CITI', 4000.00, 'Monthly statement', '2025-08-15', 160.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(166, '3 spots available', 2017, 'CHASE', 8000.00, 'Monthly statement', '2025-08-15', 200.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(167, '10 spots available', 2023, 'WELLS FARGO', 11500.00, 'Monthly statement', '2025-08-15', 180.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(168, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 9400.00, 'Monthly statement', '2025-08-15', 145.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(169, '4 spots available', 2023, 'CITI', 2000.00, 'Monthly statement', '2025-08-15', 120.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(170, '3 spots available', 2020, 'WELLS FARGO', 4800.00, 'Monthly statement', '2025-08-15', 140.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(171, '1 spots available', 2020, 'CAPITAL ONE', 5000.00, 'Monthly statement', '2025-08-15', 160.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(172, '4 spots available', 2022, 'TD', 5000.00, 'Monthly statement', '2025-08-15', 145.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(173, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 3700.00, 'Monthly statement', '2025-08-15', 115.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(174, '1 spots available', 2014, 'REGIONS', 8000.00, 'Monthly statement', '2025-08-15', 240.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(175, '1 spots available', 2020, '1994 CITI', 16700.00, 'Monthly statement', '2025-08-15', 385.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(176, '1 spots available', 2011, 'CAPITAL ONE', 10700.00, 'Monthly statement', '2025-08-15', 265.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(177, '5 spots available', 2023, 'WELLS FARGO', 18000.00, 'Monthly statement', '2025-08-15', 180.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(178, '1 spots available', 2015, 'CITI', 28000.00, 'Monthly statement', '2025-08-15', 275.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(179, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 25000.00, 'Monthly statement', '2025-08-15', 215.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(180, '1 spots available', 2022, 'WELLS FARGO', 15500.00, 'Monthly statement', '2025-08-15', 185.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(181, '3 spots available', 2021, 'BARCLAYS', 9000.00, 'Monthly statement', '2025-08-15', 225.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(182, '6 spots available', 2023, 'CHASE', 23000.00, 'Monthly statement', '2025-08-15', 215.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(183, '3 spots available', 2021, 'WELLS FARGO', 4000.00, 'Monthly statement', '2025-08-15', 135.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(184, '1 spots available', 2019, 'CITI', 13000.00, 'Monthly statement', '2025-08-15', 200.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(185, '4 spots available', 2021, 'CITI', 1000.00, 'Monthly statement', '2025-08-15', 110.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(186, '8 spots available', 2020, 'CITI', 3000.00, 'Monthly statement', '2025-08-15', 140.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(187, '2 spots available', 2020, 'WELLS FARGO', 11900.00, 'Monthly statement', '2025-08-15', 165.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(188, '8 spots available', 2020, 'AMERICAN EXPRESS', 60000.00, 'Monthly statement', '2025-08-15', 270.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(189, '4 spots available', 2022, 'WELLS FARGO', 10000.00, 'Monthly statement', '2025-08-15', 165.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(190, 'MANY spots available', 2018, 'CITI', 35000.00, 'Monthly statement', '2025-08-15', 285.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(191, '10 spots available', 2020, '6MO CITI', 11600.00, 'Monthly statement', '2025-08-15', 155.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(192, '5 spots available', 2019, '2019 CITI $200', 0.00, 'Monthly statement', '2025-08-15', 110.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(193, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 30000.00, 'Monthly statement', '2025-08-15', 230.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(194, '5 spots available', 2024, 'WELLS FARGO', 10000.00, 'Monthly statement', '2025-08-15', 150.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(195, '2 spots available', 2021, 'WELLS FARGO', 22000.00, 'Monthly statement', '2025-08-15', 225.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(196, '7 spots available', 2021, 'WELLS FARGO', 1000.00, 'Monthly statement', '2025-08-15', 100.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(197, '1 spots available', 2013, 'CITI', 4000.00, 'Monthly statement', '2025-08-15', 200.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(198, '1 spots available', 2016, '2016 CITI $350', 0.00, 'Monthly statement', '2025-08-15', 110.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(199, '2 spots available', 2022, '2022 US BANK $500', 0.00, 'Monthly statement', '2025-08-15', 115.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(200, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 15600.00, 'Monthly statement', '2025-08-15', 170.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(201, '3 spots available', 2023, 'US BANK', 15000.00, 'Monthly statement', '2025-08-15', 160.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(202, '1 spots available', 2018, 'WELLS FARGO', 25000.00, 'Monthly statement', '2025-08-15', 250.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(203, '2 spots available', 2017, 'BARCLAYS', 2500.00, 'Monthly statement', '2025-08-15', 160.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(204, '1 spots available', 2019, 'PNC', 17500.00, 'Monthly statement', '2025-08-15', 220.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(205, '1 spots available', 2023, 'CITI', 10000.00, 'Monthly statement', '2025-08-15', 150.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(206, '1 spots available', 2023, 'WELLS FARGO', 2500.00, 'Monthly statement', '2025-08-15', 100.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(207, '1 spots available', 2021, 'WELLS FARGO', 1300.00, 'Monthly statement', '2025-08-15', 105.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(208, '4 spots available', 2023, 'FIRST SERIVCE CU', 9000.00, 'Monthly statement', '2025-08-15', 180.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(209, '1 spots available', 2019, 'WELLS FARGO', 5000.00, 'Monthly statement', '2025-08-15', 150.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(210, '3 spots available', 2022, 'TD', 6000.00, 'Monthly statement', '2025-08-15', 150.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(211, '9 spots available', 2022, 'CHASE', 4600.00, 'Monthly statement', '2025-08-15', 140.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(212, '12 spots available', 2022, 'WELLS FARGO', 14000.00, 'Monthly statement', '2025-08-15', 180.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(213, '6 spots available', 2023, 'WELLS FARGO', 10000.00, 'Monthly statement', '2025-08-15', 145.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(214, '6 spots available', 2021, 'CITI', 8300.00, 'Monthly statement', '2025-08-15', 165.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(215, '2 spots available', 2018, 'CITI', 15000.00, 'Monthly statement', '2025-08-15', 250.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(216, '10 spots available', 2023, 'WELLS FARGO', 1000.00, 'Monthly statement', '2025-08-15', 100.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(217, '10 spots available', 2021, 'WELLS FARGO', 1000.00, 'Monthly statement', '2025-08-15', 110.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(218, '9 spots available', 2023, 'WELLS FARGO', 4000.00, 'Monthly statement', '2025-08-15', 120.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(219, '10 spots available', 2020, 'WELLS FARGO', 4800.00, 'Monthly statement', '2025-08-15', 150.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(220, '1 spots available', 2019, 'CITI', 27000.00, 'Monthly statement', '2025-08-15', 265.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(221, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 15000.00, 'Monthly statement', '2025-08-15', 180.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(222, '4 spots available', 2022, 'US BANK', 4000.00, 'Monthly statement', '2025-08-15', 140.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(223, '1 spots available', 2020, 'WELLS FARGO', 10000.00, 'Monthly statement', '2025-08-15', 170.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(224, '1 spots available', 2024, 'TD', 6000.00, 'Monthly statement', '2025-08-15', 120.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(225, '10 spots available', 2021, 'WELLS FARGO', 5000.00, 'Monthly statement', '2025-08-15', 145.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(226, '1 spots available', 2009, 'CITI', 22000.00, 'Monthly statement', '2025-08-15', 350.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(227, '5 spots available', 2000, 'CITI', 2000.00, 'Monthly statement', '2025-08-15', 285.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(228, '8 spots available', 2022, 'WELLS FARGO', 4000.00, 'Monthly statement', '2025-08-15', 215.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(229, '1 spots available', 2022, 'WELLS FARGO', 29000.00, 'Monthly statement', '2025-08-15', 245.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(230, '2 spots available', 2019, 'WELLS FARGO', 2700.00, 'Monthly statement', '2025-08-15', 120.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(231, '1 spots available', 2019, 'WELLS FARGO', 8000.00, 'Monthly statement', '2025-08-15', 175.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(232, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 31000.00, 'Monthly statement', '2025-08-15', 225.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(233, '4 spots available', 2022, 'WELLS FARGO', 11000.00, 'Monthly statement', '2025-08-15', 170.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(234, '1 spots available', 2021, 'BARCLAYS', 5900.00, 'Monthly statement', '2025-08-15', 160.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(235, '1 spots available', 2021, 'CHASE', 6000.00, 'Monthly statement', '2025-08-15', 165.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(236, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 20000.00, 'Monthly statement', '2025-08-15', 200.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(237, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 29000.00, 'Monthly statement', '2025-08-15', 220.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(238, '1 spots available', 2014, 'CITI', 9600.00, 'Monthly statement', '2025-08-15', 255.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(239, '3 spots available', 2003, 'CITI', 7800.00, 'Monthly statement', '2025-08-15', 300.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(240, '6 spots available', 2022, 'WELLS FARGO', 1000.00, 'Monthly statement', '2025-08-15', 120.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(241, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 34000.00, 'Monthly statement', '2025-08-15', 230.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(242, '3 spots available', 2022, 'WELLS FARGO', 6500.00, 'Monthly statement', '2025-08-15', 150.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(243, '1 spots available', 2020, '6MO BANK OF AMERICA', 10000.00, 'Monthly statement', '2025-08-15', 190.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(244, '1 spots available', 2023, 'WELLS FARGO', 46000.00, 'Monthly statement', '2025-08-15', 255.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(245, '1 spots available', 2023, 'CHASE', 17200.00, 'Monthly statement', '2025-08-15', 200.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(246, '1 spots available', 2023, 'WELLS FARGO', 17000.00, 'Monthly statement', '2025-08-15', 180.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(247, '1 spots available', 2022, 'CHASE', 10000.00, 'Monthly statement', '2025-08-15', 180.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(248, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 5000.00, 'Monthly statement', '2025-08-15', 120.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(249, '1 spots available', 2023, 'CAPITAL ONE', 10000.00, 'Monthly statement', '2025-08-15', 160.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(250, '1 spots available', 2012, 'CITI', 12000.00, 'Monthly statement', '2025-08-15', 265.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(251, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 10000.00, 'Monthly statement', '2025-08-15', 150.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(252, '1 spots available', 2006, 'DISCOVER', 21000.00, 'Monthly statement', '2025-08-15', 385.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(253, '7 spots available', 2021, 'WELLS FARGO', 10000.00, 'Monthly statement', '2025-08-15', 175.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(254, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 1000.00, 'Monthly statement', '2025-08-15', 90.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(255, '1 spots available', 2022, 'CHASE', 14500.00, 'Monthly statement', '2025-08-15', 180.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(256, '1 spots available', 2024, 'BARCLAYS', 50000.00, 'Monthly statement', '2025-08-15', 265.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(257, '4 spots available', 2021, 'WELLS FARGO', 9500.00, 'Monthly statement', '2025-08-15', 170.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(258, '2 spots available', 2019, '2019 CAPITAL ONE $500', 0.00, 'Monthly statement', '2025-08-15', 95.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(259, '1 spots available', 2021, 'DISCOVER', 6500.00, 'Monthly statement', '2025-08-15', 165.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(260, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 20000.00, 'Monthly statement', '2025-08-15', 200.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(261, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 14000.00, 'Monthly statement', '2025-08-15', 155.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(262, '1 spots available', 2022, 'CITI', 17600.00, 'Monthly statement', '2025-08-15', 200.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(263, '2 spots available', 2022, 'CITI', 7300.00, 'Monthly statement', '2025-08-15', 150.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(264, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 30000.00, 'Monthly statement', '2025-08-15', 230.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(265, '2 spots available', 2022, 'CITI', 5500.00, 'Monthly statement', '2025-08-15', 135.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(266, '2 spots available', 2005, 'BARCLAYS', 7500.00, 'Monthly statement', '2025-08-15', 285.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(267, '1 spots available', 2021, 'BARCLAYS', 10800.00, 'Monthly statement', '2025-08-15', 185.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(268, '7 spots available', 2022, 'WELLS FARGO', 11000.00, 'Monthly statement', '2025-08-15', 175.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(269, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 30000.00, 'Monthly statement', '2025-08-15', 230.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(270, '8 spots available', 2022, 'WELLS FARGO', 2000.00, 'Monthly statement', '2025-08-15', 110.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(271, '2 spots available', 2022, 'CITI', 4700.00, 'Monthly statement', '2025-08-15', 145.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(272, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 5100.00, 'Monthly statement', '2025-08-15', 115.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(273, '5 spots available', 2019, '2019 WELLS FARGO $300', 0.00, 'Monthly statement', '2025-08-15', 115.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(274, 'MANY spots available', 2020, 'AMERICAN EXPRESS', 2000.00, 'Monthly statement', '2025-08-15', 100.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(275, '4 spots available', 2022, 'WELLS FARGO', 2300.00, 'Monthly statement', '2025-08-15', 100.00, 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `duration_minutes` int(11) DEFAULT 60,
  `service_type` enum('consultation','tax_preparation','financial_planning','business_advisory') NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `link` varchar(1000) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `featured` tinyint(1) DEFAULT 0,
  `requirements` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `description`, `short_description`, `price`, `duration_minutes`, `service_type`, `image_url`, `link`, `is_active`, `featured`, `requirements`, `created_at`, `updated_at`) VALUES
(6, 'Business Restructure', 'Our Business Restructure service is designed to position your company for real funding success. Whether you\'re starting fresh or correcting past setup issues, we’ll guide you step-by-step to ensure your business is structured the right way — legally, professionally, and strategically.\n\nWe audit your current structure, fix critical compliance gaps, and align your business with lender expectations. From correcting LLC filings to building a professional brand presence, we help you unlock funding potential and set the foundation for sustainable growth.', 'Take Your Business to the BANK', 349.00, 60, 'financial_planning', 'http://localhost:5000/uploads/images/services/image-1754392853300-106035391.png', 'https://link.fastpaydirect.com/payment-link/687baf70ddc6a62699c5612d', 1, 0, 'To get started, we’ll need your current business details, including LLC registration, EIN (if available), and your contact info (address, phone, email). We’ll also ask for a brief overview of your business and any existing bank or merchant accounts, so we can ensure everything is set up for funding success.', '2025-08-05 11:18:46', '2025-08-05 11:20:53'),
(7, 'New Business Start-up (INC, LLC, Partnership)', 'Starting a business is exciting—but the paperwork and legal setup can be overwhelming. Our New Business Start-up service simplifies the entire process by professionally handling your LLC, INC, or Partnership formation from start to finish. We take care of the legal filings, register your EIN (Tax ID), and set up a custom business email to give your brand a professional edge. With expert guidance and a quick turnaround, you can launch with confidence, knowing your business is fully compliant and ready to grow.', 'Start your business with ease, accuracy, and full confidence.', 350.00, 60, 'business_advisory', 'http://localhost:5000/uploads/images/services/image-1754393213685-873776077.png', 'https://link.fastpaydirect.com/payment-link/687baf70ddc6a62699c5612d', 1, 0, 'To begin, we’ll need your business name, preferred structure (LLC, INC, or Partnership), business address, and your contact info. If available, providing your state of formation and industry type helps speed up the process.', '2025-08-05 11:24:39', '2025-08-05 11:26:54'),
(8, 'Home Ownership Mentorship Package', 'Our Home Ownership Mentorship Package is designed to help you break through the barriers to homeownership. We provide full credit repair services to improve your loan eligibility, build a personalized savings plan, and offer weekly 1-on-1 check-ins with certified mentors to keep you on track. You\'ll receive step-by-step guidance on mortgage pre-approval, down payment assistance programs, and access to a network of trusted lenders and real estate professionals. Whether you\'re starting from scratch or rebuilding, we’re here to help you move confidently toward owning your first home.', 'Your personalized path from renter to homeowner in just 6–12 months', 349.00, 60, 'consultation', 'http://localhost:5000/uploads/images/services/image-1754393724724-501132059.png', 'https://link.fastpaydirect.com/payment-link/687baf70ddc6a62699c5612d', 1, 0, 'To begin, you’ll need a consistent income source, valid identification, and a commitment to attend weekly mentorship sessions. No high credit score is necessary, but a willingness to follow financial advice and engage in the credit-building process is essential. You’ll also need access to a mobile device or computer with internet connectivity for virtual support.', '2025-08-05 11:34:52', '2025-08-05 11:35:24'),
(9, 'New Authority DOT or MC Start-up', 'Our New Authority DOT or MC Start-up service is crafted for aspiring transportation business owners ready to hit the road legally and confidently. From DOT and MC number registration to BOC-3 filing and UCR setup, we handle the paperwork so you can focus on getting your trucks moving. We also provide business formation support (LLC, EIN, Operating Agreement), templates for lease and hiring, and access to affordable surety bond and insurance quotes.\n\nNeed more support? Add-on options like weekly dispatching training and fuel card referrals are available to accelerate your success. With our expert guidance, we simplify FMCSA compliance and help you avoid delays, ensuring your transportation business launches smoothly.', 'Start your trucking or transportation business the right way with our all-in-one DOT & MC authority setup — including forms, filings, and expert guidance.', 795.00, 60, 'business_advisory', '/uploads/images/services/image-1754394011520-662912007.png', NULL, 1, 0, NULL, '2025-08-05 11:40:11', '2025-08-05 11:40:11'),
(10, 'Used Car Dealership Start-up Service', 'Starting a used car dealership can be a rewarding venture, but the process to become licensed and compliant in Georgia can be overwhelming. Our Used Car Dealership Start-up Service offers a full-service solution tailored to new dealers. We guide you step-by-step through dealer license applications, LLC formation, EIN registration, securing a qualifying business location, and obtaining your resale certificate and surety bond.\n\nFrom helping you submit paperwork correctly to providing referrals for insurance and auction access, we ensure you\'re set up for success. We also include a BONUS credit repair package to help you qualify for startup funding. Whether you’re building a small lot or a growing dealership, we simplify the complex regulations so you can focus on selling cars and growing your business.', 'Launch your Georgia used car dealership with confidence. We handle licensing, location setup, business formation.', 850.00, 60, 'financial_planning', '/uploads/images/services/image-1754560509889-813308553.png', 'https://link.fastpaydirect.com/payment-link/6879a2aad6ab809de9e6ac23', 1, 0, 'To begin the process of launching your used car dealership, you’ll need to have a valid government-issued ID, a chosen business name, and access to a commercial location that meets your state’s zoning and compliance guidelines. You should also be prepared to cover the costs of licensing, insurance, and bonding, and have a basic business plan in place. Internet access and a device for completing paperwork and consultations are essential. While we’ll guide you every step of the way, your active participation and timely submission of required documents will ensure a smooth and successful setup.', '2025-08-07 09:55:10', '2025-08-07 09:55:10'),
(11, 'Sales Tax Account Set-up', 'Navigating sales tax regulations can be confusing, especially for new business owners. Our Sales Tax Account Set-up service simplifies the process by helping you register with the appropriate state tax authority to legally collect and remit sales tax. Whether you\'re starting a product-based business or offering taxable services, we ensure your sales tax registration is accurate and compliant with your state’s requirements.', 'Easily register for your sales tax account to stay compliant and start collecting and remitting sales tax legally and confidently.', 50.00, 60, 'business_advisory', '/uploads/images/services/image-1754560747042-315172382.jpeg', 'https://link.fastpaydirect.com/payment-link/6879a2aad6ab809de9e6ac23', 1, 0, NULL, '2025-08-07 09:59:07', '2025-08-07 09:59:07'),
(12, 'Become a Personal Credit Guru- Course only', 'Take control of your financial future and help others do the same with our \"Become a Personal Credit Guru\" course. This comprehensive training program is designed for aspiring entrepreneurs and professionals who want to learn the ins and outs of credit repair. Whether you\'re looking to fix your own credit or launch a credit repair business, this course equips you with everything you need.\n\nYou\'ll gain in-depth knowledge of how credit works, how to dispute inaccuracies, how to remove negative items legally, and how to build and maintain strong credit scores. The course also includes guidance on starting and operating your own credit repair company – from client onboarding to compliance and marketing.\n\nPerfect for beginners, side hustlers, or professionals expanding their service offerings, this course empowers you to become a trusted credit advisor in your community.', 'Master credit repair and launch your own business with our in-depth, self-paced course designed to make you a credit expert.', 497.00, 60, 'consultation', '/uploads/images/services/image-1754561208843-922256401.jpeg', 'https://link.fastpaydirect.com/payment-link/6879a2aad6ab809de9e6ac23', 1, 0, 'All you need is a willingness to learn and a computer or mobile device with internet access. No prior experience is required. Basic reading, writing, and digital literacy skills will help you get the most out of the course. A passion for personal finance or helping others improve their financial health is a plus. Once enrolled, you’ll gain access to all course modules, templates, and resources to study at your own pace.', '2025-08-07 10:06:48', '2025-08-07 10:06:48'),
(13, 'Credit Sweep', 'Transform your credit profile with our Personal Credit Sweep service — a powerful solution designed to help you remove inaccurate, outdated, or unverifiable information from your credit report. Whether you’re preparing to apply for a loan, buy a home, or just want a fresh start, our expert team is here to support your journey.\n\nWe begin with a full review of your credit reports from all three major bureaus (Experian, Equifax, and TransUnion). Then, we identify discrepancies and aggressively dispute items that do not meet federal reporting standards — including late payments, collections, charge-offs, and more. You’ll receive regular updates and personalized guidance on how to maintain and build your credit long after the sweep is complete.\n\nThis service is ideal for individuals who want a clean, accurate credit report to unlock better financial opportunities.', 'Quickly clean up your credit report by removing inaccurate or outdated items and take charge of your financial future.', 1500.00, 60, 'consultation', '/uploads/images/services/image-1754561630641-138377383.jpeg', 'https://link.fastpaydirect.com/payment-link/6879a2aad6ab809de9e6ac23', 1, 0, 'To begin your Credit Sweep, you must provide a recent copy of your credit report or allow access through a credit monitoring service. You must also sign limited authorization forms to permit our team to act on your behalf during the dispute process. A stable mailing address and active email are necessary for communication and receiving updates. While we handle disputes, your cooperation in following recommended credit-building practices will enhance results.', '2025-08-07 10:13:50', '2025-08-07 10:13:50'),
(14, 'Georgia Sales Tax Registration Set-up', 'If your business sells taxable goods or services in Georgia, securing a Georgia Sales and Use Tax Certificate is a legal requirement. Our Georgia Sales Tax Registration Set-Up service ensures that your business is properly registered with the Georgia Department of Revenue and fully compliant with state tax laws.\n\nWe’ll guide you through the entire process — from completing the application accurately to submitting the required documentation. You’ll receive support with filing key business information like your Federal Employer Identification Number (FEIN), business address, and determining your filing frequency. Once everything is submitted, we’ll confirm registration and provide you with your official Sales Tax Certificate so you can begin operations without delay or penalty.\n\nIdeal for new businesses, expanding operations, or any company selling taxable goods or services in Georgia, this service simplifies tax compliance and ensures you\'re ready to collect and remit sales tax with confidence.', 'Register your business to collect and remit sales tax in Georgia — fast, accurate, and fully compliant with state laws.', 200.00, 60, 'business_advisory', '/uploads/images/services/image-1754561798154-472625341.jpeg', 'https://link.fastpaydirect.com/payment-link/6879a2aad6ab809de9e6ac23', 1, 0, 'To complete your sales tax registration, you’ll need to provide your business’s legal name, trade name (if applicable), physical address, and Federal Employer Identification Number (FEIN). You’ll also need to submit details about the products or services you plan to sell, along with any relevant supporting documentation like your business license or articles of incorporation. Once all required information is received, registration is typically completed within 3–5 business days.', '2025-08-07 10:16:38', '2025-08-07 10:16:38'),
(15, 'Become a Business Credit Guru- Course only', 'Unlock the secrets of business credit with our Business Credit Guru Training Course. This specialized program is designed for aspiring credit professionals, entrepreneurs, and business owners who want to gain a deep understanding of how business credit works — and how to leverage it to build strong, fundable companies.\n\nOur course walks you through essential topics such as how to establish credit profiles, secure vendor accounts, optimize credit scores, and build relationships with lenders. Whether you\'re starting a credit repair business or simply want to boost your own company’s credit standing, this training equips you with the tools, templates, and strategies needed for long-term success in the industry.\n\nBy the end of the course, you\'ll not only understand the business credit ecosystem but also be ready to assist others or launch your own credit consulting business with confidence.', 'Master the world of business credit and learn how to build and repair credit for companies with our step-by-step training course.', 497.00, 60, 'business_advisory', '/uploads/images/services/image-1754561973267-16782448.jpeg', 'https://link.fastpaydirect.com/payment-link/6879a2aad6ab809de9e6ac23', 1, 0, 'This course is open to anyone interested in learning about business credit. No prior experience is required. However, having a basic understanding of personal finance, credit systems, or small business operations can enhance your learning. You’ll need access to a computer or mobile device with internet, as the course is delivered online. A willingness to take notes, complete practical assignments, and engage with the training materials will help you get the most out of the experience.', '2025-08-07 10:19:33', '2025-08-07 10:19:33'),
(16, 'Payroll Services- recurring', 'Managing payroll doesn\'t have to be stressful or time-consuming. Our Payroll Services – Recurring package is designed to simplify your payroll processing so you can focus on growing your business. We handle the calculations, tax filings, employee payments, and reporting with precision and consistency—week after week, month after month.\n\nWhether you\'re paying a few employees or running a larger team, our expert service ensures full compliance with federal and state payroll laws. We also offer add-on bookkeeping services to keep your financial records accurate, organized, and audit-ready. With secure systems and responsive support, your business’s payroll and accounting needs are in reliable hands.', 'Streamline your business finances with recurring payroll services and optional bookkeeping support.', 400.00, 60, 'consultation', '/uploads/images/services/image-1754562220266-266440060.jpeg', 'https://link.fastpaydirect.com/payment-link/6879a2aad6ab809de9e6ac23', 1, 0, NULL, '2025-08-07 10:23:40', '2025-08-07 10:23:40'),
(17, 'Georgia Wholesale License/ Tax Exempt Registration', 'If your business plans to buy products for resale or operate tax-exempt in the state of Georgia, securing the correct documentation is essential. Our Georgia Wholesale License / Tax Exempt Registration service is designed to simplify this process and ensure full compliance with state tax laws.\n\nWe’ll guide you through every step—whether you\'re applying for a Sales and Use Tax Certificate of Exemption or setting up your Georgia Wholesale License. This service includes verifying your eligibility, submitting accurate business information, and handling the required documents to help you avoid costly tax errors or delays.\n\nWhether you\'re a retailer, wholesaler, distributor, or startup business preparing to scale, this service ensures you’re set up to legally purchase goods tax-free for resale within Georgia.', 'Easily register for a Georgia Wholesale License or Sales Tax Exemption Certificate with our expert-guided setup service', 200.00, 60, 'consultation', '/uploads/images/services/image-1754562429854-909459073.jpeg', 'https://link.fastpaydirect.com/payment-link/6879a2aad6ab809de9e6ac23', 1, 0, 'To begin the registration process, you’ll need to provide your business’s legal name, physical address, Federal Employer Identification Number (FEIN), and ownership structure (LLC, Corporation, Sole Proprietor, etc.). You may also need to submit copies of supporting documents such as your business license or articles of incorporation. This information allows us to complete your registration accurately and submit it to the Georgia Department of Revenue for approval. Once approved, you’ll be authorized to make tax-exempt purchases or operate as a wholesale business in the state.', '2025-08-07 10:27:10', '2025-08-07 10:27:10'),
(18, 'Local Business License', 'Operating a business without a local license can lead to fines or forced closures. Our Local Business License Application Service helps you obtain the necessary documentation to run your business legally and without interruptions in your city or county.\n\nWe research your specific local requirements, guide you through any additional permits needed (like zoning or health permits), and ensure your application is filed accurately and promptly. Whether you\'re just launching or expanding to a new area, our team will take care of the licensing logistics so you can focus on growing your business.\n\nFrom startups and home-based businesses to retail shops and service providers, this service is perfect for entrepreneurs who want expert help navigating local laws and paperwork.', 'Ensure your business is legally compliant with your city or county’s regulations by letting us handle your Local Business License application from start to finish.', 400.00, 60, 'consultation', '/uploads/images/services/image-1754562605221-946724459.jpeg', 'https://link.fastpaydirect.com/payment-link/6879a2aad6ab809de9e6ac23', 1, 0, 'To process your local business license application, you’ll need to provide your legal business name, physical address, Federal Employer Identification Number (FEIN) or Social Security Number (if applicable), and ownership details including names and contact information of all owners. A brief description of your business’s goods or services is also required. In some cases, we may request supporting documents such as a lease agreement, zoning approval, or health department clearance depending on your city or county\'s regulations. Once submitted, processing typically takes 5–7 business days, though timing may vary by jurisdiction.', '2025-08-07 10:30:05', '2025-08-07 10:30:05'),
(19, 'New Company Set-Up & Business Credit Buildout', 'Starting a business is more than just registering an LLC—it’s about laying a foundation that sets you up for long-term financial success. Our New Company Set-Up & Business Credit Buildout service combines expert business formation with a structured plan to establish and grow your business credit profile.\n\nWe’ll handle every essential step of your company’s formation, including registering your LLC with the Secretary of State, obtaining your EIN, creating a custom operating agreement, and setting up professional contact channels like a business email, domain, and phone number.\n\nBeyond formation, we guide you in opening a business bank account, securing merchant services, and ensuring your company meets compliance standards with the correct NAICS code, DUNS number, and business classifications.\n\nOnce your foundation is set, we help you build strong business credit by establishing Net-30 accounts with Tier 1 vendors, assisting with Tier 2–3 tradelines that report to major bureaus, and providing credit monitoring tools and mentorship. Whether you\'re a startup, a new LLC owner, or an entrepreneur planning to scale, we provide the tools and structure lenders trust.', 'Launch your business with confidence and build strong business credit from day one with our all-in-one formation and credit buildout package.', 2500.00, 60, 'business_advisory', '/uploads/images/services/image-1754562918870-77008848.jpeg', 'https://link.fastpaydirect.com/payment-link/68799bdaeba110b3638db157', 1, 0, 'To begin, you’ll need to provide your preferred business name, owner(s) details, intended business address, and a description of your products or services. You’ll also need basic identification and supporting documents (like a driver’s license or passport) for EIN and LLC registration. For the credit buildout portion, we\'ll guide you in setting up a dedicated business phone number, email, and domain, and help you collect information for vendor accounts and compliance tools like DUNS and NAICS classification. This service is ideal for those starting from scratch or looking to rebuild their business identity properly.', '2025-08-07 10:35:18', '2025-08-07 10:35:18'),
(20, 'Business Credit Buildout', 'Our Business Credit Buildout service is designed to establish and strengthen your business credit profile, positioning your company for greater funding potential and long-term financial success. Through a structured 60-day process, we help you achieve a Paydex score of 80 or higher on Dun & Bradstreet, opening the door to better lending opportunities and vendor relationships.\n\nYou’ll receive comprehensive guidance from our experts on how to properly set up your credit profiles, ensure accurate data reporting to the major business credit bureaus, and build reliable trade lines. Our curated list of vetted vendors and credit providers gives you access to credit-building opportunities that actually report, helping you gain real traction in the business credit space.\n\nOnce your Paydex score reaches 80+, you’ll be better positioned to apply for business funding such as credit cards, lines of credit, and loans. Should you choose to pursue financing, we offer access to a network of trusted lenders—with separate options for continued support and capital acquisition.', 'Build a strong business credit profile with our step-by-step credit buildout service and achieve a Paydex score of 80+ on Dun & Bradstreet in just 60 days.', 1000.00, 60, 'business_advisory', '/uploads/images/services/image-1754563152052-95177051.jpeg', 'https://link.fastpaydirect.com/payment-link/68799e4fddc6a6f58ac558db', 1, 0, 'To begin, you’ll need to have a legally formed business entity (LLC, Corporation, etc.) with a valid EIN, business address, phone number, and domain-based email. You should also be prepared to open Net-30 vendor accounts and follow our credit-building strategy over a 60-day period. If your business is not yet fully structured, we can assist you with foundational setup prior to beginning the credit buildout process. This service is best suited for business owners who are ready to actively participate and follow a proven path toward establishing creditworthiness.', '2025-08-07 10:39:12', '2025-08-07 10:39:12'),
(21, 'Bookkeeping Service- recurring', 'Our Recurring Bookkeeping Service is designed to take the stress out of managing your business finances. We provide accurate, timely, and reliable bookkeeping so you can focus on growing your business instead of juggling spreadsheets and receipts. From daily transaction tracking to month-end reconciliations, we ensure your accounts stay organized and compliant.\n\nWe also offer full payroll support, making sure your employees are paid on time, taxes are handled correctly, and all filings are done accurately. Whether you’re a startup, small business, or established company, our bookkeeping solutions are tailored to your needs—so you always know where your business stands financially.', 'Keep your finances organized with our recurring bookkeeping service, ensuring accurate records, smooth payroll, and stress-free accounting.', 400.00, 60, 'consultation', '/uploads/images/services/image-1754644546317-942236633.jpeg', 'https://link.fastpaydirect.com/payment-link/68799d35ddc6a68c92c558d1', 1, 0, NULL, '2025-08-08 09:15:46', '2025-08-08 09:15:46'),
(22, 'Business Trademark', 'Your brand is one of your most valuable business assets—make sure it’s protected. Our Business Trademark Service helps you secure legal rights to your business name, logo, or creative work, giving you the peace of mind that comes with knowing your intellectual property is safeguarded against infringement.\n\nWe guide you through every step of the trademark process, from conducting a comprehensive search to ensure your mark is available, to filing with the USPTO (United States Patent and Trademark Office) or your relevant jurisdiction. We also provide copyright assistance to protect creative works such as designs, content, or product materials.\n\nWhether you’re launching a new brand or protecting an established one, our trademark and copyright services help you maintain exclusive rights to what you’ve worked hard to create.', 'Protect your brand name, logo, and creative assets with our professional trademark services, ensuring your intellectual property stays safe.', 500.00, 60, 'business_advisory', '/uploads/images/services/image-1754644793064-461531119.jpg', 'https://link.fastpaydirect.com/payment-link/68799d35ddc6a68c92c558d1', 1, 0, NULL, '2025-08-08 09:19:53', '2025-08-08 09:19:53'),
(23, 'Operating Agreement', 'An Operating Agreement is a critical legal document for any LLC, serving as the foundation for how your business is structured, managed, and protected. Whether you have a single-member or multi-member LLC, our Customized Operating Agreement Service ensures that all members’ rights and responsibilities are clearly defined—reducing the risk of disputes and confusion down the line.\n\nWith this service, you’ll receive a professionally drafted Operating Agreement tailored to your business needs. It will clearly define ownership percentages, member roles, and responsibilities, along with provisions for profit and loss distribution, decision-making, voting procedures, and your chosen management structure. It also includes important protections such as procedures for adding or removing members, succession planning, and dissolution terms—all compliant with Georgia state regulations.\n\nThis service is ideal for new LLCs looking to establish a strong operational foundation, existing LLCs that need to update their documents, and entrepreneurs seeking to protect their interests and avoid future disputes. Our Operating Agreements are designed to be comprehensive, legally sound, and easy to understand, giving you peace of mind and a solid legal framework for your business.', 'Protect your LLC with a professionally customized Operating Agreement that clearly defines ownership, roles, and decision-making processes.', 150.00, 60, 'consultation', '/uploads/images/services/image-1754646078589-102405860.png', 'https://link.fastpaydirect.com/payment-link/687bafdeddc6a6192dc5612f', 1, 0, 'To prepare your customized Operating Agreement, we’ll need your LLC name and address, the names and ownership percentages of all members, your preferred management structure (member-managed or manager-managed), and any special terms or provisions you want included. Once we receive this information, we can begin drafting your agreement immediately.', '2025-08-08 09:41:18', '2025-08-08 09:41:18'),
(24, 'Business Credit Blueprint', 'Our Business Credit Blueprint service is designed to help you establish and grow your business credit the right way, giving you the tools and strategies to secure better financing and vendor relationships. Whether you’re just starting out or looking to strengthen your existing profile, this blueprint provides a clear, step-by-step process to reach a Paydex score of 80 or higher on Dun & Bradstreet within 60 days.\n\nWith this service, you’ll receive personalized guidance on setting up and optimizing your business credit profile, ensuring your information is reported accurately to all major credit bureaus. You’ll also gain full access to our vetted list of vendors and credit providers, helping you establish credit lines that report and boost your score. Our experts will walk you through every stage, from foundation building to profile optimization, so you can achieve your credit goals faster.\n\nThis blueprint is perfect for new businesses seeking to start on the right foot, established companies that want to improve their credit standing, and entrepreneurs preparing to apply for business loans, lines of credit, or other funding opportunities.', 'Build a strong business credit profile with a proven step-by-step blueprint to boost your Paydex score and unlock better funding opportunities.', 10.00, 60, 'business_advisory', '/uploads/images/services/image-1754646490273-811232405.png', 'https://link.fastpaydirect.com/payment-link/687bafdeddc6a6192dc5612f', 1, 0, NULL, '2025-08-08 09:48:10', '2025-08-08 09:48:10'),
(25, 'Georgia Department of Labor (DOL) Set-up Application', 'Setting up your Georgia Department of Labor (DOL) account is a crucial step in staying compliant with state regulations and managing unemployment insurance for your employees. Our DOL account setup service makes the process simple, accurate, and hassle-free, ensuring all your business details are correctly submitted and approved the first time.\n\nAs part of the service, we handle business registration with the Georgia Department of Labor, provide step-by-step guidance on completing the DOL-1N form, and ensure your Federal Employer Identification Number (FEIN) is properly verified. We also assist with filing accurate information about your business type, employment details, and ownership structure. If required, we help you upload supporting documentation such as your driver’s license or FEIN confirmation. Our streamlined process ensures fast account activation so you can focus on running your business while we handle compliance.\n\nThis service is ideal for new or existing Georgia-based businesses—including LLCs, corporations, partnerships, and sole proprietors—who need to register or update their DOL account for unemployment tax filing and wage reporting. With our expertise, you avoid costly mistakes and delays, gaining peace of mind knowing your application is completed right the first time.', 'Seamlessly set up your Georgia DOL account for full compliance and smooth unemployment insurance management.', 200.00, 60, 'consultation', '/uploads/images/services/image-1754647619249-533158108.png', 'https://link.fastpaydirect.com/payment-link/687bafdeddc6a6192dc5612f', 1, 0, 'To process your DOL account setup, we’ll need your registered business name and address, FEIN, ownership information, employment details such as the number of employees and hiring dates, and a copy of your driver’s license or other required identification. Once we receive this information, we can begin your registration immediately.', '2025-08-08 10:06:59', '2025-08-08 10:06:59'),
(26, 'FB/IG AD CREDIT SPECIAL $349', 'Our FB/IG Ad Credit Special is the perfect solution for businesses ready to attract new customers and strengthen their online presence. For just $349, you’ll receive a strategic ad campaign credit on Facebook and Instagram, allowing you to target your ideal audience and maximize engagement.\n\nIn addition to the ad credit, this package includes one round of Attack Letters—a proven method to address inaccurate or harmful business information—and comprehensive Consumer Financial Protection Bureau (CFPB) and Federal Trade Commission (FTC) reports to help protect your brand and stay compliant. This powerful combination of marketing exposure and regulatory defense ensures you’re not only growing your business but also safeguarding it.\n\nDesigned for entrepreneurs, small business owners, and growing brands, this service helps you gain more leads, improve visibility, and maintain a trustworthy reputation online—all in one package.', 'Boost your business visibility with targeted Facebook & Instagram ads plus powerful compliance tools.', 349.00, 60, 'consultation', '/uploads/images/services/image-1754647985175-849607065.jpeg', 'https://link.fastpaydirect.com/payment-link/687bafdeddc6a6192dc5612f', 1, 0, 'To get started, you’ll need to provide your business name, address, and contact information, along with details about your target audience for Facebook and Instagram ads. We’ll also require any relevant account access or permissions to manage your campaigns effectively. Once we have these, we can launch your package without delay.', '2025-08-08 10:13:05', '2025-08-08 10:13:05');

-- --------------------------------------------------------

--
-- Table structure for table `tax_packages`
--

CREATE TABLE `tax_packages` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` varchar(50) NOT NULL,
  `revenue_share` varchar(20) DEFAULT NULL,
  `efin_required` tinyint(1) DEFAULT 0,
  `efin_description` text DEFAULT NULL,
  `ptin_required` tinyint(1) DEFAULT 0,
  `ptin_description` text DEFAULT NULL,
  `min_returns` int(11) DEFAULT 0,
  `min_returns_description` text DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `process` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`process`)),
  `includes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`includes`)),
  `image_url` varchar(500) DEFAULT NULL,
  `link` varchar(1000) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tax_packages`
--

INSERT INTO `tax_packages` (`id`, `title`, `description`, `price`, `revenue_share`, `efin_required`, `efin_description`, `ptin_required`, `ptin_description`, `min_returns`, `min_returns_description`, `category_id`, `process`, `includes`, `image_url`, `link`, `featured`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(6, 'Pro Kit', 'The Pro Kit is tailored for experienced tax professionals who are confident in completing tax returns independently with minimal assistance. This kit is ideal for tax preparers who can handle returns from start to finish with little to no guidance.\n\nWhile an EFIN is not required for this level, preparers with an existing EFIN will have full access to bank and tech support. Additionally, Money Solution Cafe offers return review services upon request, providing an extra layer of confidence and accuracy.', '$700.00', '80/20', 1, 'If Applicable', 1, 'Yes', 20, NULL, 2, '[\"Complete your client’s tax returns\",\"Send return to our main office \",\"The return is sent to the IRS\"]', '[\"20 Minimum Returns\",\"Tech Support\",\"Return Walkthrough\",\"Professional Software\",\"Your Own Business Name\",\"Client Forms\",\"Business & Marketing Course\",\"Self-Paced Tax School\"]', '/uploads/images/courses/image-1753910773477-959395880.jpeg', 'https://link.fastpaydirect.com/payment-link/68799f5dd6ab805a5be6ac15', 0, 0, 1, '2025-07-30 21:26:13', '2025-07-30 21:26:13'),
(7, 'Starter Kit-Tax software', 'The Starter Kit is tailored for individuals new to the tax industry who want expert guidance every step of the way. It’s perfect for motivated entrepreneurs eager to learn the tax business, even with no prior experience.\n\nWe use the #1 recommended TaxSlayer Pro Software, ensuring seamless and professional tax preparation. Comprehensive support is included, such as software setup, training, and ongoing assistance to help you excel throughout the tax season.\n\nMoney Solution Cafe will review every return for accuracy, giving you peace of mind with a second set of eyes to ensure 100% precision!', '$350.00', '70/30', 1, 'No (We will provide the EFIN)', 1, 'Yes (Your PTIN is the only requirement)', 0, 'None', 1, '[\"Complete your client’s tax returns\",\"Send it into our main office\",\"Money Solution Cafe’ review the return\",\"The return is sent to the IRS\"]', '[\"No EFIN Required\",\"No Minimum Returns\",\"Tech Support\",\"Return Walkthrough\",\"Professional Software\",\"Your Own Business Name\",\"Client Forms\",\"Business & Marketing Course\",\"Self-Paced Tax School\"]', '/uploads/images/courses/image-1753911299551-305661560.jpeg', 'https://link.fastpaydirect.com/payment-link/68799f40ddc6a6f972c558e4', 0, 0, 1, '2025-07-30 21:34:59', '2025-07-30 21:34:59'),
(8, 'Build Team Kit- Service Bureau- Tax software', 'The Build Team is designed for experienced tax professionals who are ready to elevate their business. This package is ideal for tax preparers who can confidently complete tax returns with little to no assistance.\n\nWith this kit, you’ll receive:\n– Your Own Business Name\n– Custom Mobile App Included\n– Assistance Setting Up Your Company with Our Banking Partners\n\nFor added peace of mind, we offer return review services upon request to ensure accuracy and client satisfaction. Take your tax business to the next level with the Build Team Kit.', '$2500.00', 'None', 1, 'Yes', 1, 'Yes', 75, NULL, 1, '[\"Complete your client’s tax returns\",\"You send return to the IRS\"]', '[\"No Revenue Split\",\"Self-Paced Tax Training School\",\"Custom Mobile App Included\",\"Website Available at Additional Cost\",\"Business and Marketing Course\",\"5 Free User IDs\",\"Tech Support\",\"Return Walk-Through\",\"Professional Tax Software\",\"Your Own Business Name\",\"Client Forms\",\"Bank Registration\"]', 'http://localhost:5000/uploads/images/courses/image-1753913076692-206802077.jpeg', 'https://link.fastpaydirect.com/payment-link/6879a15fddc6a65fcfc558f0', 0, 0, 1, '2025-07-30 22:04:36', '2025-07-30 22:28:39'),
(9, 'Brand Build Kit- Tax software', 'The Brand Build package is designed for experienced tax professionals ready to establish their own Service Bureau and build their own brand. This comprehensive package is ideal for those who are confident in completing tax returns independently and want to expand their business capabilities.', '$1500.00', 'No', 1, 'Yes', 0, NULL, 275, NULL, 2, '[\"Train other tax professionals and resell cobranded tax software.\",\"Onboard and manage your own team of tax partners.\",\"Build your brand with customized tools and resources.\"]', '[\"10 Free User IDs\",\"Tech Support\",\"Return Walk-Through\",\"Professional Tax Software\",\"Your Own Business Name\",\"Bank Registration\",\"IRS Registration\",\"Client Forms\",\"Free Website & Custom App\",\"A team of experts to support you and your partners.\"]', 'http://localhost:5000/uploads/images/courses/image-1753914304513-238835964.jpeg', 'https://link.fastpaydirect.com/payment-link/6879a17fd6ab8006c5e6ac19', 0, 0, 1, '2025-07-30 22:25:04', '2025-07-30 22:41:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `package_categories`
--
ALTER TABLE `package_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `priority_tradelines_au`
--
ALTER TABLE `priority_tradelines_au`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tax_packages`
--
ALTER TABLE `tax_packages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `package_categories`
--
ALTER TABLE `package_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `priority_tradelines_au`
--
ALTER TABLE `priority_tradelines_au`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=277;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `tax_packages`
--
ALTER TABLE `tax_packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tax_packages`
--
ALTER TABLE `tax_packages`
  ADD CONSTRAINT `tax_packages_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `package_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
