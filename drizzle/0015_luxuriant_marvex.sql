CREATE TABLE `admin_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`adminName` varchar(200),
	`action` enum('create','update','delete','activate','deactivate','export','view') NOT NULL,
	`targetType` enum('user','project','ip','organization','analysis','system') NOT NULL,
	`targetId` int,
	`targetName` varchar(500),
	`details` json,
	`ipAddress` varchar(50),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `system_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`metricType` enum('api_call','error','performance','user_activity','database') NOT NULL,
	`metricName` varchar(200) NOT NULL,
	`metricValue` decimal(10,2),
	`endpoint` varchar(500),
	`method` varchar(10),
	`statusCode` int,
	`responseTime` int,
	`errorMessage` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `system_metrics_id` PRIMARY KEY(`id`)
);
