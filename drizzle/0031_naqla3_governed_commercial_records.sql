-- NAQLA3 governed commercial records. This migration extends only the Phase 3 workflow tables.
ALTER TABLE `naqla3_commercial_transactions`
  ADD COLUMN IF NOT EXISTS `parentTransactionId` INT NULL;

ALTER TABLE `naqla3_due_diligence_requests`
  ADD COLUMN IF NOT EXISTS `reviewedBy` INT NULL,
  ADD COLUMN IF NOT EXISTS `reviewedAt` TIMESTAMP NULL,
  ADD COLUMN IF NOT EXISTS `reviewNote` TEXT NULL;

ALTER TABLE `naqla3_term_sheets`
  ADD COLUMN IF NOT EXISTS `approvedBy` INT NULL,
  ADD COLUMN IF NOT EXISTS `approvedAt` TIMESTAMP NULL;

ALTER TABLE `naqla3_scale_decisions`
  ADD COLUMN IF NOT EXISTS `approvedBy` INT NULL,
  ADD COLUMN IF NOT EXISTS `approvedAt` TIMESTAMP NULL,
  ADD COLUMN IF NOT EXISTS `closureNote` TEXT NULL;

CREATE TABLE IF NOT EXISTS `naqla3_execution_milestones` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `executionPlanId` INT NOT NULL,
  `transactionId` INT NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `description` TEXT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'planned',
  `createdBy` INT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `naqla3_execution_milestones_id` PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `naqla3_execution_deliverables` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `milestoneId` INT NOT NULL,
  `transactionId` INT NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `evidenceReference` VARCHAR(1024) NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'submitted',
  `createdBy` INT NOT NULL,
  `acceptedBy` INT NULL,
  `acceptedAt` TIMESTAMP NULL,
  `acceptanceNote` TEXT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `naqla3_execution_deliverables_id` PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `naqla3_execution_change_requests` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `transactionId` INT NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `details` TEXT NOT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'open',
  `requestedBy` INT NOT NULL,
  `resolvedBy` INT NULL,
  `resolutionNote` TEXT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resolvedAt` TIMESTAMP NULL,
  CONSTRAINT `naqla3_execution_change_requests_id` PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `naqla3_execution_risks_issues` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `transactionId` INT NOT NULL,
  `recordType` VARCHAR(16) NOT NULL,
  `severity` VARCHAR(16) NOT NULL,
  `details` TEXT NOT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'open',
  `reportedBy` INT NOT NULL,
  `resolvedBy` INT NULL,
  `resolutionNote` TEXT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resolvedAt` TIMESTAMP NULL,
  CONSTRAINT `naqla3_execution_risks_issues_id` PRIMARY KEY (`id`)
);
