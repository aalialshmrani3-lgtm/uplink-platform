CREATE TABLE `naqla2_review_assignments` (
  `id` int AUTO_INCREMENT NOT NULL,
  `ipRegistrationId` int NOT NULL,
  `reviewerUserId` int NOT NULL,
  `assignedByUserId` int NOT NULL,
  `status` enum('active','revoked') NOT NULL DEFAULT 'active',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `naqla2_review_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `naqla2_review_assignment_ip_idx` ON `naqla2_review_assignments` (`ipRegistrationId`);
--> statement-breakpoint
CREATE INDEX `naqla2_review_assignment_reviewer_idx` ON `naqla2_review_assignments` (`reviewerUserId`);
