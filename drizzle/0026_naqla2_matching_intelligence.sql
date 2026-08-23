ALTER TABLE `naqla2_match_runs`
  ADD COLUMN `active_context_id` INT NULL,
  ADD COLUMN `rule_version` VARCHAR(64) NOT NULL DEFAULT 'naqla2-deterministic-v2',
  ADD COLUMN `weight_version` VARCHAR(64) NOT NULL DEFAULT 'term-overlap-100-v1',
  ADD COLUMN `input_fingerprint` VARCHAR(128) NOT NULL DEFAULT '',
  ADD COLUMN `completed_at` TIMESTAMP NULL;
--> statement-breakpoint
CREATE INDEX `naqla2_match_run_context_idx` ON `naqla2_match_runs` (`active_context_id`);
--> statement-breakpoint
UPDATE `naqla2_match_runs` SET `input_fingerprint` = CONCAT('legacy-', `id`) WHERE `input_fingerprint` = '';
--> statement-breakpoint
CREATE UNIQUE INDEX `naqla2_match_run_replay_uq` ON `naqla2_match_runs` (`requester_user_id`, `matching_request_id`, `rule_version`, `input_fingerprint`);
--> statement-breakpoint
CREATE TABLE `naqla2_match_exclusions` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `match_run_id` INT NOT NULL,
  `listing_id` INT NOT NULL,
  `reason_code` VARCHAR(64) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `naqla2_match_exclusions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `naqla2_match_exclusion_run_idx` ON `naqla2_match_exclusions` (`match_run_id`);
