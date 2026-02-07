-- إضافة حقول الصفة الاعتبارية لجدول users
ALTER TABLE users ADD COLUMN IF NOT EXISTS entity_type ENUM(
  'individual_innovator',
  'individual_investor', 
  'local_company',
  'foreign_company',
  'government_entity',
  'international_organization',
  'research_institution',
  'university',
  'startup',
  'ngo'
) DEFAULT 'individual_innovator' AFTER role;

ALTER TABLE users ADD COLUMN IF NOT EXISTS commercial_registration VARCHAR(100) AFTER entity_type;
ALTER TABLE users ADD COLUMN IF NOT EXISTS license_number VARCHAR(100) AFTER commercial_registration;
ALTER TABLE users ADD COLUMN IF NOT EXISTS tax_number VARCHAR(100) AFTER license_number;
ALTER TABLE users ADD COLUMN IF NOT EXISTS entity_country VARCHAR(100) AFTER tax_number;
ALTER TABLE users ADD COLUMN IF NOT EXISTS entity_city VARCHAR(100) AFTER entity_country;
ALTER TABLE users ADD COLUMN IF NOT EXISTS entity_address TEXT AFTER entity_city;
ALTER TABLE users ADD COLUMN IF NOT EXISTS entity_phone VARCHAR(50) AFTER entity_address;
ALTER TABLE users ADD COLUMN IF NOT EXISTS entity_email VARCHAR(320) AFTER entity_phone;
ALTER TABLE users ADD COLUMN IF NOT EXISTS authorized_person_name VARCHAR(255) AFTER entity_email;
ALTER TABLE users ADD COLUMN IF NOT EXISTS authorized_person_position VARCHAR(255) AFTER authorized_person_name;
ALTER TABLE users ADD COLUMN IF NOT EXISTS entity_documents JSON AFTER authorized_person_position;

-- إضافة جدول events لطلبات الفعاليات
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organizer_id INT NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  event_type ENUM('conference', 'workshop', 'hackathon', 'seminar', 'webinar', 'networking', 'exhibition', 'competition', 'training') NOT NULL,
  delivery_mode ENUM('online', 'in_person', 'hybrid') NOT NULL,
  category VARCHAR(100),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  location TEXT,
  online_platform VARCHAR(255),
  meeting_link TEXT,
  capacity INT,
  registration_deadline TIMESTAMP,
  registration_fee DECIMAL(10, 2) DEFAULT 0,
  target_audience TEXT,
  objectives TEXT,
  agenda JSON,
  speakers JSON,
  sponsors_needed BOOLEAN DEFAULT FALSE,
  sponsor_packages JSON,
  confirmed_sponsors JSON,
  innovators_needed BOOLEAN DEFAULT FALSE,
  required_skills JSON,
  matched_innovators JSON,
  status ENUM('draft', 'pending_approval', 'approved', 'rejected', 'published', 'ongoing', 'completed', 'cancelled') DEFAULT 'draft',
  approval_date TIMESTAMP,
  approved_by INT,
  rejection_reason TEXT,
  contract_id INT,
  images JSON,
  documents JSON,
  website TEXT,
  social_media JSON,
  registration_count INT DEFAULT 0,
  attendance_count INT DEFAULT 0,
  feedback_score DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- إضافة جدول event_registrations لتسجيلات الفعاليات
CREATE TABLE IF NOT EXISTS event_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  user_id INT NOT NULL,
  registration_type ENUM('attendee', 'speaker', 'sponsor', 'volunteer', 'exhibitor') NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'attended', 'no_show') DEFAULT 'pending',
  payment_status ENUM('not_required', 'pending', 'paid', 'refunded') DEFAULT 'not_required',
  payment_amount DECIMAL(10, 2),
  special_requirements TEXT,
  dietary_preferences VARCHAR(255),
  t_shirt_size VARCHAR(10),
  attendance_certificate_issued BOOLEAN DEFAULT FALSE,
  feedback TEXT,
  rating INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  UNIQUE KEY unique_event_user (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- إضافة حقل contract_type لجدول contracts
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS contract_type ENUM(
  'idea_contract',
  'challenge_contract', 
  'event_contract',
  'asset_license',
  'asset_purchase',
  'acquisition',
  'partnership',
  'service',
  'other'
) DEFAULT 'other' AFTER id;

ALTER TABLE contracts ADD COLUMN IF NOT EXISTS source_type ENUM(
  'uplink1_idea',
  'uplink2_challenge',
  'uplink2_event',
  'uplink3_asset',
  'manual'
) DEFAULT 'manual' AFTER contract_type;

ALTER TABLE contracts ADD COLUMN IF NOT EXISTS source_id INT AFTER source_type;

-- إضافة جدول sponsor_requests لطلبات الرعاية
CREATE TABLE IF NOT EXISTS sponsor_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  sponsor_id INT NOT NULL,
  package_type VARCHAR(100),
  package_value DECIMAL(12, 2),
  benefits JSON,
  proposal_document TEXT,
  status ENUM('pending', 'under_review', 'accepted', 'rejected', 'contract_signed') DEFAULT 'pending',
  reviewed_by INT,
  review_date TIMESTAMP,
  review_notes TEXT,
  contract_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (sponsor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- إضافة جدول innovator_applications لطلبات المبتكرين للفعاليات
CREATE TABLE IF NOT EXISTS innovator_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  innovator_id INT NOT NULL,
  application_type ENUM('participant', 'presenter', 'competitor') NOT NULL,
  project_title VARCHAR(500),
  project_description TEXT,
  skills JSON,
  portfolio_link TEXT,
  motivation TEXT,
  status ENUM('pending', 'under_review', 'accepted', 'rejected', 'waitlist') DEFAULT 'pending',
  reviewed_by INT,
  review_date TIMESTAMP,
  review_score DECIMAL(5, 2),
  review_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (innovator_id) REFERENCES users(id) ON DELETE CASCADE
);
