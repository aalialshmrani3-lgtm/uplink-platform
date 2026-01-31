-- ============================================================================
-- UPLINK 5.0 - AI Training Database Schema
-- Table: ideas_outcomes (PostgreSQL)
-- Purpose: Store classified project outcomes for model training
-- ============================================================================

-- Main table: ideas_outcomes
CREATE TABLE IF NOT EXISTS ideas_outcomes (
    -- Primary key
    id SERIAL PRIMARY KEY,
    
    -- Idea identification
    idea_id INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    
    -- Numeric features
    budget DECIMAL(15, 2) NOT NULL DEFAULT 0,
    team_size INTEGER NOT NULL DEFAULT 0,
    timeline_months INTEGER NOT NULL DEFAULT 0,
    
    -- Scores (0-100)
    market_demand INTEGER CHECK (market_demand >= 0 AND market_demand <= 100),
    technical_feasibility INTEGER CHECK (technical_feasibility >= 0 AND technical_feasibility <= 100),
    competitive_advantage INTEGER CHECK (competitive_advantage >= 0 AND competitive_advantage <= 100),
    user_engagement INTEGER CHECK (user_engagement >= 0 AND user_engagement <= 100),
    
    -- Text features
    keywords TEXT[] DEFAULT '{}',  -- Array of keywords/tags
    tags_count INTEGER GENERATED ALWAYS AS (array_length(keywords, 1)) STORED,
    
    -- Validation metrics (0.0-1.0)
    hypothesis_validation_rate DECIMAL(3, 2) CHECK (hypothesis_validation_rate >= 0 AND hypothesis_validation_rate <= 1),
    rat_completion_rate DECIMAL(3, 2) CHECK (rat_completion_rate >= 0 AND rat_completion_rate <= 1),
    
    -- Outcome classification
    success BOOLEAN NOT NULL,  -- True = successful, False = failed
    success_score DECIMAL(3, 2) CHECK (success_score >= 0 AND success_score <= 1),  -- Probability of success
    
    -- Metadata
    sector VARCHAR(100),  -- e.g., "تعليم", "صحة", "زراعة", "تقنية"
    organization_id INTEGER,  -- Link to organizations table
    organization_name TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    classified_at TIMESTAMP WITH TIME ZONE,  -- When outcome was classified
    
    -- Audit
    classified_by INTEGER,  -- User ID who classified the outcome
    notes TEXT  -- Additional notes about classification
);

-- Indexes for performance
CREATE INDEX idx_ideas_outcomes_success ON ideas_outcomes(success);
CREATE INDEX idx_ideas_outcomes_sector ON ideas_outcomes(sector);
CREATE INDEX idx_ideas_outcomes_organization ON ideas_outcomes(organization_id);
CREATE INDEX idx_ideas_outcomes_created_at ON ideas_outcomes(created_at DESC);
CREATE INDEX idx_ideas_outcomes_keywords ON ideas_outcomes USING GIN(keywords);

-- Full-text search index for Arabic text
CREATE INDEX idx_ideas_outcomes_title_fts ON ideas_outcomes USING GIN(to_tsvector('arabic', title));
CREATE INDEX idx_ideas_outcomes_description_fts ON ideas_outcomes USING GIN(to_tsvector('arabic', description));

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ideas_outcomes_updated_at
    BEFORE UPDATE ON ideas_outcomes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Sample data for testing
-- ============================================================================

INSERT INTO ideas_outcomes (
    idea_id, title, description, budget, team_size, timeline_months,
    market_demand, technical_feasibility, competitive_advantage, user_engagement,
    keywords, hypothesis_validation_rate, rat_completion_rate,
    success, success_score, sector, organization_name
) VALUES
(1, 'منصة تعليمية تفاعلية للطلاب', 'منصة حديثة تستخدم الذكاء الاصطناعي لتخصيص المحتوى التعليمي', 
 500000, 5, 12, 85, 75, 70, 80, 
 ARRAY['تعليم', 'ذكاء اصطناعي', 'تفاعلي'], 0.8, 0.7,
 TRUE, 0.85, 'تعليم', 'جامعة الملك عبدالله'),

(2, 'نظام إدارة المشاريع الذكي', 'نظام يستخدم تعلم الآلة لتحسين إدارة المشاريع',
 300000, 3, 8, 70, 80, 60, 65,
 ARRAY['إدارة', 'تعلم آلي', 'مشاريع'], 0.6, 0.5,
 FALSE, 0.45, 'تقنية', 'أرامكو السعودية'),

(3, 'تطبيق توصيل الطعام الصحي', 'تطبيق يربط المطاعم الصحية بالمستخدمين',
 200000, 4, 6, 90, 85, 50, 75,
 ARRAY['صحة', 'توصيل', 'طعام'], 0.7, 0.8,
 TRUE, 0.75, 'صحة', 'صندوق الاستثمارات العامة');

-- ============================================================================
-- MongoDB equivalent schema (JSON document)
-- ============================================================================

