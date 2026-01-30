CREATE TABLE `idea_organizations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ideaId` int NOT NULL,
	`organizationId` int NOT NULL,
	`role` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `idea_organizations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameAr` varchar(500) NOT NULL,
	`nameEn` varchar(500),
	`type` enum('government','academic','private','supporting') NOT NULL,
	`scope` enum('local','global') NOT NULL DEFAULT 'local',
	`description` text,
	`website` text,
	`logo` text,
	`contactEmail` varchar(320),
	`contactPhone` varchar(20),
	`address` text,
	`country` varchar(100) DEFAULT 'Saudi Arabia',
	`city` varchar(100),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_organizations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`organizationId` int NOT NULL,
	`role` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_organizations_id` PRIMARY KEY(`id`)
);
