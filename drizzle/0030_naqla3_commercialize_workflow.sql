-- NAQLA3 governed commercialization extension. Existing Phase 2.2 records remain immutable.
ALTER TABLE `naqla3_commercial_assets`
  ADD COLUMN IF NOT EXISTS `tenantId` INT NULL,
  ADD COLUMN IF NOT EXISTS `summary` TEXT NULL,
  ADD COLUMN IF NOT EXISTS `assetType` VARCHAR(80) NULL,
  ADD COLUMN IF NOT EXISTS `classification` VARCHAR(40) NULL,
  ADD COLUMN IF NOT EXISTS `sourceInnovationRecordId` INT NULL,
  ADD COLUMN IF NOT EXISTS `sourceInnovationRecordVersion` INT NULL,
  ADD COLUMN IF NOT EXISTS `sourceSnapshotHash` VARCHAR(128) NULL;

ALTER TABLE `naqla3_commercial_transactions`
  ADD COLUMN IF NOT EXISTS `tenantId` INT NULL,
  ADD COLUMN IF NOT EXISTS `commercialAssetVersionId` INT NULL,
  ADD COLUMN IF NOT EXISTS `origin` VARCHAR(80) NULL,
  ADD COLUMN IF NOT EXISTS `stage` VARCHAR(40) NULL,
  ADD COLUMN IF NOT EXISTS `ownerUserId` INT NULL,
  ADD COLUMN IF NOT EXISTS `policyVersion` VARCHAR(64) NULL,
  ADD COLUMN IF NOT EXISTS `startedAt` TIMESTAMP NULL,
  ADD COLUMN IF NOT EXISTS `closedAt` TIMESTAMP NULL,
  ADD COLUMN IF NOT EXISTS `outcome` VARCHAR(80) NULL,
  ADD COLUMN IF NOT EXISTS `transitionVersion` INT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS `idempotencyKey` VARCHAR(160) NULL;

ALTER TABLE `naqla3_commercial_transactions`
  MODIFY COLUMN `status` ENUM('initiated','human_review','contract_ready','executing','cancelled','draft','active','waiting_on_counterparty','needs_information','paused','completed','withdrawn','terminated','archived') NOT NULL DEFAULT 'draft';

CREATE UNIQUE INDEX IF NOT EXISTS `naqla3_transaction_idempotency_unique` ON `naqla3_commercial_transactions` (`idempotencyKey`);
CREATE INDEX IF NOT EXISTS `naqla3_transaction_tenant_idx` ON `naqla3_commercial_transactions` (`tenantId`);

CREATE TABLE IF NOT EXISTS `naqla3_commercial_asset_versions` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `assetId` INT NOT NULL,
  `tenantId` INT NOT NULL,
  `versionNumber` INT NOT NULL,
  `summary` TEXT NULL,
  `evidenceSnapshot` JSON NULL,
  `sourceSnapshotHash` VARCHAR(128) NOT NULL,
  `createdBy` INT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `naqla3_commercial_asset_versions_id` PRIMARY KEY (`id`),
  CONSTRAINT `naqla3_asset_version_unique` UNIQUE (`assetId`,`versionNumber`)
);

CREATE TABLE IF NOT EXISTS `naqla3_commercial_readiness_assessments` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `assetId` INT NOT NULL,
  `tenantId` INT NOT NULL,
  `version` INT NOT NULL,
  `status` VARCHAR(64) NOT NULL,
  `checklist` JSON NOT NULL,
  `gapSummary` JSON NULL,
  `createdBy` INT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `naqla3_readiness_assessments_id` PRIMARY KEY (`id`),
  CONSTRAINT `naqla3_readiness_unique` UNIQUE (`assetId`,`version`)
);

CREATE TABLE IF NOT EXISTS `naqla3_transaction_participants` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `transactionId` INT NOT NULL,
  `tenantId` INT NOT NULL,
  `userId` INT NOT NULL,
  `organizationId` INT NOT NULL,
  `role` VARCHAR(64) NOT NULL,
  `capabilities` JSON NOT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'active',
  `createdBy` INT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `naqla3_transaction_participants_id` PRIMARY KEY (`id`),
  CONSTRAINT `naqla3_transaction_participant_unique` UNIQUE (`transactionId`,`userId`)
);

