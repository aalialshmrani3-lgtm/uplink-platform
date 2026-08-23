CREATE TABLE IF NOT EXISTS `organization_memberships` (
  `id` int AUTO_INCREMENT NOT NULL,
  `organizationId` int NOT NULL,
  `userId` int NOT NULL,
  `role` enum('owner','manager','member','reviewer') NOT NULL DEFAULT 'member',
  `status` enum('active','revoked') NOT NULL DEFAULT 'active',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `organization_memberships_id` PRIMARY KEY(`id`)
);
CREATE INDEX `organization_membership_org_idx` ON `organization_memberships` (`organizationId`);
CREATE INDEX `organization_membership_user_idx` ON `organization_memberships` (`userId`);

CREATE TABLE IF NOT EXISTS `organization_invitations` (
  `id` int AUTO_INCREMENT NOT NULL,
  `organizationId` int NOT NULL,
  `invitedEmail` varchar(320) NOT NULL,
  `role` enum('manager','member','reviewer') NOT NULL DEFAULT 'member',
  `invitedByUserId` int NOT NULL,
  `status` enum('pending','accepted','revoked') NOT NULL DEFAULT 'pending',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `organization_invitations_id` PRIMARY KEY(`id`)
);
CREATE INDEX `organization_invitation_org_idx` ON `organization_invitations` (`organizationId`);
CREATE INDEX `organization_invitation_email_idx` ON `organization_invitations` (`invitedEmail`);

CREATE TABLE IF NOT EXISTS `user_active_contexts` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `organizationId` int NOT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `user_active_contexts_id` PRIMARY KEY(`id`)
);
CREATE INDEX `user_active_context_user_idx` ON `user_active_contexts` (`userId`);
