-- Migration: Enhance UPLINK1 with 10 Criteria + TRLs + Stage Gates
-- Date: 2026-02-07

-- Add 10 new evaluation criteria columns
ALTER TABLE idea_analysis 
ADD COLUMN technicalNoveltyScore DECIMAL(5,2) NOT NULL DEFAULT 0 COMMENT 'Weight: 15%',
ADD COLUMN socialImpactScore DECIMAL(5,2) NOT NULL DEFAULT 0 COMMENT 'Weight: 15%',
ADD COLUMN technicalFeasibilityScore DECIMAL(5,2) NOT NULL DEFAULT 0 COMMENT 'Weight: 12%',
ADD COLUMN commercialValueScore DECIMAL(5,2) NOT NULL DEFAULT 0 COMMENT 'Weight: 12%',
ADD COLUMN technicalRiskScore DECIMAL(5,2) NOT NULL DEFAULT 0 COMMENT 'Weight: 8%',
ADD COLUMN timeToMarketScore DECIMAL(5,2) NOT NULL DEFAULT 0 COMMENT 'Weight: 8%',
ADD COLUMN competitiveAdvantageScore DECIMAL(5,2) NOT NULL DEFAULT 0 COMMENT 'Weight: 5%',
ADD COLUMN organizationalReadinessScore DECIMAL(5,2) NOT NULL DEFAULT 0 COMMENT 'Weight: 5%';

-- Add Technology Readiness Level (TRL) columns
ALTER TABLE idea_analysis
ADD COLUMN trlLevel INT COMMENT '1-9 (1: Basic principles, 9: Actual system proven)',
ADD COLUMN trlDescription TEXT;

-- Add Stage Gate columns
ALTER TABLE idea_analysis
ADD COLUMN currentStageGate ENUM('ideation', 'scoping', 'business_case', 'development', 'testing', 'launch'),
ADD COLUMN stageGateRecommendation TEXT;

-- Update classification enum to reflect new thresholds (≥70%, 50-70%, <50%)
-- Note: MySQL doesn't support ALTER ENUM directly, so we'll keep the existing enum
-- The logic change will be in the application code

-- Drop old columns (optional - keep for backward compatibility)
-- ALTER TABLE idea_analysis DROP COLUMN noveltyScore;
-- ALTER TABLE idea_analysis DROP COLUMN impactScore;
-- ALTER TABLE idea_analysis DROP COLUMN feasibilityScore;
-- ALTER TABLE idea_analysis DROP COLUMN commercialScore;