/*
{
  "_id": ObjectId("..."),
  "idea_id": 1,
  "title": "منصة تعليمية تفاعلية للطلاب",
  "description": "منصة حديثة تستخدم الذكاء الاصطناعي لتخصيص المحتوى التعليمي",
  "budget": 500000,
  "team_size": 5,
  "timeline_months": 12,
  "market_demand": 85,
  "technical_feasibility": 75,
  "competitive_advantage": 70,
  "user_engagement": 80,
  "keywords": ["تعليم", "ذكاء اصطناعي", "تفاعلي"],
  "tags_count": 3,
  "hypothesis_validation_rate": 0.8,
  "rat_completion_rate": 0.7,
  "success": true,
  "success_score": 0.85,
  "sector": "تعليم",
  "organization_id": 1,
  "organization_name": "جامعة الملك عبدالله",
  "created_at": ISODate("2026-01-31T00:00:00Z"),
  "updated_at": ISODate("2026-01-31T00:00:00Z"),
  "classified_at": ISODate("2026-01-31T00:00:00Z"),
  "classified_by": 123,
  "notes": "مشروع ناجح بتقييم عالي"
}

// MongoDB indexes
db.ideas_outcomes.createIndex({ "success": 1 })
db.ideas_outcomes.createIndex({ "sector": 1 })
db.ideas_outcomes.createIndex({ "organization_id": 1 })
db.ideas_outcomes.createIndex({ "created_at": -1 })
db.ideas_outcomes.createIndex({ "keywords": 1 })
db.ideas_outcomes.createIndex({ "title": "text", "description": "text" }, { default_language: "arabic" })
*/

-- ============================================================================
-- Views for analytics
-- ============================================================================

-- Success rate by sector
CREATE OR REPLACE VIEW success_rate_by_sector AS
SELECT 
    sector,
    COUNT(*) as total_ideas,
    SUM(CASE WHEN success THEN 1 ELSE 0 END) as successful_ideas,
    ROUND(AVG(CASE WHEN success THEN 1.0 ELSE 0.0 END) * 100, 2) as success_rate_percent,
    ROUND(AVG(success_score), 2) as avg_success_score
FROM ideas_outcomes
WHERE sector IS NOT NULL
GROUP BY sector
ORDER BY success_rate_percent DESC;

-- Success rate by organization
CREATE OR REPLACE VIEW success_rate_by_organization AS
SELECT 
    organization_name,
    COUNT(*) as total_ideas,
    SUM(CASE WHEN success THEN 1 ELSE 0 END) as successful_ideas,
    ROUND(AVG(CASE WHEN success THEN 1.0 ELSE 0.0 END) * 100, 2) as success_rate_percent,
    ROUND(AVG(success_score), 2) as avg_success_score
FROM ideas_outcomes
WHERE organization_name IS NOT NULL
GROUP BY organization_name
ORDER BY success_rate_percent DESC;

-- Recent classifications
CREATE OR REPLACE VIEW recent_classifications AS
SELECT 
    id,
    idea_id,
    title,
    sector,
    success,
    success_score,
    classified_at,
    organization_name
FROM ideas_outcomes
ORDER BY classified_at DESC NULLS LAST, created_at DESC
LIMIT 100;

-- ============================================================================
-- Functions for data quality
-- ============================================================================

-- Function to validate idea data before insert/update
CREATE OR REPLACE FUNCTION validate_idea_outcome()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate budget is positive
    IF NEW.budget < 0 THEN
        RAISE EXCEPTION 'Budget must be positive';
    END IF;
    
    -- Validate team_size is positive
    IF NEW.team_size <= 0 THEN
        RAISE EXCEPTION 'Team size must be greater than 0';
    END IF;
    
    -- Validate timeline_months is positive
    IF NEW.timeline_months <= 0 THEN
        RAISE EXCEPTION 'Timeline must be greater than 0 months';
    END IF;
    
    -- Validate title and description are not empty
    IF LENGTH(TRIM(NEW.title)) = 0 THEN
        RAISE EXCEPTION 'Title cannot be empty';
    END IF;
    
    IF LENGTH(TRIM(NEW.description)) = 0 THEN
        RAISE EXCEPTION 'Description cannot be empty';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_idea_outcome_before_insert
    BEFORE INSERT OR UPDATE ON ideas_outcomes
    FOR EACH ROW
    EXECUTE FUNCTION validate_idea_outcome();

-- ============================================================================
-- Query examples
-- ============================================================================

-- Get all successful ideas
-- SELECT * FROM ideas_outcomes WHERE success = TRUE;

-- Get ideas by sector
-- SELECT * FROM ideas_outcomes WHERE sector = 'تعليم';

-- Get ideas with high success score
-- SELECT * FROM ideas_outcomes WHERE success_score >= 0.8 ORDER BY success_score DESC;

-- Full-text search in Arabic
-- SELECT * FROM ideas_outcomes WHERE to_tsvector('arabic', title || ' ' || description) @@ to_tsquery('arabic', 'تعليم | ذكاء');

-- Get training data for model
-- SELECT 
--     title, description, budget, team_size, timeline_months,
--     market_demand, technical_feasibility, competitive_advantage, user_engagement,
--     tags_count, hypothesis_validation_rate, rat_completion_rate,
--     success
-- FROM ideas_outcomes
-- WHERE classified_at IS NOT NULL
-- ORDER BY created_at DESC;
