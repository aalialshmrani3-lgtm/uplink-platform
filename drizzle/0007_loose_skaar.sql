CREATE TABLE `gate_decisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`innovationId` int NOT NULL,
	`stage` varchar(100) NOT NULL,
	`decisionType` enum('continue','park','kill') NOT NULL,
	`rationale` text NOT NULL,
	`decisionDate` timestamp NOT NULL DEFAULT (now()),
	`deciderId` int NOT NULL,
	`validationResults` json,
	`remainingRATs` json,
	`resourcesConsumed` decimal(15,2),
	`keyLearnings` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gate_decisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `innovation_hypotheses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`innovationId` int NOT NULL,
	`userId` int NOT NULL,
	`statement` text NOT NULL,
	`statementEn` text,
	`assumption` text,
	`metric` varchar(255),
	`successCriterion` text,
	`testMethod` text,
	`riskLevel` enum('high','medium','low') DEFAULT 'medium',
	`uncertaintyLevel` enum('high','medium','low') DEFAULT 'medium',
	`impactIfWrong` enum('critical','major','minor') DEFAULT 'major',
	`ratScore` decimal(5,2),
	`status` enum('pending','testing','validated','invalidated') DEFAULT 'pending',
	`testResult` text,
	`evidence` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `innovation_hypotheses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `knowledge_base_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceType` enum('learning','decision','experiment','retrospective') NOT NULL,
	`sourceId` int,
	`content` text NOT NULL,
	`contentEn` text,
	`category` varchar(100),
	`tags` json,
	`rating` decimal(3,2),
	`viewCount` int DEFAULT 0,
	`helpfulCount` int DEFAULT 0,
	`notHelpfulCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `knowledge_base_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `knowledge_ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`itemId` int NOT NULL,
	`userId` int NOT NULL,
	`isHelpful` boolean NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `knowledge_ratings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `learning_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`innovationId` int NOT NULL,
	`userId` int NOT NULL,
	`stage` varchar(100),
	`lessonLearned` text NOT NULL,
	`lessonLearnedEn` text,
	`impact` enum('high','medium','low') DEFAULT 'medium',
	`recommendation` text,
	`tags` json,
	`category` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `learning_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rat_tests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hypothesisId` int NOT NULL,
	`userId` int NOT NULL,
	`testName` varchar(255) NOT NULL,
	`testDescription` text,
	`plannedDate` timestamp,
	`completedDate` timestamp,
	`result` text,
	`status` enum('planned','in_progress','completed') DEFAULT 'planned',
	`budget` decimal(10,2),
	`resources` json,
	`learnings` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rat_tests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strategic_challenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`titleEn` varchar(500),
	`description` text NOT NULL,
	`descriptionEn` text,
	`businessImpact` text,
	`stakeholders` json,
	`constraints` text,
	`successCriteria` text,
	`priority` enum('high','medium','low') DEFAULT 'medium',
	`status` enum('active','in_progress','solved','archived') DEFAULT 'active',
	`linkedInnovations` json,
	`tags` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `strategic_challenges_id` PRIMARY KEY(`id`)
);
