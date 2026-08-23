-- Phase 2.2D: additive advisory-only Copilot records. Canonical application
-- state, eligibility, decisions and immutable historical versions are untouched.
ALTER TABLE naqla2_application_versions
  ADD COLUMN IF NOT EXISTS actor_id INT NULL,
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP NULL,
  ADD COLUMN IF NOT EXISTS requirement_snapshot JSON NULL,
  ADD COLUMN IF NOT EXISTS evidence_references JSON NULL,
  ADD COLUMN IF NOT EXISTS provenance JSON NULL;

ALTER TABLE naqla2_applications
  ADD COLUMN IF NOT EXISTS tenant_id INT NULL;

CREATE INDEX IF NOT EXISTS naqla2_application_tenant_idx ON naqla2_applications (tenant_id);

ALTER TABLE naqla2_applications
  ADD COLUMN IF NOT EXISTS reviewer_tenant_id INT NULL;

CREATE INDEX IF NOT EXISTS naqla2_application_reviewer_tenant_idx ON naqla2_applications (reviewer_tenant_id);

CREATE TABLE IF NOT EXISTS naqla2_copilot_runs (
  id INT AUTO_INCREMENT NOT NULL,
  tenant_id INT NOT NULL,
  active_context_id INT NOT NULL,
  actor_id INT NOT NULL,
  actor_role ENUM('reviewer','applicant') NOT NULL,
  mode ENUM('reviewer_assist','applicant_assist') NOT NULL,
  application_id INT NOT NULL,
  application_version_id INT NOT NULL,
  policy_version VARCHAR(64) NOT NULL,
  source_snapshot_hash VARCHAR(64) NOT NULL,
  schema_version VARCHAR(64) NOT NULL,
  provider_metadata JSON NULL,
  prompt_version VARCHAR(64) NULL,
  status ENUM('completed','stale','revoked_source','recompute_required','failed') NOT NULL DEFAULT 'completed',
  idempotency_key VARCHAR(128) NOT NULL,
  failure_code VARCHAR(96) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  stale_at TIMESTAMP NULL,
  CONSTRAINT naqla2_copilot_runs_id PRIMARY KEY(id),
  CONSTRAINT naqla2_copilot_run_replay_uq UNIQUE(idempotency_key),
  KEY naqla2_copilot_run_application_idx (application_id),
  KEY naqla2_copilot_run_actor_idx (actor_id),
  KEY naqla2_copilot_run_tenant_idx (tenant_id)
);

CREATE TABLE IF NOT EXISTS naqla2_copilot_suggestions (
  id INT AUTO_INCREMENT NOT NULL,
  copilot_run_id INT NOT NULL,
  audience ENUM('reviewer','applicant') NOT NULL,
  kind ENUM('information_gap','evidence_gap','clarification_draft','improvement_draft','next_best_action','limitation') NOT NULL,
  status ENUM('generated','accepted_as_draft','dismissed') NOT NULL DEFAULT 'generated',
  body TEXT NOT NULL,
  deterministic_rule_refs JSON NOT NULL,
  source_refs JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actioned_at TIMESTAMP NULL,
  CONSTRAINT naqla2_copilot_suggestions_id PRIMARY KEY(id),
  KEY naqla2_copilot_suggestion_run_idx (copilot_run_id)
);

CREATE TABLE IF NOT EXISTS naqla2_reviewer_clarification_requests (
  id INT AUTO_INCREMENT NOT NULL,
  application_id INT NOT NULL,
  application_version_id INT NOT NULL,
  reviewer_user_id INT NOT NULL,
  suggestion_id INT NULL,
  question TEXT NOT NULL,
  status ENUM('draft','sent','answered','closed') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  sent_by_user_id INT NULL,
  sent_at TIMESTAMP NULL,
  CONSTRAINT naqla2_reviewer_clarification_requests_id PRIMARY KEY(id),
  KEY naqla2_clarification_application_idx (application_id),
  KEY naqla2_clarification_reviewer_idx (reviewer_user_id)
);

CREATE TABLE IF NOT EXISTS naqla2_applicant_clarification_responses (
  id INT AUTO_INCREMENT NOT NULL,
  clarification_request_id INT NOT NULL,
  applicant_user_id INT NOT NULL,
  response_text TEXT NOT NULL,
  status ENUM('draft','submitted') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP NULL,
  CONSTRAINT naqla2_applicant_clarification_responses_id PRIMARY KEY(id),
  KEY naqla2_clarification_response_request_idx (clarification_request_id),
  KEY naqla2_clarification_response_applicant_idx (applicant_user_id)
);

CREATE TABLE IF NOT EXISTS naqla2_applicant_copilot_drafts (
  id INT AUTO_INCREMENT NOT NULL,
  application_id INT NOT NULL,
  applicant_user_id INT NOT NULL,
  base_application_version_id INT NOT NULL,
  suggestion_id INT NULL,
  content TEXT NOT NULL,
  status ENUM('draft','submitted') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP NULL,
  CONSTRAINT naqla2_applicant_copilot_drafts_id PRIMARY KEY(id),
  KEY naqla2_copilot_draft_application_idx (application_id),
  KEY naqla2_copilot_draft_applicant_idx (applicant_user_id)
);

CREATE TABLE IF NOT EXISTS naqla2_application_reviewer_assignments (
  id INT AUTO_INCREMENT NOT NULL,
  application_id INT NOT NULL,
  organization_id INT NOT NULL,
  reviewer_user_id INT NOT NULL,
  assigned_by_user_id INT NOT NULL,
  status ENUM('active','revoked') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP NULL,
  CONSTRAINT naqla2_application_reviewer_assignments_id PRIMARY KEY(id),
  CONSTRAINT naqla2_application_reviewer_assignment_unique UNIQUE(application_id, reviewer_user_id),
  KEY naqla2_application_reviewer_org_idx (organization_id),
  KEY naqla2_application_reviewer_user_idx (reviewer_user_id)
);

CREATE TABLE IF NOT EXISTS naqla2_application_evidence_references (
  id INT AUTO_INCREMENT NOT NULL,
  application_version_id INT NOT NULL,
  evidence_id INT NOT NULL,
  applicant_user_id INT NOT NULL,
  allow_reviewer INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT naqla2_application_evidence_references_id PRIMARY KEY(id),
  CONSTRAINT naqla2_application_evidence_reference_unique UNIQUE(application_version_id, evidence_id),
  KEY naqla2_application_evidence_reference_version_idx (application_version_id),
  KEY naqla2_application_evidence_reference_evidence_idx (evidence_id)
);
