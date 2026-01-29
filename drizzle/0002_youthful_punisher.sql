DROP TABLE `ambassadors`;--> statement-breakpoint
DROP TABLE `analytics`;--> statement-breakpoint
DROP TABLE `api_keys`;--> statement-breakpoint
DROP TABLE `api_usage`;--> statement-breakpoint
DROP TABLE `challenges`;--> statement-breakpoint
DROP TABLE `contracts`;--> statement-breakpoint
DROP TABLE `courses`;--> statement-breakpoint
DROP TABLE `elite_memberships`;--> statement-breakpoint
DROP TABLE `enrollments`;--> statement-breakpoint
DROP TABLE `escrow_accounts`;--> statement-breakpoint
DROP TABLE `escrow_transactions`;--> statement-breakpoint
DROP TABLE `evaluations`;--> statement-breakpoint
DROP TABLE `innovation_hubs`;--> statement-breakpoint
DROP TABLE `ip_registrations`;--> statement-breakpoint
DROP TABLE `notifications`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `phone`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `avatar`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `organizationName`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `organizationType`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `country`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `city`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `bio`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `website`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `linkedIn`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `isVerified`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `verificationDate`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `eliteMembership`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `membershipExpiry`;