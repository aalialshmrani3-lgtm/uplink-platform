CREATE TABLE `ambassadors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`country` varchar(100) NOT NULL,
	`city` varchar(100),
	`region` varchar(100),
	`title` varchar(200),
	`organization` varchar(200),
	`bio` text,
	`expertise` json,
	`languages` json,
	`status` enum('pending','active','inactive','suspended') DEFAULT 'pending',
	`appointedAt` timestamp,
	`achievements` json,
	`connections` int DEFAULT 0,
	`dealsIntroduced` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ambassadors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL,
	`metric` varchar(100) NOT NULL,
	`value` decimal(15,2) NOT NULL,
	`dimension` varchar(100),
	`dimensionValue` varchar(200),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `api_keys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(200) NOT NULL,
	`keyHash` varchar(256) NOT NULL,
	`keyPrefix` varchar(20) NOT NULL,
	`permissions` json,
	`rateLimit` int DEFAULT 1000,
	`status` enum('active','revoked','expired') DEFAULT 'active',
	`lastUsedAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `api_keys_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `api_usage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`apiKeyId` int NOT NULL,
	`endpoint` varchar(500) NOT NULL,
	`method` varchar(10) NOT NULL,
	`statusCode` int,
	`responseTime` int,
	`ipAddress` varchar(50),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `api_usage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `challenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizerId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`titleEn` varchar(500),
	`description` text NOT NULL,
	`descriptionEn` text,
	`type` enum('challenge','hackathon','competition','open_problem','conference') NOT NULL,
	`category` varchar(100),
	`prize` decimal(15,2),
	`currency` varchar(10) DEFAULT 'SAR',
	`status` enum('draft','open','closed','judging','completed','cancelled') DEFAULT 'draft',
	`startDate` timestamp,
	`endDate` timestamp,
	`requirements` json,
	`judges` json,
	`sponsors` json,
	`participants` int DEFAULT 0,
	`submissions` int DEFAULT 0,
	`winnerId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `challenges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`type` enum('license','acquisition','partnership','investment','service','nda') NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`partyA` int NOT NULL,
	`partyB` int NOT NULL,
	`totalValue` decimal(15,2) NOT NULL,
	`currency` varchar(10) DEFAULT 'SAR',
	`status` enum('draft','pending_signatures','active','completed','disputed','terminated','expired') DEFAULT 'draft',
	`terms` text,
	`milestones` json,
	`documents` json,
	`partyASignature` text,
	`partyASignedAt` timestamp,
	`partyBSignature` text,
	`partyBSignedAt` timestamp,
	`blockchainHash` varchar(256),
	`startDate` timestamp,
	`endDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contracts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`titleEn` varchar(500),
	`description` text,
	`descriptionEn` text,
	`category` enum('innovation','entrepreneurship','ip','investment','technology','leadership') NOT NULL,
	`level` enum('beginner','intermediate','advanced','expert') DEFAULT 'beginner',
	`duration` int,
	`modules` json,
	`instructor` varchar(200),
	`instructorBio` text,
	`partner` varchar(200),
	`thumbnail` text,
	`video` text,
	`price` decimal(10,2) DEFAULT '0',
	`isFree` boolean DEFAULT true,
	`certificateEnabled` boolean DEFAULT true,
	`enrollmentCount` int DEFAULT 0,
	`rating` decimal(3,2),
	`isPublished` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `elite_memberships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tier` enum('gold','platinum','diamond') NOT NULL,
	`status` enum('active','expired','cancelled','pending') DEFAULT 'pending',
	`startDate` timestamp,
	`endDate` timestamp,
	`price` decimal(10,2),
	`paymentStatus` enum('pending','paid','failed','refunded') DEFAULT 'pending',
	`benefits` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `elite_memberships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`progress` int DEFAULT 0,
	`completedModules` json,
	`status` enum('enrolled','in_progress','completed','dropped') DEFAULT 'enrolled',
	`startedAt` timestamp,
	`completedAt` timestamp,
	`certificateId` varchar(100),
	`certificateIssuedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `escrow_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contractId` int NOT NULL,
	`totalAmount` decimal(15,2) NOT NULL,
	`releasedAmount` decimal(15,2) DEFAULT '0',
	`pendingAmount` decimal(15,2),
	`currency` varchar(10) DEFAULT 'SAR',
	`status` enum('pending_deposit','funded','partially_released','fully_released','refunded','disputed') DEFAULT 'pending_deposit',
	`depositedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `escrow_accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `escrow_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`escrowId` int NOT NULL,
	`type` enum('deposit','release','refund','fee') NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`milestoneId` varchar(100),
	`description` text,
	`status` enum('pending','completed','failed','reversed') DEFAULT 'pending',
	`transactionHash` varchar(256),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `escrow_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`evaluatorId` int,
	`overallScore` decimal(5,2) NOT NULL,
	`classification` enum('innovation','commercial','guidance') NOT NULL,
	`innovationScore` decimal(5,2),
	`marketPotentialScore` decimal(5,2),
	`technicalFeasibilityScore` decimal(5,2),
	`teamCapabilityScore` decimal(5,2),
	`ipStrengthScore` decimal(5,2),
	`scalabilityScore` decimal(5,2),
	`aiAnalysis` text,
	`strengths` json,
	`weaknesses` json,
	`recommendations` json,
	`nextSteps` json,
	`marketAnalysis` text,
	`competitorAnalysis` text,
	`riskAssessment` text,
	`status` enum('pending','in_progress','completed','appealed') DEFAULT 'pending',
	`appealNotes` text,
	`appealStatus` enum('none','pending','approved','rejected') DEFAULT 'none',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evaluations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `innovation_hubs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`nameEn` varchar(200),
	`country` varchar(100) NOT NULL,
	`city` varchar(100) NOT NULL,
	`address` text,
	`type` enum('hub','accelerator','incubator','university','research_center','corporate') NOT NULL,
	`description` text,
	`website` text,
	`contactEmail` varchar(320),
	`contactPhone` varchar(50),
	`partnerSince` timestamp,
	`status` enum('active','inactive','pending') DEFAULT 'pending',
	`logo` text,
	`coordinates` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `innovation_hubs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ip_registrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('patent','trademark','copyright','trade_secret','industrial_design') NOT NULL,
	`title` varchar(500) NOT NULL,
	`titleEn` varchar(500),
	`description` text NOT NULL,
	`descriptionEn` text,
	`category` varchar(100),
	`subCategory` varchar(100),
	`keywords` json,
	`inventors` json,
	`applicantType` enum('individual','company','university','government'),
	`priorityDate` timestamp,
	`filingDate` timestamp,
	`status` enum('draft','submitted','under_review','approved','rejected','registered','expired') DEFAULT 'draft',
	`saipApplicationNumber` varchar(100),
	`wipoApplicationNumber` varchar(100),
	`blockchainHash` varchar(256),
	`blockchainTimestamp` timestamp,
	`documents` json,
	`fees` decimal(12,2),
	`feesPaid` boolean DEFAULT false,
	`expiryDate` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ip_registrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('info','success','warning','error','action') DEFAULT 'info',
	`title` varchar(200) NOT NULL,
	`message` text NOT NULL,
	`link` text,
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`titleEn` varchar(500),
	`description` text NOT NULL,
	`descriptionEn` text,
	`category` varchar(100),
	`subCategory` varchar(100),
	`stage` enum('idea','prototype','mvp','growth','scale') DEFAULT 'idea',
	`engine` enum('uplink1','uplink2','uplink3') DEFAULT 'uplink1',
	`status` enum('draft','submitted','evaluating','approved','matched','contracted','completed','rejected') DEFAULT 'draft',
	`teamSize` int,
	`fundingNeeded` decimal(15,2),
	`fundingReceived` decimal(15,2),
	`targetMarket` text,
	`competitiveAdvantage` text,
	`businessModel` text,
	`documents` json,
	`images` json,
	`video` text,
	`website` text,
	`ipRegistrationId` int,
	`evaluationId` int,
	`contractId` int,
	`tags` json,
	`views` int DEFAULT 0,
	`likes` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','innovator','investor','company','government') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `users` ADD `organizationName` text;--> statement-breakpoint
ALTER TABLE `users` ADD `organizationType` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `country` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `city` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `website` text;--> statement-breakpoint
ALTER TABLE `users` ADD `linkedIn` text;--> statement-breakpoint
ALTER TABLE `users` ADD `isVerified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `verificationDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `eliteMembership` enum('none','gold','platinum','diamond') DEFAULT 'none';--> statement-breakpoint
ALTER TABLE `users` ADD `membershipExpiry` timestamp;