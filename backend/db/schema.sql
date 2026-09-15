-- ============================================================
-- NLAMS - National Land Acquisition & Management System
-- Prototype: Chennai District, Tamil Nadu
-- Database: PostgreSQL 16 + PostGIS
-- Security: Row-Level Security, Audit Logging, RBAC
-- ============================================================

-- Enable PostGIS extension for spatial data
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM (
  'central_admin',
  'state_officer',
  'district_collector',
  'field_officer',
  'project_agency'
);

CREATE TYPE acquisition_stage AS ENUM (
  'proposed',
  'section_11_notification',
  'section_19_declaration',
  'award_declared',
  'compensation_assessed',
  'compensation_paid',
  'possession_taken',
  'closed'
);

CREATE TYPE proposal_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'returned'
);

CREATE TYPE land_use AS ENUM (
  'agricultural',
  'residential',
  'commercial',
  'forest',
  'waterbody',
  'industrial',
  'wasteland'
);

CREATE TYPE project_type AS ENUM (
  'highway',
  'airport',
  'railway',
  'irrigation',
  'urban_development',
  'industrial_corridor',
  'renewable_energy',
  'port',
  'metro',
  'defence'
);

-- ============================================================
-- USERS & AUTHENTICATION
-- ============================================================

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id     VARCHAR(20) UNIQUE NOT NULL,
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(150) UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,  -- bcrypt hashed
  role            user_role NOT NULL,
  department      VARCHAR(150),
  district        VARCHAR(100),
  state           VARCHAR(100) DEFAULT 'Tamil Nadu',
  phone           VARCHAR(15),
  is_active       BOOLEAN DEFAULT TRUE,
  last_login      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROJECTS
-- ============================================================

CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_code    VARCHAR(30) UNIQUE NOT NULL,
  name            VARCHAR(300) NOT NULL,
  project_type    project_type NOT NULL,
  description     TEXT,
  implementing_agency VARCHAR(200) NOT NULL,
  district        VARCHAR(100) NOT NULL DEFAULT 'Chennai',
  state           VARCHAR(100) DEFAULT 'Tamil Nadu',
  total_area_ha   NUMERIC(12,4),         -- Total area in hectares
  area_proposed_ha NUMERIC(12,4),
  area_notified_ha NUMERIC(12,4) DEFAULT 0,
  area_acquired_ha NUMERIC(12,4) DEFAULT 0,
  area_possessed_ha NUMERIC(12,4) DEFAULT 0,
  estimated_cost_cr NUMERIC(15,2),       -- Crores INR
  start_date      DATE,
  target_completion DATE,
  actual_completion DATE,
  current_stage   acquisition_stage DEFAULT 'proposed',
  progress_pct    NUMERIC(5,2) DEFAULT 0,
  project_officer_id UUID REFERENCES users(id),
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LAND PARCELS (Spatial - PostGIS)
-- ============================================================

