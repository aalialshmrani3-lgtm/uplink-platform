CREATE TABLE `prediction_accuracy` (
	`id` int AUTO_INCREMENT NOT NULL,
	`analysisId` int NOT NULL,
	`predictedOutcome` enum('success','failure') NOT NULL,
	`predictedProbability` decimal(5,4),
	`actualOutcome` enum('success','failure','unknown') DEFAULT 'unknown',
	`actualOutcomeDate` timestamp,
	`correct` boolean,
	`errorMargin` decimal(5,4),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prediction_accuracy_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `strategic_analyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectTitle` varchar(500) NOT NULL,
	`projectDescription` text NOT NULL,
	`budget` decimal(15,2),
	`teamSize` int,
	`timelineMonths` int,
	`marketDemand` int,
	`technicalFeasibility` int,
	`userEngagement` int,
	`hypothesisValidationRate` decimal(5,2),
	`ratCompletionRate` decimal(5,2),
	`userCount` int,
	`revenueGrowth` decimal(5,2),
	`iciScore` decimal(5,2),
	`irlScore` decimal(5,2),
	`successProbability` decimal(5,4),
	`riskLevel` enum('CRITICAL','HIGH','MEDIUM','LOW'),
	`investorAppeal` enum('VERY_LOW','LOW','MEDIUM','HIGH','VERY_HIGH'),
	`ceoInsights` json,
	`roadmap` json,
	`investment` json,
	`criticalPath` json,
	`dashboard` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `strategic_analyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`analysisId` int,
	`userId` int,
	`projectId` varchar(500),
	`feedbackType` enum('ceo_insight','roadmap','investment','general','whatif') NOT NULL,
	`itemId` int,
	`rating` varchar(50),
	`comment` text,
	`userRole` varchar(50),
	`sessionId` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `whatif_scenarios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`analysisId` int NOT NULL,
	`userId` int,
	`scenarioName` varchar(200),
	`modifications` json,
	`baselineIci` decimal(5,2),
	`modifiedIci` decimal(5,2),
	`baselineIrl` decimal(5,2),
	`modifiedIrl` decimal(5,2),
	`baselineSuccessProbability` decimal(5,4),
	`modifiedSuccessProbability` decimal(5,4),
	`impact` json,
	`recommendation` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `whatif_scenarios_id` PRIMARY KEY(`id`)
);
