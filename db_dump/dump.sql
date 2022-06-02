-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Июн 02 2022 г., 03:15
-- Версия сервера: 10.4.21-MariaDB
-- Версия PHP: 8.0.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- База данных: `tree_comments`
--

-- --------------------------------------------------------

--
-- Структура таблицы `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `owner` int(11) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  `time_updated` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `comments`
--

INSERT INTO `comments` (`id`, `owner`, `author`, `body`, `time`, `time_updated`) VALUES
(157, NULL, 'Dana White', 'Eaque iure iusto maiores molestiae officia rerum voluptates? updated', 1654132153422, 1654132290512),
(158, NULL, 'John Jones', 'Delectus deserunt est, illo iste nemo reprehenderit saepe vero voluptates?', 1654132161309, NULL),
(159, NULL, 'Frank Fertitta', 'A nulla optio pariatur recusandae soluta temporibus?', 1654132170041, NULL),
(160, NULL, 'Kamaru Usman', 'A, aperiam, aspernatur distinctio ducimus esse facilis incidunt, iusto natus neque numquam officia perferendis quaequis reiciendis reprehenderit soluta veritatis. updated', 1654132177417, 1654132245950),
(161, 158, 'Nate Diaz', 'A nulla optio pariatur recusandae soluta temporibus? updated', 1654132190072, 1654132226599),
(162, 161, 'Tyson Fury', 'At excepturi expedita officia saepe suscipit!', 1654132203824, NULL),
(163, 159, 'Dustin Poirier', 'At excepturi expedita officia saepe suscipit!', 1654132216751, NULL),
(164, NULL, 'José Aldo', 'A nulla optio pariatur recusandae soluta temporibus?', 1654132462190, NULL),
(165, NULL, 'Nate Diaz', 'Eaque iure iusto maiores molestiae officia rerum voluptates?', 1654132470246, NULL),
(166, 162, 'Joe Rogan', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', 1654132483573, NULL);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=167;
COMMIT;
