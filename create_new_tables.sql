-- ============================================
-- UPLINK2: CHALLENGES & MATCHING PLATFORM
-- ============================================

-- Challenges from Ministries and Companies
CREATE TABLE IF NOT EXISTS `challenges_new` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ownerId` INT NOT NULL,
  `ownerType` ENUM('ministry', 'company', 'government', 'ngo') NOT NULL,
  `ownerName` VARCHAR(300) NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `titleEn` VARCHAR(500),
  `description` TEXT NOT NULL,
  `descriptionEn` TEXT,
  `problemStatement` TEXT NOT NULL,
  `desiredOutcome` TEXT,
  `category` VARCHAR(100),
  `subCategory` VARCHAR(100),
  `industry` VARCHAR(100),
  `keywords` JSON,
  `eligibilityCriteria` JSON,
  `technicalRequirements` JSON,
  `constraints` JSON,
  `totalPrizePool` DECIMAL(15, 2),
  `currency` VARCHAR(10) DEFAULT 'SAR',
  `prizeDistribution` JSON,
  `fundingAvailable` DECIMAL(15, 2),
  `startDate` TIMESTAMP NOT NULL,
  `endDate` TIMESTAMP NOT NULL,
  `submissionDeadline` TIMESTAMP NOT NULL,
  `evaluationDeadline` TIMESTAMP,
  `announcementDate` TIMESTAMP,
  `status` ENUM('draft', 'open', 'submission_closed', 'evaluating', 'completed', 'cancelled') DEFAULT 'draft',
  `submissionsCount` INT DEFAULT 0,
  `participantsCount` INT DEFAULT 0,
  `views` INT DEFAULT 0,
  `documents` JSON,
  `images` JSON,
  `publishedAt` TIMESTAMP,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

-- Challenge Submissions
CREATE TABLE IF NOT EXISTS `challenge_submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `challengeId` INT NOT NULL,
  `userId` INT NOT NULL,
  `ideaId` INT,
  `title` VARCHAR(500) NOT NULL,
  `description` TEXT NOT NULL,
  `solution` TEXT NOT NULL,
  `expectedImpact` TEXT,
  `teamName` VARCHAR(200),
  `teamMembers` JSON,
  `teamSize` INT DEFAULT 1,
  `documents` JSON,
  `images` JSON,
  `video` TEXT,
  `prototype` TEXT,
  `evaluationScore` DECIMAL(5, 2),
  `evaluationNotes` TEXT,
  `rank` INT,
  `status` ENUM('draft', 'submitted', 'under_review', 'shortlisted', 'winner', 'rejected') DEFAULT 'draft',
  `submittedAt` TIMESTAMP,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

-- Hackathons & Events
CREATE TABLE IF NOT EXISTS `hackathons` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `organizerId` INT NOT NULL,
  `organizerName` VARCHAR(300) NOT NULL,
  `name` VARCHAR(500) NOT NULL,
  `nameEn` VARCHAR(500),
  `description` TEXT NOT NULL,
  `descriptionEn` TEXT,
  `theme` VARCHAR(200),
  `type` ENUM('hackathon', 'workshop', 'conference', 'competition', 'bootcamp') NOT NULL,
  `format` ENUM('online', 'onsite', 'hybrid') NOT NULL,
  `country` VARCHAR(100),
  `city` VARCHAR(100),
  `venue` VARCHAR(300),
  `address` TEXT,
  `startDate` TIMESTAMP NOT NULL,
  `endDate` TIMESTAMP NOT NULL,
  `registrationDeadline` TIMESTAMP NOT NULL,
  `maxParticipants` INT,
  `currentParticipants` INT DEFAULT 0,
  `totalPrizePool` DECIMAL(15, 2),
  `currency` VARCHAR(10) DEFAULT 'SAR',
  `prizes` JSON,
  `eligibilityCriteria` JSON,
  `requiredSkills` JSON,
  `sponsors` JSON,
  `status` ENUM('draft', 'registration_open', 'registration_closed', 'ongoing', 'completed', 'cancelled') DEFAULT 'draft',
  `agenda` JSON,
  `documents` JSON,
  `images` JSON,
  `views` INT DEFAULT 0,
  `publishedAt` TIMESTAMP,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

