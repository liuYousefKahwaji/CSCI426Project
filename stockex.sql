-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 16, 2025 at 05:28 PM
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
-- Database: `stockex`
--

-- --------------------------------------------------------

--
-- Table structure for table `holdings`
--

CREATE TABLE `holdings` (
  `holding_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `stock_ticker` varchar(7) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `holdings`
--

INSERT INTO `holdings` (`holding_id`, `user_id`, `stock_ticker`, `quantity`) VALUES
(9, 1, 'NVDA', 1),
(10, 1, 'GOOGL', 1),
(14, 3, 'MSFT', 6),
(17, 1, 'AMZN', 1),
(18, 1, 'ASML', 2),
(19, 1, 'CRM', 3),
(20, 1, 'AAPL', 2),
(22, 3, 'ADBE', 1),
(23, 1, 'TSLA', 2),
(24, 17, 'AAPL', 1);

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp(),
  `type` enum('ADD','UPDATE') NOT NULL DEFAULT 'ADD',
  `stock_ticker` varchar(6) DEFAULT NULL,
  `new_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stocks`
--

CREATE TABLE `stocks` (
  `company` varchar(50) NOT NULL,
  `ticker` varchar(6) NOT NULL,
  `price` double NOT NULL,
  `change` decimal(11,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stocks`
--

INSERT INTO `stocks` (`company`, `ticker`, `price`, `change`) VALUES
('Apple Inc.', 'AAPL', 278.28, 0.00),
('Adobe Inc.', 'ADBE', 356.43, -224.52),
('Amazon.com Inc.', 'AMZN', 226.19, 80.86),
('ASML Holding N.V.', 'ASML', 790.3, 5.12),
('Alibaba Group Holding Limited', 'BABA', 78.9, -2.88),
('Salesforce, Inc.', 'CRM', 245.1, 3.05),
('Cisco Systems, Inc.', 'CSCO', 50.18, 0.75),
('Dell Technologies Inc.', 'DELL', 140.88, 1.97),
('Alphabet Inc.', 'GOOGL', 138.67, -0.89),
('LVMH Moët Hennessy Louis Vuitton', 'LVMUY', 175.4, 1.15),
('Mastercard Incorporated', 'MA', 410.7, 2.50),
('Meta Platforms', 'META', 328.45, 4.12),
('Microsoft Corp.', 'MSFT', 374.58, -1.24),
('Netflix Inc.', 'NFLX', 445.78, -2.34),
('Nestlé S.A.', 'NSRGY', 110.15, 0.05),
('NVIDIA Corp.', 'NVDA', 495.22, 8.45),
('Novo Nordisk A/S', 'NVO', 135.25, 2.15),
('Reliance Industries Ltd.', 'RIL', 38.45, -0.75),
('Razer', 'RZREF', 0.01, 0.00),
('Shell plc', 'SHEL', 65.99, 1.40),
('Samsung Electronics Co., Ltd.', 'SSNLF', 98.75, -0.55),
('Toyota Motor Corporation', 'TM', 215.8, 0.85),
('Tesla Inc.', 'TSLA', 238.72, 5.67),
('TSMC (Taiwan Semiconductor)', 'TSM', 125.6, 3.90);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ticker` varchar(6) NOT NULL,
  `transaction_type` enum('BUY','SELL') NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` double NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `user_id`, `ticker`, `transaction_type`, `quantity`, `price`, `timestamp`) VALUES
(1, 1, 'AAPL', 'BUY', 3, 178.45, '2025-12-12 17:34:40'),
(2, 1, 'CRM', 'BUY', 3, 245.1, '2025-12-12 17:34:40'),
(3, 1, 'AMZN', 'BUY', 2, 145.33, '2025-12-12 17:34:40'),
(4, 1, 'ASML', 'BUY', 2, 790.3, '2025-12-12 17:34:40'),
(5, 1, 'GOOGL', 'BUY', 1, 138.67, '2025-12-12 17:34:40'),
(6, 1, 'NVDA', 'BUY', 1, 495.22, '2025-12-12 17:34:40'),
(7, 1, 'AAPL', 'SELL', 1, 178.45, '2025-12-12 17:35:28'),
(8, 1, 'AMZN', 'SELL', 1, 145.33, '2025-12-12 17:35:52'),
(9, 3, 'MSFT', 'BUY', 6, 374.58, '2025-12-12 17:39:43'),
(10, 1, 'TSLA', 'BUY', 2, 238.72, '2025-12-12 17:50:46'),
(11, 17, 'CSCO', 'SELL', 2, 50.18, '2025-12-12 17:57:19'),
(12, 17, 'AAPL', 'BUY', 1, 178.45, '2025-12-13 19:38:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `pass` varchar(20) NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT 0,
  `wallet` double NOT NULL DEFAULT 0,
  `profile` text NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `pass`, `admin`, `wallet`, `profile`) VALUES
(1, 'admin', 'admin', 1, 8433.14, ''),
(3, 'test2', '321', 0, 6034.47, ''),
(4, 'admin2', 'admin2', 1, 4543, ''),
(17, 'test1', '123', 0, 4262.91, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `holdings`
--
ALTER TABLE `holdings`
  ADD PRIMARY KEY (`holding_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `stock_id` (`stock_ticker`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_id_requests` (`user_id`),
  ADD KEY `fk_stock_ticker_requests` (`stock_ticker`);

--
-- Indexes for table `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`ticker`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `fk_user_id_trans` (`user_id`),
  ADD KEY `fk_stock_ticker_trans` (`ticker`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `holdings`
--
ALTER TABLE `holdings`
  MODIFY `holding_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `holdings`
--
ALTER TABLE `holdings`
  ADD CONSTRAINT `fk_stock_ticker` FOREIGN KEY (`stock_ticker`) REFERENCES `stocks` (`ticker`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `fk_stock_ticker_requests` FOREIGN KEY (`stock_ticker`) REFERENCES `stocks` (`ticker`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_id_requests` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `fk_stock_ticker_trans` FOREIGN KEY (`ticker`) REFERENCES `stocks` (`ticker`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_id_trans` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
