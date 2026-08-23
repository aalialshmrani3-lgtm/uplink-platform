-- Narrow additive contract migration for the already-used matching request router.
-- It exists to make a clean MariaDB migration chain equivalent to Drizzle.
CREATE TABLE IF NOT EXISTS matching_requests (
  id INT AUTO_INCREMENT NOT NULL,
  userId INT NOT NULL,
  userType ENUM('innovator','investor','company','government') NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  lookingFor ENUM('investor','co_founder','technical_partner','business_partner','mentor','innovation','startup','technology') NOT NULL,
  industry JSON,
  stage JSON,
  location JSON,
  fundingRange JSON,
  keywords JSON,
  requiredSkills JSON,
  preferredAttributes JSON,
  status ENUM('active','matched','paused','closed') DEFAULT 'active',
  matchesCount INT DEFAULT 0,
  expiresAt TIMESTAMP NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT matching_requests_id PRIMARY KEY(id)
);
