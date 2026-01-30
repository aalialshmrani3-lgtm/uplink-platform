CREATE TABLE `saved_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`viewType` varchar(50) NOT NULL,
	`filters` json NOT NULL,
	`isPublic` boolean DEFAULT false,
	`sharedWith` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `saved_views_id` PRIMARY KEY(`id`)
);