CREATE TABLE land_parcels (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  survey_number   VARCHAR(50) NOT NULL,
  patta_number    VARCHAR(50),
  sub_division    VARCHAR(20),
  village         VARCHAR(100),
  taluk           VARCHAR(100),
  district        VARCHAR(100) DEFAULT 'Chennai',
  area_ha         NUMERIC(10,4) NOT NULL,
  land_use        land_use,
  owner_name      VARCHAR(200),
  owner_aadhaar   TEXT,                  -- AES encrypted in application layer
  stage           acquisition_stage DEFAULT 'proposed',
  section11_date  DATE,
  section19_date  DATE,
  award_date      DATE,
  possession_date DATE,
  compensation_assessed_lakh NUMERIC(12,2),
  compensation_paid_lakh     NUMERIC(12,2) DEFAULT 0,
  remarks         TEXT,
  geom            GEOMETRY(POLYGON, 4326),  -- WGS84 polygon
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index for fast geo queries
CREATE INDEX idx_land_parcels_geom ON land_parcels USING GIST (geom);
CREATE INDEX idx_land_parcels_project ON land_parcels (project_id);
CREATE INDEX idx_land_parcels_stage ON land_parcels (stage);

-- ============================================================
-- PROPOSALS
-- ============================================================

CREATE TABLE proposals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_number VARCHAR(30) UNIQUE NOT NULL,
  project_id      UUID REFERENCES projects(id),
  title           VARCHAR(300) NOT NULL,
  description     TEXT,
  area_requested_ha NUMERIC(12,4),
  urgency         VARCHAR(20) DEFAULT 'normal',  -- normal, urgent, critical
  status          proposal_status DEFAULT 'draft',
  submitted_by    UUID REFERENCES users(id),
  submitted_at    TIMESTAMPTZ,
  reviewed_by     UUID REFERENCES users(id),
  reviewed_at     TIMESTAMPTZ,
  approved_by     UUID REFERENCES users(id),
  approved_at     TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WORKFLOW STAGES (Approval Chain)
-- ============================================================

CREATE TABLE workflow_stages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id     UUID REFERENCES proposals(id) ON DELETE CASCADE,
  stage_name      VARCHAR(100) NOT NULL,
  stage_order     INTEGER NOT NULL,
  assigned_role   user_role NOT NULL,
  assigned_to     UUID REFERENCES users(id),
  status          VARCHAR(30) DEFAULT 'pending',  -- pending, approved, rejected, skipped
  comments        TEXT,
  acted_at        TIMESTAMPTZ,
  deadline        TIMESTAMPTZ,
  is_overdue      BOOLEAN GENERATED ALWAYS AS (
    deadline IS NOT NULL AND deadline < NOW() AND status = 'pending'
  ) STORED,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS (Statutory)
-- ============================================================

CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID REFERENCES projects(id),
  notification_type VARCHAR(50) NOT NULL,  -- section_11, section_19, award
  gazette_number  VARCHAR(100),
  gazette_date    DATE,
  issued_by       VARCHAR(200),
  total_area_ha   NUMERIC(12,4),
  remarks         TEXT,
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AWARDS
-- ============================================================

CREATE TABLE awards (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID REFERENCES projects(id),
  parcel_id       UUID REFERENCES land_parcels(id),
  award_number    VARCHAR(50) NOT NULL,
  award_date      DATE NOT NULL,
  market_value_lakh NUMERIC(12,2),
  solatium_lakh   NUMERIC(12,2),       -- 100% solatium under RFCTLARR
  additional_comp_lakh NUMERIC(12,2),  -- 12% per annum
  total_comp_lakh NUMERIC(12,2),
  awarded_by      VARCHAR(200),
  remarks         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COMPENSATION DISBURSEMENT
-- ============================================================

CREATE TABLE compensation (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID REFERENCES projects(id),
  parcel_id       UUID REFERENCES land_parcels(id),
  beneficiary_name VARCHAR(200) NOT NULL,
  beneficiary_aadhaar TEXT,
  bank_account    TEXT,                  -- encrypted in app layer
  ifsc_code       VARCHAR(20),
  amount_assessed_lakh NUMERIC(12,2),
  amount_disbursed_lakh NUMERIC(12,2) DEFAULT 0,
  disbursement_date DATE,
  payment_reference VARCHAR(100),
  payment_mode    VARCHAR(50) DEFAULT 'NEFT',
  status          VARCHAR(30) DEFAULT 'pending',  -- pending, partial, paid
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AFFECTED FAMILIES & R&R
-- ============================================================

CREATE TABLE affected_families (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID REFERENCES projects(id),
  parcel_id       UUID REFERENCES land_parcels(id),
  family_head     VARCHAR(200) NOT NULL,
  aadhaar_number  TEXT,                  -- encrypted
  family_size     INTEGER,
  category        VARCHAR(50),           -- SC/ST/OBC/General
  is_displaced    BOOLEAN DEFAULT FALSE,
  rr_status       VARCHAR(50) DEFAULT 'not_started',  -- not_started, in_progress, completed
  rr_site_allotted BOOLEAN DEFAULT FALSE,
  rr_house_constructed BOOLEAN DEFAULT FALSE,
  livelihood_restored BOOLEAN DEFAULT FALSE,
  registered_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DOCUMENTS
-- ============================================================

CREATE TABLE documents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID REFERENCES projects(id),
  parcel_id       UUID REFERENCES land_parcels(id),
  proposal_id     UUID REFERENCES proposals(id),
  doc_type        VARCHAR(100) NOT NULL,  -- gazette_notification, award, title_deed, map, etc.
  file_name       VARCHAR(255) NOT NULL,
  file_path       TEXT NOT NULL,
  file_size_kb    INTEGER,
  mime_type       VARCHAR(100),
  version         INTEGER DEFAULT 1,
  checksum        TEXT,                   -- SHA-256 for integrity
  uploaded_by     UUID REFERENCES users(id),
  is_latest       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MILESTONES
-- ============================================================

CREATE TABLE milestones (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID REFERENCES projects(id),
  milestone_name  VARCHAR(200) NOT NULL,
  stage           acquisition_stage,
  target_date     DATE NOT NULL,
  achieved_date   DATE,
  is_achieved     BOOLEAN DEFAULT FALSE,
  is_critical     BOOLEAN DEFAULT FALSE,
  delay_days      INTEGER GENERATED ALWAYS AS (
    CASE WHEN achieved_date IS NOT NULL THEN
      EXTRACT(DAY FROM achieved_date - target_date)::INTEGER
    WHEN target_date < CURRENT_DATE AND NOT is_achieved THEN
      EXTRACT(DAY FROM CURRENT_DATE - target_date)::INTEGER
    ELSE 0 END
  ) STORED,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ALERTS
-- ============================================================

CREATE TABLE alerts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID REFERENCES projects(id),
  alert_type      VARCHAR(100) NOT NULL,  -- deadline_breach, pending_approval, compensation_delay
  severity        VARCHAR(20) DEFAULT 'medium',  -- low, medium, high, critical
  title           VARCHAR(300) NOT NULL,
  description     TEXT,
  target_role     user_role,
  target_user     UUID REFERENCES users(id),
  is_read         BOOLEAN DEFAULT FALSE,
  is_resolved     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS (Tamper-evident)
-- ============================================================

CREATE TABLE audit_logs (
  id              BIGSERIAL PRIMARY KEY,
  table_name      VARCHAR(100) NOT NULL,
  record_id       UUID NOT NULL,
  action          VARCHAR(20) NOT NULL,  -- INSERT, UPDATE, DELETE
  old_data        JSONB,
  new_data        JSONB,
  changed_by      UUID REFERENCES users(id),
  changed_at      TIMESTAMPTZ DEFAULT NOW(),
  ip_address      INET,
  user_agent      TEXT,
  session_id      TEXT
);

CREATE INDEX idx_audit_logs_record ON audit_logs (table_name, record_id);
CREATE INDEX idx_audit_logs_user ON audit_logs (changed_by);
CREATE INDEX idx_audit_logs_time ON audit_logs (changed_at);

-- ============================================================
-- VIEWS
-- ============================================================

CREATE OR REPLACE VIEW v_project_summary AS
SELECT
  p.id,
  p.project_code,
  p.name,
  p.project_type,
  p.district,
  p.implementing_agency,
  p.current_stage,
  p.total_area_ha,
  p.area_proposed_ha,
  p.area_notified_ha,
  p.area_acquired_ha,
  p.area_possessed_ha,
  p.estimated_cost_cr,
  p.start_date,
  p.target_completion,
  p.progress_pct,
  COUNT(DISTINCT lp.id) AS total_parcels,
  COALESCE(SUM(lp.compensation_assessed_lakh), 0) AS total_comp_assessed_lakh,
  COALESCE(SUM(lp.compensation_paid_lakh), 0) AS total_comp_paid_lakh,
  COUNT(DISTINCT af.id) AS affected_families,
  COUNT(DISTINCT CASE WHEN af.is_displaced THEN af.id END) AS displaced_families,
  COUNT(DISTINCT CASE WHEN af.rr_status = 'completed' THEN af.id END) AS rr_completed_families
FROM projects p
LEFT JOIN land_parcels lp ON lp.project_id = p.id
LEFT JOIN affected_families af ON af.project_id = p.id
GROUP BY p.id;

CREATE OR REPLACE VIEW v_national_kpi AS
SELECT
  COUNT(DISTINCT p.id) AS total_projects,
  COALESCE(SUM(p.area_proposed_ha), 0) AS total_area_proposed_ha,
  COALESCE(SUM(p.area_notified_ha), 0) AS total_area_notified_ha,
  COALESCE(SUM(p.area_acquired_ha), 0) AS total_area_acquired_ha,
  COALESCE(SUM(p.area_possessed_ha), 0) AS total_area_possessed_ha,
  COALESCE(SUM(lp.compensation_assessed_lakh), 0) AS total_comp_assessed_lakh,
  COALESCE(SUM(lp.compensation_paid_lakh), 0) AS total_comp_paid_lakh,
  COUNT(DISTINCT af.id) AS total_affected_families,
  COUNT(DISTINCT CASE WHEN af.is_displaced THEN af.id END) AS total_displaced_families,
  COUNT(DISTINCT CASE WHEN af.rr_status = 'completed' THEN af.id END) AS total_rr_completed
FROM projects p
LEFT JOIN land_parcels lp ON lp.project_id = p.id
LEFT JOIN affected_families af ON af.project_id = p.id;

-- ============================================================
-- INNOVATION 1: LAND SUITABILITY ANALYSIS
-- ============================================================

CREATE TABLE suitability_analyses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID REFERENCES projects(id),
  analysed_by     UUID REFERENCES users(id),
  proposed_area_ha NUMERIC(12,4),
  -- Factor scores 0-100
  score_settlements      NUMERIC(5,2),   -- fewer settlements = higher score
  score_multicrop        NUMERIC(5,2),   -- less multicrop agri = higher score
  score_forest           NUMERIC(5,2),   -- farther from forest = higher score
  score_infrastructure   NUMERIC(5,2),   -- less existing infra disruption = higher score
  score_complexity       NUMERIC(5,2),   -- lower historical complexity = higher score
  score_connectivity     NUMERIC(5,2),   -- better road/rail connectivity = higher score
  score_disaster_risk    NUMERIC(5,2),   -- lower flood/disaster risk = higher score
  score_social_sensitivity NUMERIC(5,2), -- lower SC/ST concentration = higher
  overall_score          NUMERIC(5,2),
  recommendation         VARCHAR(20),    -- SUITABLE, CONDITIONAL, NOT_RECOMMENDED
  reasoning              TEXT,
  alternatives           JSONB,          -- [{name, score, reason, area_ha}]
  analysed_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_suitability_project ON suitability_analyses (project_id);

-- ============================================================
-- INNOVATION 2: RIPPLE IMPACT ANALYSIS
-- ============================================================

CREATE TABLE ripple_impacts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_parcel_id UUID REFERENCES land_parcels(id),
  source_issue    VARCHAR(200) NOT NULL,
  impact_chain    JSONB NOT NULL,   -- [{stage, entity, delay_days, severity, reason}]
  total_delay_days INTEGER,
  critical_path   BOOLEAN DEFAULT FALSE,
  calculated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ripple_parcel ON ripple_impacts (source_parcel_id);
CREATE INDEX idx_ripple_critical ON ripple_impacts (critical_path);

-- ============================================================
-- INNOVATION 3: VOLUNTARY LAND OFFERS (Two-way Portal)
-- ============================================================

CREATE TABLE land_offers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offer_number    VARCHAR(30) UNIQUE NOT NULL,
  landowner_name  VARCHAR(200) NOT NULL,
  landowner_phone VARCHAR(15),
  landowner_email VARCHAR(150),
  survey_number   VARCHAR(60),
  village         VARCHAR(100),
  taluk           VARCHAR(100),
  district        VARCHAR(100) DEFAULT 'Chennai',
  area_ha         NUMERIC(10, 4),
  land_use        VARCHAR(60),
  asking_price_lakh NUMERIC(12, 2),
  offer_reason    TEXT,
  suitable_for    VARCHAR(200),   -- e.g. "Highway, Industrial"
  geom            GEOMETRY(POLYGON, 4326),
  status          VARCHAR(40) DEFAULT 'submitted',  -- submitted, under_review, accepted, declined, expired
  govt_response   TEXT,
  reviewed_by     UUID REFERENCES users(id),
  reviewed_at     TIMESTAMPTZ,
  submitted_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_offers_status ON land_offers(status);
CREATE INDEX idx_offers_district ON land_offers(district);

-- ============================================================
-- LANDOWNER PORTAL USERS
-- ============================================================

CREATE TABLE landowner_users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(200) NOT NULL,
  phone           VARCHAR(15) UNIQUE NOT NULL,
  phone_last4     VARCHAR(4) NOT NULL,
  email           VARCHAR(150),
  survey_numbers  TEXT[],           -- array of associated survey numbers
  is_verified     BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_landowner_phone ON landowner_users(phone);

-- ============================================================
-- GRIEVANCES & OBJECTIONS
-- ============================================================

CREATE TABLE grievances (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grievance_number VARCHAR(30) UNIQUE NOT NULL,
  project_id      UUID REFERENCES projects(id),
  parcel_id       UUID REFERENCES land_parcels(id),
  submitted_by    UUID REFERENCES landowner_users(id),
  landowner_name  VARCHAR(200),
  survey_number   VARCHAR(60),
  subject         VARCHAR(300) NOT NULL,
  description     TEXT,
  grievance_type  VARCHAR(80) DEFAULT 'general',        -- objection, compensation_dispute, rr_grievance, general
  status          VARCHAR(40) DEFAULT 'submitted',       -- submitted, acknowledged, under_review, resolved, rejected
  priority        VARCHAR(20) DEFAULT 'normal',
  assigned_to     UUID REFERENCES users(id),
  resolution      TEXT,
  response_date   TIMESTAMPTZ,
  submitted_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_grievances_project ON grievances(project_id);
CREATE INDEX idx_grievances_status  ON grievances(status);
CREATE INDEX idx_grievances_submitted_by ON grievances(submitted_by);

-- ============================================================
-- FIELD DATA COLLECTION
-- ============================================================

CREATE TABLE field_entries (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parcel_id       UUID REFERENCES land_parcels(id),
  project_id      UUID REFERENCES projects(id),
  officer_id      UUID REFERENCES users(id),
  visit_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  gps_lat         NUMERIC(10, 7),
  gps_lng         NUMERIC(10, 7),
  gps_accuracy_m  NUMERIC(6, 2),
  field_status    VARCHAR(60) NOT NULL,                 -- verified, encroached, disputed, access_blocked, possession_ready
  land_use_actual VARCHAR(60),
  structures_present BOOLEAN DEFAULT FALSE,
  structure_count INTEGER DEFAULT 0,
  trees_present   BOOLEAN DEFAULT FALSE,
  irrigation_present BOOLEAN DEFAULT FALSE,
  notes           TEXT,
  photos_count    INTEGER DEFAULT 0,
  is_verified     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_field_parcel   ON field_entries(parcel_id);
CREATE INDEX idx_field_officer  ON field_entries(officer_id);
CREATE INDEX idx_field_project  ON field_entries(project_id);

-- ============================================================
-- INTEGRATION API LOG (Mock)
-- ============================================================

CREATE TABLE integration_logs (
  id              BIGSERIAL PRIMARY KEY,
  system_name     VARCHAR(100),
  endpoint        VARCHAR(300),
  request_type    VARCHAR(10),
  status          VARCHAR(20),   -- success, failed, timeout
  response_time_ms INTEGER,
  called_by       UUID REFERENCES users(id),
  called_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_integration_logs_called_by ON integration_logs(called_by);
CREATE INDEX idx_integration_logs_called_at ON integration_logs(called_at);
