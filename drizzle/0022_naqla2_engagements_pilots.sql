CREATE TABLE `naqla2_engagements` (
  `id` int AUTO_INCREMENT NOT NULL,
  `interest_request_id` int NOT NULL,
  `owner_user_id` int NOT NULL,
  `requester_user_id` int NOT NULL,
  `status` enum('established','closed') NOT NULL DEFAULT 'established',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `naqla2_engagements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `naqla2_engagement_interest_idx` ON `naqla2_engagements` (`interest_request_id`);
--> statement-breakpoint
CREATE INDEX `naqla2_engagement_owner_idx` ON `naqla2_engagements` (`owner_user_id`);
--> statement-breakpoint
CREATE INDEX `naqla2_engagement_requester_idx` ON `naqla2_engagements` (`requester_user_id`);
--> statement-breakpoint
CREATE TABLE `naqla2_pilots` (
  `id` int AUTO_INCREMENT NOT NULL,
  `engagement_id` int NOT NULL,
  `owner_user_id` int NOT NULL,
  `requester_user_id` int NOT NULL,
  `status` enum('planned','active','completed','closed') NOT NULL DEFAULT 'planned',
  `scope` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `naqla2_pilots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `naqla2_pilot_engagement_idx` ON `naqla2_pilots` (`engagement_id`);
--> statement-breakpoint
CREATE INDEX `naqla2_pilot_owner_idx` ON `naqla2_pilots` (`owner_user_id`);
--> statement-breakpoint
CREATE INDEX `naqla2_pilot_requester_idx` ON `naqla2_pilots` (`requester_user_id`);
