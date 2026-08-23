-- Align the physical users table with the existing Drizzle contract.
-- Additive only: no data rewrite, drop, or production seed.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS entity_type ENUM('individual_innovator','individual_investor','local_company','foreign_company','government_entity','international_organization','research_institution','university','startup','ngo') DEFAULT 'individual_innovator',
  ADD COLUMN IF NOT EXISTS commercial_registration VARCHAR(100),
  ADD COLUMN IF NOT EXISTS license_number VARCHAR(100),
  ADD COLUMN IF NOT EXISTS tax_number VARCHAR(100),
  ADD COLUMN IF NOT EXISTS entity_country VARCHAR(100),
  ADD COLUMN IF NOT EXISTS entity_city VARCHAR(100),
  ADD COLUMN IF NOT EXISTS entity_address TEXT,
  ADD COLUMN IF NOT EXISTS entity_phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS entity_email VARCHAR(320),
  ADD COLUMN IF NOT EXISTS authorized_person_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS authorized_person_position VARCHAR(255),
  ADD COLUMN IF NOT EXISTS entity_documents JSON,
  ADD COLUMN IF NOT EXISTS rememberMe INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS mfaEnabled INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS mfaSecret VARCHAR(255),
  ADD COLUMN IF NOT EXISTS remember_me INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS mfa_enabled INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS mfa_secret VARCHAR(255);