-- Hackathon Registrations
CREATE TABLE IF NOT EXISTS `hackathon_registrations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `hackathonId` INT NOT NULL,
  `userId` INT NOT NULL,
  `teamName` VARCHAR(200),
  `teamMembers` JSON,
  `teamSize` INT DEFAULT 1,
  `motivation` TEXT,
  `skills` JSON,
  `experience` TEXT,
  `status` ENUM('pending', 'approved', 'rejected', 'waitlisted', 'cancelled') DEFAULT 'pending',
  `checkedIn` BOOLEAN DEFAULT FALSE,
  `checkInTime` TIMESTAMP,
  `registeredAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

-- Smart Matching Requests
CREATE TABLE IF NOT EXISTS `matching_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `userType` ENUM('innovator', 'investor', 'company', 'government') NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `description` TEXT NOT NULL,
  `lookingFor` ENUM('investor', 'co_founder', 'technical_partner', 'business_partner', 'mentor', 'innovation', 'startup', 'technology') NOT NULL,
  `industry` JSON,
  `stage` JSON,
  `location` JSON,
  `fundingRange` JSON,
  `keywords` JSON,
  `requiredSkills` JSON,
  `preferredAttributes` JSON,
  `status` ENUM('active', 'matched', 'paused', 'closed') DEFAULT 'active',
  `matchesCount` INT DEFAULT 0,
  `expiresAt` TIMESTAMP,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

-- Matching Results
CREATE TABLE IF NOT EXISTS `matching_results` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `requestId` INT NOT NULL,
  `matchedUserId` INT,
  `matchedProjectId` INT,
  `matchedIdeaId` INT,
  `matchScore` DECIMAL(5, 2) NOT NULL,
  `matchingFactors` JSON,
  `aiAnalysis` TEXT,
  `status` ENUM('suggested', 'viewed', 'contacted', 'accepted', 'rejected', 'expired') DEFAULT 'suggested',
  `viewedAt` TIMESTAMP,
  `contactedAt` TIMESTAMP,
  `respondedAt` TIMESTAMP,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

-- Networking Connections
CREATE TABLE IF NOT EXISTS `networking_connections` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userAId` INT NOT NULL,
  `userBId` INT NOT NULL,
  `connectionType` ENUM('match', 'challenge', 'hackathon', 'direct', 'referral') NOT NULL,
  `contextId` INT,
  `status` ENUM('pending', 'accepted', 'rejected', 'blocked') DEFAULT 'pending',
  `message` TEXT,
  `notes` TEXT,
  `acceptedAt` TIMESTAMP,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- UPLINK3: MARKETPLACE & EXCHANGE
-- ============================================

-- Marketplace Assets
CREATE TABLE IF NOT EXISTS `marketplace_assets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ownerId` INT NOT NULL,
  `assetType` ENUM('license', 'product', 'acquisition') NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `titleEn` VARCHAR(500),
  `description` TEXT NOT NULL,
  `descriptionEn` TEXT,
  `price` DECIMAL(15, 2) NOT NULL,
  `currency` VARCHAR(10) DEFAULT 'SAR',
  `pricingModel` ENUM('fixed', 'negotiable', 'royalty', 'subscription', 'revenue_share') DEFAULT 'fixed',
  `licenseType` ENUM('exclusive', 'non_exclusive', 'sole', 'sublicensable'),
  `licenseDuration` VARCHAR(100),
  `royaltyRate` DECIMAL(5, 2),
  `productCategory` VARCHAR(100),
  `productCondition` ENUM('new', 'used', 'refurbished'),
  `inventory` INT,
  `companyName` VARCHAR(300),
  `companyValuation` DECIMAL(15, 2),
  `revenue` DECIMAL(15, 2),
  `employees` INT,
  `foundedYear` INT,
  `category` VARCHAR(100),
  `industry` VARCHAR(100),
  `keywords` JSON,
  `ipRegistrationId` INT,
  `patentNumber` VARCHAR(100),
  `trademarkNumber` VARCHAR(100),
  `dueDiligenceReport` TEXT,
  `financialStatements` JSON,
  `legalDocuments` JSON,
  `images` JSON,
  `videos` JSON,
  `documents` JSON,
  `status` ENUM('draft', 'pending_review', 'active', 'sold', 'delisted', 'expired') DEFAULT 'draft',
  `views` INT DEFAULT 0,
  `inquiries` INT DEFAULT 0,
  `listedAt` TIMESTAMP,
  `soldAt` TIMESTAMP,
  `expiresAt` TIMESTAMP,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

