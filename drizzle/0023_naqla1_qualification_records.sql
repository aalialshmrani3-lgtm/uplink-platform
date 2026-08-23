CREATE TABLE `naqla1_innovation_records` (
  `id` int AUTO_INCREMENT NOT NULL,
  `owner_user_id` int NOT NULL,
  `title` varchar(500) NOT NULL,
  `problem_statement` text NOT NULL,
  `desired_outcome` text NOT NULL,
  `status` enum('draft','evidence_pending','evaluated','qualified','routed') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `naqla1_innovation_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `naqla1_record_owner_idx` ON `naqla1_innovation_records` (`owner_user_id`);
--> statement-breakpoint
CREATE TABLE `naqla1_evidence` (
  `id` int AUTO_INCREMENT NOT NULL,
  `innovation_record_id` int NOT NULL,
  `owner_user_id` int NOT NULL,
  `label` varchar(500) NOT NULL,
  `evidence_type` enum('synthetic_note','research_reference','technical_description','prototype_note','other') NOT NULL,
  `content_sha256` varchar(64) NOT NULL,
  `authorization_status` enum('authorized','revoked') NOT NULL DEFAULT 'authorized',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `revoked_at` timestamp NULL,
  CONSTRAINT `naqla1_evidence_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `naqla1_evidence_record_idx` ON `naqla1_evidence` (`innovation_record_id`);
--> statement-breakpoint
CREATE INDEX `naqla1_evidence_owner_idx` ON `naqla1_evidence` (`owner_user_id`);
--> statement-breakpoint
CREATE TABLE `naqla1_immutable_versions` (
  `id` int AUTO_INCREMENT NOT NULL,
  `innovation_record_id` int NOT NULL,
  `owner_user_id` int NOT NULL,
  `version_number` int NOT NULL,
  `snapshot_sha256` varchar(64) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `naqla1_immutable_versions_id` PRIMARY KEY(`id`),
  CONSTRAINT `naqla1_version_record_number_unique` UNIQUE(`innovation_record_id`,`version_number`)
);
--> statement-breakpoint
CREATE INDEX `naqla1_version_owner_idx` ON `naqla1_immutable_versions` (`owner_user_id`);
--> statement-breakpoint
CREATE TABLE `naqla1_readiness_gaps` (
  `id` int AUTO_INCREMENT NOT NULL,
  `innovation_record_id` int NOT NULL,
  `owner_user_id` int NOT NULL,
  `code` enum('missing_authorized_evidence','missing_immutable_version','incomplete_problem_statement','incomplete_desired_outcome') NOT NULL,
  `status` enum('open','addressed') NOT NULL DEFAULT 'open',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `addressed_at` timestamp NULL,
  CONSTRAINT `naqla1_readiness_gaps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `naqla1_gap_record_idx` ON `naqla1_readiness_gaps` (`innovation_record_id`);
--> statement-breakpoint
CREATE INDEX `naqla1_gap_owner_idx` ON `naqla1_readiness_gaps` (`owner_user_id`);
--> statement-breakpoint
CREATE TABLE `naqla1_deterministic_assessments` (
  `id` int AUTO_INCREMENT NOT NULL,
  `innovation_record_id` int NOT NULL,
  `owner_user_id` int NOT NULL,
  `method` varchar(100) NOT NULL DEFAULT 'naqla1_deterministic_v1',
  `criteria_satisfied` int NOT NULL,
  `criteria_total` int NOT NULL,
  `readiness_level` int NOT NULL,
  `qualification_status` enum('not_ready','qualified') NOT NULL,
  `next_best_action` enum('add_authorized_evidence','create_immutable_version','complete_record','route_to_naqla2') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `naqla1_deterministic_assessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `naqla1_assessment_record_idx` ON `naqla1_deterministic_assessments` (`innovation_record_id`);
--> statement-breakpoint
CREATE INDEX `naqla1_assessment_owner_idx` ON `naqla1_deterministic_assessments` (`owner_user_id`);
--> statement-breakpoint
CREATE TABLE `naqla1_passports` (
  `id` int AUTO_INCREMENT NOT NULL,
  `innovation_record_id` int NOT NULL,
  `owner_user_id` int NOT NULL,
  `current_trl` int NOT NULL,
  `qualification_status` enum('not_ready','qualified') NOT NULL,
  `next_best_action` enum('add_authorized_evidence','create_immutable_version','complete_record','route_to_naqla2') NOT NULL,
  `last_assessment_id` int NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `naqla1_passports_id` PRIMARY KEY(`id`),
  CONSTRAINT `naqla1_passport_record_unique` UNIQUE(`innovation_record_id`)
);
--> statement-breakpoint
CREATE INDEX `naqla1_passport_owner_idx` ON `naqla1_passports` (`owner_user_id`);