CREATE TABLE IF NOT EXISTS `naqla3_due_diligence_cases` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `transactionId` INT NOT NULL,
  `tenantId` INT NOT NULL,
  `status` VARCHAR(40) NOT NULL DEFAULT 'open',
  `checklist` JSON NOT NULL,
  `completionNote` TEXT NULL,
  `createdBy` INT NOT NULL,
  `completedBy` INT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completedAt` TIMESTAMP NULL,
  CONSTRAINT `naqla3_dd_cases_id` PRIMARY KEY (`id`),
  CONSTRAINT `naqla3_dd_case_transaction_unique` UNIQUE (`transactionId`)
);

CREATE TABLE IF NOT EXISTS `naqla3_due_diligence_requests` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `caseId` INT NOT NULL,
  `transactionId` INT NOT NULL,
  `recipientUserId` INT NOT NULL,
  `subject` VARCHAR(500) NOT NULL,
  `body` TEXT NOT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'draft',
  `responseBody` TEXT NULL,
  `reviewStatus` VARCHAR(32) NULL,
  `idempotencyKey` VARCHAR(160) NULL,
  `createdBy` INT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `naqla3_dd_requests_id` PRIMARY KEY (`id`),
  CONSTRAINT `naqla3_dd_request_idempotency_unique` UNIQUE (`idempotencyKey`)
);

CREATE TABLE IF NOT EXISTS `naqla3_data_room_documents` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `transactionId` INT NOT NULL,
  `tenantId` INT NOT NULL,
  `documentType` VARCHAR(80) NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `storageKey` VARCHAR(1024) NOT NULL,
  `mimeType` VARCHAR(160) NOT NULL,
  `sizeBytes` INT NOT NULL,
  `classification` VARCHAR(40) NOT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'active',
  `createdBy` INT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `naqla3_data_room_documents_id` PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `naqla3_data_room_document_shares` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `documentId` INT NOT NULL,
  `granteeUserId` INT NOT NULL,
  `granteeOrganizationId` INT NOT NULL,
  `allowedRoles` JSON NOT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'active',
  `createdBy` INT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `revokedAt` TIMESTAMP NULL,
  CONSTRAINT `naqla3_data_room_shares_id` PRIMARY KEY (`id`),
  CONSTRAINT `naqla3_data_room_share_unique` UNIQUE (`documentId`,`granteeUserId`,`granteeOrganizationId`)
);

CREATE TABLE IF NOT EXISTS `naqla3_disclosure_records` (`id` INT AUTO_INCREMENT NOT NULL, `transactionId` INT NOT NULL, `documentId` INT NOT NULL, `actorUserId` INT NOT NULL, `action` VARCHAR(80) NOT NULL, `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT `naqla3_disclosure_records_id` PRIMARY KEY (`id`));
CREATE TABLE IF NOT EXISTS `naqla3_term_sheets` (`id` INT AUTO_INCREMENT NOT NULL, `transactionId` INT NOT NULL, `status` VARCHAR(32) NOT NULL DEFAULT 'draft', `versionNumber` INT NOT NULL DEFAULT 1, `body` JSON NOT NULL, `createdBy` INT NOT NULL, `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT `naqla3_term_sheets_id` PRIMARY KEY (`id`));
CREATE TABLE IF NOT EXISTS `naqla3_agreement_records` (`id` INT AUTO_INCREMENT NOT NULL, `transactionId` INT NOT NULL, `termSheetId` INT NULL, `title` VARCHAR(500) NOT NULL, `status` VARCHAR(32) NOT NULL DEFAULT 'draft', `externalReference` VARCHAR(256) NULL, `createdBy` INT NOT NULL, `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, `executedAt` TIMESTAMP NULL, CONSTRAINT `naqla3_agreement_records_id` PRIMARY KEY (`id`));
CREATE TABLE IF NOT EXISTS `naqla3_execution_plans` (`id` INT AUTO_INCREMENT NOT NULL, `transactionId` INT NOT NULL, `objectives` TEXT NOT NULL, `status` VARCHAR(32) NOT NULL DEFAULT 'active', `createdBy` INT NOT NULL, `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT `naqla3_execution_plans_id` PRIMARY KEY (`id`));
CREATE TABLE IF NOT EXISTS `naqla3_scale_decisions` (`id` INT AUTO_INCREMENT NOT NULL, `transactionId` INT NOT NULL, `outcome` VARCHAR(64) NOT NULL, `lessonsLearned` TEXT NULL, `createdBy` INT NOT NULL, `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT `naqla3_scale_decisions_id` PRIMARY KEY (`id`));
CREATE TABLE IF NOT EXISTS `naqla3_commercial_action_logs` (`id` INT AUTO_INCREMENT NOT NULL, `transactionId` INT NULL, `assetId` INT NULL, `actorUserId` INT NOT NULL, `action` VARCHAR(120) NOT NULL, `idempotencyKey` VARCHAR(160) NULL, `safeMetadata` JSON NULL, `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT `naqla3_commercial_action_logs_id` PRIMARY KEY (`id`));
