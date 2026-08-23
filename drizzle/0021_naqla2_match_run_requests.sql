ALTER TABLE `naqla2_match_runs` ADD `matching_request_id` int;
--> statement-breakpoint
CREATE INDEX `naqla2_match_run_request_idx` ON `naqla2_match_runs` (`matching_request_id`);
