CREATE TABLE IF NOT EXISTS `naqla2_vetting_reviews` (
  `id` int AUTO_INCREMENT NOT NULL,
  `ipRegistrationId` int NOT NULL,
  `reviewerUserId` int NOT NULL,
  `recommendation` enum('approve','reject','needs_revision') NOT NULL,
  `comments` text NOT NULL,
  `revisionSuggestions` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `naqla2_vetting_reviews_id` PRIMARY KEY(`id`)
);

CREATE INDEX `naqla2_vetting_review_ip_idx` ON `naqla2_vetting_reviews` (`ipRegistrationId`);

CREATE TABLE IF NOT EXISTS `naqla2_marketplace_listings` (
  `id` int AUTO_INCREMENT NOT NULL,
  `ipRegistrationId` int NOT NULL,
  `ownerUserId` int NOT NULL,
  `title` varchar(500) NOT NULL,
  `summary` text NOT NULL,
  `disclosureScope` enum('teaser_only','authorized_disclosure') NOT NULL DEFAULT 'teaser_only',
  `status` enum('draft','published','paused','withdrawn') NOT NULL DEFAULT 'draft',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `naqla2_marketplace_listings_id` PRIMARY KEY(`id`)
);

CREATE INDEX `naqla2_marketplace_listing_ip_idx` ON `naqla2_marketplace_listings` (`ipRegistrationId`);
CREATE INDEX `naqla2_marketplace_listing_owner_idx` ON `naqla2_marketplace_listings` (`ownerUserId`);

CREATE TABLE IF NOT EXISTS `naqla2_interest_requests` (
  `id` int AUTO_INCREMENT NOT NULL,
  `listingId` int NOT NULL,
  `requesterUserId` int NOT NULL,
  `ownerUserId` int NOT NULL,
  `message` text NOT NULL,
  `status` enum('submitted','accepted','declined','withdrawn') NOT NULL DEFAULT 'submitted',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `naqla2_interest_requests_id` PRIMARY KEY(`id`)
);

CREATE INDEX `naqla2_interest_listing_idx` ON `naqla2_interest_requests` (`listingId`);
CREATE INDEX `naqla2_interest_requester_idx` ON `naqla2_interest_requests` (`requesterUserId`);
CREATE INDEX `naqla2_interest_owner_idx` ON `naqla2_interest_requests` (`ownerUserId`);
