-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 09, 2024 at 06:59 PM
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
-- Database: `tof_database`
--
CREATE DATABASE IF NOT EXISTS `tof_database` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `tof_database`;

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `admins` (`id`, `username`, `password`) VALUES
(1, 'admin', 'tofpass');

-- --------------------------------------------------------

--
-- Table structure for table `competitions`
--

CREATE TABLE IF NOT EXISTS `competitions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openregistration` tinyint(1) NOT NULL DEFAULT 0,
  `ratstrialid` varchar(15) NOT NULL,
  `location` varchar(100) NOT NULL,
  `registrationstart` date NOT NULL,
  `registrationend` date NOT NULL,
  `paymentemail` varchar(50) NOT NULL,
  `paymentpassword` varchar(50) NOT NULL,
  `schedule` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `competitors`
--

CREATE TABLE IF NOT EXISTS `competitors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address1` varchar(50) DEFAULT NULL,
  `address2` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `province` varchar(50) DEFAULT NULL,
  `postalcode` varchar(10) DEFAULT NULL,
  `comments` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `day`
--

CREATE TABLE IF NOT EXISTS `day` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `competitions_id` int(11) NOT NULL,
  `trialdate` date NOT NULL,
  `limitentries` int(11) NOT NULL,
  `trialcount` int(11) DEFAULT 1,
  `games` text NOT NULL COMMENT 'comma delimited',
  `checkin` time NOT NULL,
  `firstrun` time NOT NULL,
  `lunchstart` time NOT NULL,
  `lunchend` time NOT NULL,
  `judges` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `day_competitionsId` (`competitions_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dogs`
--

CREATE TABLE IF NOT EXISTS `dogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `competitors_id` int(11) NOT NULL,
  `ratsid` varchar(9) NOT NULL COMMENT 'NN-NNN-AA',
  `name` varchar(50) DEFAULT NULL,
  `breed` varchar(50) DEFAULT NULL,
  `sex` varchar(10) DEFAULT NULL,
  `inseason` tinyint(1) DEFAULT NULL,
  `dateofbirth` date NOT NULL COMMENT 'YYYY-MM-DD',
  `breedgroup` int(11) DEFAULT NULL,
  `BAR_level` varchar(25) DEFAULT NULL,
  `BAR_q` smallint(6) DEFAULT 0,
  `BRH_level` varchar(25) DEFAULT NULL,
  `BRH_q` smallint(6) DEFAULT 0,
  `TR_level` varchar(25) DEFAULT NULL,
  `TR_q` smallint(6) DEFAULT 0,
  `TL_level` varchar(25) DEFAULT NULL,
  `TL_q` smallint(6) DEFAULT 0,
  `comments` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `competitors_id` (`competitors_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `emergency`
--

CREATE TABLE IF NOT EXISTS `emergency` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `competitors_id` int(11) NOT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `emergency_id` (`competitors_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `entry`
--

CREATE TABLE IF NOT EXISTS `entry` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `day_id` int(11) NOT NULL,
  `dogs_id` int(11) NOT NULL,
  `orderNumber` int(11) NOT NULL DEFAULT 0,
  `dogs_ratsidteam` varchar(9) NOT NULL,
  `game` varchar(25) NOT NULL,
  `level` varchar(15) NOT NULL,
  `trialnumber` int(11) NOT NULL DEFAULT 1,
  `price` int(11) NOT NULL,
  `crating` tinyint(1) NOT NULL,
  `receivedpayment` tinyint(1) NOT NULL,
  `deposited` tinyint(1) NOT NULL,
  `agreement` tinyint(1) NOT NULL,
  `waiver` tinyint(1) NOT NULL,
  `signature` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `entry_id` (`day_id`),
  KEY `entry_dogID` (`dogs_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `results`
--

CREATE TABLE IF NOT EXISTS `results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entry_id` int(11) NOT NULL,
  `time` time NOT NULL,
  `result` varchar(10) NOT NULL,
  `title` varchar(15) NOT NULL,
  `judge` varchar(50) NOT NULL,
  `dogdesc` varchar(25) NOT NULL,
  `handlerdesc` varchar(25) NOT NULL,
  `comments` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `results_entryId` (`entry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `day`
--
ALTER TABLE `day`
  ADD CONSTRAINT `day_competitionsId` FOREIGN KEY (`competitions_id`) REFERENCES `competitions` (`id`);

--
-- Constraints for table `dogs`
--
ALTER TABLE `dogs`
  ADD CONSTRAINT `competitors_id` FOREIGN KEY (`competitors_id`) REFERENCES `competitors` (`id`);

--
-- Constraints for table `emergency`
--
ALTER TABLE `emergency`
  ADD CONSTRAINT `emergency_id` FOREIGN KEY (`competitors_id`) REFERENCES `competitors` (`id`);

--
-- Constraints for table `entry`
--
ALTER TABLE `entry`
  ADD CONSTRAINT `entry_dogID` FOREIGN KEY (`dogs_id`) REFERENCES `dogs` (`id`),
  ADD CONSTRAINT `entry_id` FOREIGN KEY (`day_id`) REFERENCES `day` (`id`);

--
-- Constraints for table `results`
--
ALTER TABLE `results`
  ADD CONSTRAINT `results_entryId` FOREIGN KEY (`entry_id`) REFERENCES `entry` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