-- Asset Inquiries
CREATE TABLE IF NOT EXISTS `asset_inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `assetId` INT NOT NULL,
  `buyerId` INT NOT NULL,
  `message` TEXT NOT NULL,
  `offerPrice` DECIMAL(15, 2),
  `proposedTerms` TEXT,
  `status` ENUM('pending', 'responded', 'negotiating', 'accepted', 'rejected', 'expired') DEFAULT 'pending',
  `sellerResponse` TEXT,
  `respondedAt` TIMESTAMP,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

-- Asset Transactions
CREATE TABLE IF NOT EXISTS `asset_transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `assetId` INT NOT NULL,
  `sellerId` INT NOT NULL,
  `buyerId` INT NOT NULL,
  `finalPrice` DECIMAL(15, 2) NOT NULL,
  `currency` VARCHAR(10) DEFAULT 'SAR',
  `contractId` INT,
  `escrowId` INT,
  `status` ENUM('pending', 'escrow_funded', 'in_progress', 'completed', 'disputed', 'cancelled', 'refunded') DEFAULT 'pending',
  `initiatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `completedAt` TIMESTAMP,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- ANALYTICS & REPORTING LAYER
-- ============================================

-- Analytics Events
CREATE TABLE IF NOT EXISTS `analytics_events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `eventType` ENUM('page_view', 'idea_submitted', 'idea_analyzed', 'challenge_created', 'challenge_submitted', 'hackathon_registered', 'match_suggested', 'match_accepted', 'asset_listed', 'asset_viewed', 'asset_sold', 'contract_created', 'contract_signed', 'escrow_funded', 'user_registered', 'user_login') NOT NULL,
  `userId` INT,
  `sessionId` VARCHAR(100),
  `ipAddress` VARCHAR(45),
  `userAgent` TEXT,
  `entityType` VARCHAR(50),
  `entityId` INT,
  `metadata` JSON,
  `country` VARCHAR(100),
  `city` VARCHAR(100),
  `eventTimestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- System Metrics
CREATE TABLE IF NOT EXISTS `system_metrics` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `date` TIMESTAMP NOT NULL UNIQUE,
  `totalUsers` INT DEFAULT 0,
  `newUsers` INT DEFAULT 0,
  `activeUsers` INT DEFAULT 0,
  `ideasSubmitted` INT DEFAULT 0,
  `ideasAnalyzed` INT DEFAULT 0,
  `innovationsCount` INT DEFAULT 0,
  `commercialCount` INT DEFAULT 0,
  `weakCount` INT DEFAULT 0,
  `challengesActive` INT DEFAULT 0,
  `challengeSubmissions` INT DEFAULT 0,
  `hackathonsActive` INT DEFAULT 0,
  `hackathonRegistrations` INT DEFAULT 0,
  `matchesMade` INT DEFAULT 0,
  `connectionsCreated` INT DEFAULT 0,
  `assetsListed` INT DEFAULT 0,
  `assetsActive` INT DEFAULT 0,
  `assetsSold` INT DEFAULT 0,
  `totalTransactionValue` DECIMAL(15, 2) DEFAULT 0,
  `contractsCreated` INT DEFAULT 0,
  `contractsSigned` INT DEFAULT 0,
  `pageViews` INT DEFAULT 0,
  `avgSessionDuration` INT DEFAULT 0,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);
