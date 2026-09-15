-- NLAMS Database Schema - Simplified Version (Without PostGIS)
-- For quick deployment when PostGIS is not available

-- Drop existing tables if recreating
DROP TABLE IF EXISTS integration_logs CASCADE;
DROP TABLE IF EXISTS field_entries CASCADE;
DROP TABLE IF EXISTS grievances CASCADE;
DROP TABLE IF EXISTS landowner_users CASCADE;
DROP TABLE IF EXISTS land_offers CASCADE;
DROP TABLE IF EXISTS ripple_impacts CASCADE;
DROP TABLE IF EXISTS suitability_analyses CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS affected_families CASCADE;
DROP TABLE IF EXISTS compensation CASCADE;
DROP TABLE IF EXISTS awards CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS workflow_stages CASCADE;
DROP TABLE IF EXISTS proposals CASCADE;
DROP TABLE IF EXISTS land_parcels CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Types
CREATE TYPE user_role AS ENUM (
  'central_admin', 'state_officer', 'district_collector', 
  'field_officer', 'project_agency'
);

CREATE TYPE acquisition_stage AS ENUM (
  'project_proposal', 'section_4_intent', 'section_11_survey', 
  'section_19_declaration', 'section_23_award', 'section_38_possession',
  'compensation_disbursement', 'rr_completion'
);

CREATE TYPE proposal_status AS ENUM (
  'draft', 'submitted', 'under_review', 'approved', 'rejected', 'withdrawn'
);

CREATE TYPE land_use AS ENUM (
  'agricultural', 'residential', 'commercial', 'industrial', 
  'forest', 'wasteland', 'water_body'
);

CREATE TYPE project_type AS ENUM (
  'highway', 'railway', 'airport', 'metro', 'port', 'industrial_corridor',
  'smart_city', 'defense', 'irrigation', 'mining', 'power_plant', 
  'government_building', 'other'
);

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL,
  department VARCHAR(255),
  district VARCHAR(100),
  state VARCHAR(100),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_code VARCHAR(50) UNIQUE NOT NULL,
  project_name VARCHAR(500) NOT NULL,
  project_type project_type NOT NULL,
  acquiring_agency VARCHAR(255) NOT NULL,
  purpose TEXT,
  district VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  total_area_required_ha DECIMAL(12,4),
  current_stage acquisition_stage DEFAULT 'project_proposal',
  start_date DATE,
  target_completion_date DATE,
  actual_completion_date DATE,
  total_estimated_cost_lakh DECIMAL(15,2),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Land Parcels Table (Simplified - no PostGIS geometry)
CREATE TABLE land_parcels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  survey_number VARCHAR(100) NOT NULL,
  patta_number VARCHAR(100),
  village VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  taluk VARCHAR(100),
  area_ha DECIMAL(10,4) NOT NULL,
  land_use land_use,
  owner_name VARCHAR(255),
  latitude DECIMAL(10,7),  -- Instead of PostGIS geometry
  longitude DECIMAL(11,7), -- Instead of PostGIS geometry
  current_stage acquisition_stage DEFAULT 'project_proposal',
  market_value_lakh DECIMAL(12,2),
  compensation_assessed_lakh DECIMAL(12,2),
  compensation_paid_lakh DECIMAL(12,2) DEFAULT 0,
  possession_date DATE,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_parcels_project ON land_parcels(project_id);
CREATE INDEX idx_parcels_survey ON land_parcels(survey_number);
CREATE INDEX idx_parcels_stage ON land_parcels(current_stage);

-- Rest of the tables remain the same...
-- Proposals, workflow_stages, notifications, awards, compensation, 
-- affected_families, documents, milestones, alerts, audit_logs, etc.

CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_number VARCHAR(50) UNIQUE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  submitted_by UUID REFERENCES users(id),
  current_status proposal_status DEFAULT 'draft',
  submitted_at TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL,
  section_reference VARCHAR(50),
  gazette_number VARCHAR(100),
  published_date DATE,
  expiry_date DATE,
  content TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  severity VARCHAR(20) DEFAULT 'medium',
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  resolved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  record_type VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_time ON audit_logs(created_at);

CREATE TABLE suitability_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  analysis_date DATE NOT NULL,
  settlement_score INTEGER CHECK(settlement_score BETWEEN 0 AND 100),
  agriculture_score INTEGER CHECK(agriculture_score BETWEEN 0 AND 100),
  forest_score INTEGER CHECK(forest_score BETWEEN 0 AND 100),
  overall_score INTEGER CHECK(overall_score BETWEEN 0 AND 100),
  recommendation VARCHAR(50),
  reasoning TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE landowner_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  aadhaar_last4 VARCHAR(4),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE integration_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_name VARCHAR(100) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  called_by UUID REFERENCES users(id),
  called_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (id, name, email, password_hash, role, department, district, state, is_active) VALUES
('a1000000-0000-0000-0000-000000000001', 'System Admin', 'admin@nlams.gov.in', 
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEkKwO', -- Password@123
 'central_admin', 'DoLR', 'New Delhi', 'Delhi', TRUE);
