-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Lis 09, 2026 at 12:45 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `taskboard`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `boards`
--

CREATE TABLE `boards` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(80) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `ownerId` int(10) UNSIGNED NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `deletedAt` datetime DEFAULT NULL,
  `deletedById` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `boards`
--

INSERT INTO `boards` (`id`, `name`, `description`, `ownerId`, `createdAt`, `isDeleted`, `deletedAt`, `deletedById`) VALUES
(3, 'Aplikacja TaskBoard', 'Nowy opis', 1, '2026-11-09 10:34:04', 0, NULL, NULL),
(4, 'organizacja praktyk', NULL, 2, '2026-11-09 10:34:04', 1, '2026-11-09 12:04:46', 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `login` varchar(30) NOT NULL,
  `passwordHash` char(60) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `login`, `passwordHash`, `firstName`, `lastName`, `createdAt`) VALUES
(1, 'anna.nowak', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Anna', 'Nowak', '2026-11-09 10:34:04'),
(2, 'jan.kowalski', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Jan', 'Kowalski', '2026-11-09 10:34:04'),
(3, 'ola.wisniewska', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Ola', 'Wiśniewska', '2026-11-09 10:42:05'),
(4, 'piotr.zielinski', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Piotr', 'Zieliński', '2026-11-09 10:42:05'),
(5, 'kasia.lewandowska', '$2a$10$qCgFwKm4Qiu60z3cTqCvz.DZUvPNVnkJQjMagc4wtx24LiYjsF./y', 'Kasia', 'Lewandowska', '2026-11-09 10:42:05');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `boards`
--
ALTER TABLE `boards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ownerId` (`ownerId`),
  ADD KEY `deletedById` (`deletedById`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `boards`
--
ALTER TABLE `boards`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `boards`
--
ALTER TABLE `boards`
  ADD CONSTRAINT `boards_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `boards_ibfk_2` FOREIGN KEY (`deletedById`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
