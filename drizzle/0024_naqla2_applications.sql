CREATE TABLE `naqla2_applications` (
  `id` int AUTO_INCREMENT NOT NULL,
  `matchCandidateId` int NOT NULL,
  `applicantUserId` int NOT NULL,
  `ownerUserId` int NOT NULL,
  `status` enum('draft','submitted','withdrawn','accepted','declined') NOT NULL DEFAULT 'draft',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `naqla2_applications_id` PRIMARY KEY(`id`),
  KEY `naqla2_application_candidate_idx` (`matchCandidateId`),
  KEY `naqla2_application_applicant_idx` (`applicantUserId`),
  KEY `naqla2_application_owner_idx` (`ownerUserId`)
);

CREATE TABLE `naqla2_application_versions` (
  `id` int AUTO_INCREMENT NOT NULL,
  `applicationId` int NOT NULL,
  `versionNumber` int NOT NULL,
  `payloadSha256` varchar(64) NOT NULL,
  `snapshot` json NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `naqla2_application_versions_id` PRIMARY KEY(`id`),
  CONSTRAINT `naqla2_application_version_unique` UNIQUE(`applicationId`,`versionNumber`),
  KEY `naqla2_application_version_application_idx` (`applicationId`)
);
