CREATE TABLE `naqla2_match_runs` (
  `id` int AUTO_INCREMENT NOT NULL,
  `requester_user_id` int NOT NULL,
  `query_text` varchar(500) NOT NULL,
  `status` enum('completed') NOT NULL DEFAULT 'completed',
  `candidate_count` int NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `naqla2_match_runs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `naqla2_match_run_requester_idx` ON `naqla2_match_runs` (`requester_user_id`);
--> statement-breakpoint
CREATE TABLE `naqla2_match_candidates` (
  `id` int AUTO_INCREMENT NOT NULL,
  `match_run_id` int NOT NULL,
  `listing_id` int NOT NULL,
  `rank_band` enum('high','medium','low') NOT NULL,
  `score` int NOT NULL,
  `evidence_confidence` enum('teaser_only','not_evaluated') NOT NULL DEFAULT 'teaser_only',
  `factors` json NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `naqla2_match_candidates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `naqla2_match_candidate_run_idx` ON `naqla2_match_candidates` (`match_run_id`);
--> statement-breakpoint
CREATE INDEX `naqla2_match_candidate_listing_idx` ON `naqla2_match_candidates` (`listing_id`);
