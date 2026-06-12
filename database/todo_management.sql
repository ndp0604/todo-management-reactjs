
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `projects` (
  `ProjectId` int(11) NOT NULL,
  `ProjectName` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `CreatedBy` int(11) NOT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `projects` (`ProjectId`, `ProjectName`, `Description`, `CreatedBy`, `CreatedAt`) VALUES
(1, 'Todo Management', 'Đồ án quản lý công việc', 1, '2026-06-10 13:21:41'),
(2, 'Thực tập tốt nghiệp', 'Theo dõi tiến độ thực tập', 1, '2026-06-10 13:21:41');


CREATE TABLE `tasks` (
  `TaskId` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `Status` enum('TODO','IN_PROGRESS','DONE') DEFAULT 'TODO',
  `ProjectId` int(11) NOT NULL,
  `AssignedTo` int(11) NOT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `tasks` (`TaskId`, `Title`, `Description`, `Status`, `ProjectId`, `AssignedTo`, `CreatedAt`) VALUES
(1, 'Thiết kế Login UI', 'Figma', 'TODO', 1, 1, '2026-06-10 13:31:36'),
(2, 'Xây dựng API Login', 'NodeJS', 'IN_PROGRESS', 1, 1, '2026-06-10 13:31:36'),
(3, 'Kết nối MySQL', 'Database', 'DONE', 1, 1, '2026-06-10 13:31:36');


CREATE TABLE `users` (
  `UserId` int(11) NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `Role` varchar(20) DEFAULT 'User',
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `users` (`UserId`, `FullName`, `Email`, `PasswordHash`, `Role`, `CreatedAt`) VALUES
(1, 'Nguyễn Duy Phong', 'phong@gmail.com', '$2b$10$ojqCagLtsFoExHrFDBHu/uDDdcHwmbgur1R1qGXtUxuS.bKMr//Su', 'User', '2026-06-10 12:47:57'),
(2, 'Nguyen Duy Phong', 'Phong1@gmail.com', '$2b$10$NeFj8neo9uIOvzuGArL6MezjvSzymdGuHxWYyV/rwSqeBTHK2Dxmy', 'User', '2026-06-10 13:25:35');

ALTER TABLE `projects`
  ADD PRIMARY KEY (`ProjectId`),
  ADD KEY `CreatedBy` (`CreatedBy`);

ALTER TABLE `tasks`
  ADD PRIMARY KEY (`TaskId`),
  ADD KEY `ProjectId` (`ProjectId`),
  ADD KEY `AssignedTo` (`AssignedTo`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`UserId`),
  ADD UNIQUE KEY `Email` (`Email`);

ALTER TABLE `projects`
  MODIFY `ProjectId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `tasks`
  MODIFY `TaskId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `users`
  MODIFY `UserId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`UserId`);

ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`ProjectId`) REFERENCES `projects` (`ProjectId`),
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`AssignedTo`) REFERENCES `users` (`UserId`);
COMMIT;
