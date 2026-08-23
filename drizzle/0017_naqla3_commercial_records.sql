CREATE TABLE IF NOT EXISTS `naqla3_commercial_assets` (
  `id` int AUTO_INCREMENT NOT NULL,
  `ownerUserId` int NOT NULL,
  `sourceListingId` int,
  `title` varchar(500) NOT NULL,
  `scope` text NOT NULL,
  `status` enum('prepared','due_diligence','contract_ready','archived') NOT NULL DEFAULT 'prepared',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `naqla3_commercial_assets_id` PRIMARY KEY(`id`)
);

CREATE INDEX `naqla3_asset_owner_idx` ON `naqla3_commercial_assets` (`ownerUserId`);
CREATE INDEX `naqla3_asset_listing_idx` ON `naqla3_commercial_assets` (`sourceListingId`);

CREATE TABLE IF NOT EXISTS `naqla3_commercial_transactions` (
  `id` int AUTO_INCREMENT NOT NULL,
  `assetId` int NOT NULL,
  `initiatorUserId` int NOT NULL,
  `counterpartyUserId` int NOT NULL,
  `status` enum('initiated','human_review','contract_ready','executing','cancelled') NOT NULL DEFAULT 'initiated',
  `humanReviewNote` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `naqla3_commercial_transactions_id` PRIMARY KEY(`id`)
);

CREATE INDEX `naqla3_transaction_asset_idx` ON `naqla3_commercial_transactions` (`assetId`);
CREATE INDEX `naqla3_transaction_initiator_idx` ON `naqla3_commercial_transactions` (`initiatorUserId`);
CREATE INDEX `naqla3_transaction_counterparty_idx` ON `naqla3_commercial_transactions` (`counterpartyUserId`);
