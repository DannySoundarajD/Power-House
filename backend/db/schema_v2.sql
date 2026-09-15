-- ============================================================
-- NLAMS Schema Addition — Full Expansion
-- New tables for all 14 modules + 3 innovations
-- ============================================================

-- Acquisition Workflow Full 9-Stage Enum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'full_acquisition_stage') THEN
    CREATE TYPE full_acquisition_stage AS ENUM (
      'proposal', 'section_11_notification', 'objection_hearing',
      'section_19_declaration', 'approval', 'award_declared',
      'compensation_assessed', 'compensation_paid',
      'rr_in_progress', 'rr_completed',
      'possession_taken', 'handover', 'closed'
    );
  END IF;
END $$;

-- ============================================================
-- DOCUMENTS REPOSITORY
-- ============================================================
CREATE TABLE IF NOT EXISTS document_repository (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  parcel_id       UUID REFERENCES land_parcels(id) ON DELETE SET NULL,
  proposal_id     UUID REFERENCES proposals(id) ON DELETE SET NULL,
  doc_category    VARCHAR(60) NOT NULL,  -- notice, award, rr, compensation, legal, map, photo, certificate
  doc_type        VARCHAR(100) NOT NULL,
  file_name       VARCHAR(255) NOT NULL,
  file_path       TEXT NOT NULL,
  file_size_kb    INTEGER DEFAULT 0,
  mime_type       VARCHAR(100),
  version         INTEGER DEFAULT 1,
  checksum_sha256 TEXT,
  is_latest       BOOLEAN DEFAULT TRUE,
  uploaded_by     UUID REFERENCES users(id),
  remarks         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_docs_project ON document_repository(project_id);
CREATE INDEX IF NOT EXISTS idx_docs_parcel  ON document_repository(parcel_id);

-- ============================================================
-- GRIEVANCES & OBJECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS grievances (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grievance_number VARCHAR(30) UNIQUE NOT NULL,
  project_id      UUID REFERENCES projects(id),
  parcel_id       UUID REFERENCES land_parcels(id),
  submitted_by    UUID REFERENCES users(id),            -- landowner user id (from landowner_users)
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
CREATE INDEX IF NOT EXISTS idx_grievances_project ON grievances(project_id);
CREATE INDEX IF NOT EXISTS idx_grievances_status  ON grievances(status);

-- ============================================================
-- FIELD DATA COLLECTION
-- ============================================================
CREATE TABLE IF NOT EXISTS field_entries (
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
CREATE INDEX IF NOT EXISTS idx_field_parcel   ON field_entries(parcel_id);
CREATE INDEX IF NOT EXISTS idx_field_officer  ON field_entries(officer_id);

-- ============================================================
-- LAND SUITABILITY SCORES (Innovation 1)
-- ============================================================
CREATE TABLE IF NOT EXISTS suitability_analyses (
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
  score_social_sensitivity NUMERIC(5,2), -- lower SC/ST concentration = higher (ethical note: weight carefully)
  overall_score          NUMERIC(5,2),
  recommendation         VARCHAR(20),    -- SUITABLE, CONDITIONAL, NOT_RECOMMENDED
  reasoning              TEXT,
  alternatives           JSONB,          -- [{name, score, reason, area_ha}]
  analysed_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RIPPLE IMPACT CHAINS (Innovation 2)
-- ============================================================
CREATE TABLE IF NOT EXISTS ripple_impacts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_parcel_id UUID REFERENCES land_parcels(id),
  source_issue    VARCHAR(200) NOT NULL,
  impact_chain    JSONB NOT NULL,   -- [{stage, entity, delay_days, severity, reason}]
  total_delay_days INTEGER,
  critical_path   BOOLEAN DEFAULT FALSE,
  calculated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VOLUNTARY LAND OFFERS (Innovation 3)
-- ============================================================
CREATE TABLE IF NOT EXISTS land_offers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offer_number    VARCHAR(30) UNIQUE NOT NULL,
  landowner_name  VARCHAR(200) NOT NULL,
  landowner_phone VARCHAR(15),
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
CREATE INDEX IF NOT EXISTS idx_offers_status ON land_offers(status);

-- ============================================================
-- LANDOWNER PORTAL USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS landowner_users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(200) NOT NULL,
  phone           VARCHAR(15) UNIQUE NOT NULL,
  phone_last4     VARCHAR(4) NOT NULL,
  email           VARCHAR(150),
  survey_numbers  TEXT[],           -- array of associated survey numbers
  is_verified     BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INTEGRATION API LOG (Mock)
-- ============================================================
CREATE TABLE IF NOT EXISTS integration_logs (
  id              BIGSERIAL PRIMARY KEY,
  system_name     VARCHAR(100),
  endpoint        VARCHAR(300),
  request_type    VARCHAR(10),
  status          VARCHAR(20),   -- success, failed, timeout
  response_time_ms INTEGER,
  called_by       UUID REFERENCES users(id),
  called_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SEED NEW TABLES
-- ============================================================

-- Landowner users
INSERT INTO landowner_users (id, name, phone, phone_last4, survey_numbers) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'Muthusamy Gounder', '9840001204', '1204', ARRAY['145/2A','146/1B']),
  ('e1000000-0000-0000-0000-000000000002', 'Ramasamy Pillai', '9840001210', '1210', ARRAY['148/3']),
  ('e1000000-0000-0000-0000-000000000003', 'Kamala Subramaniam', '9840001220', '1220', ARRAY['160/2A']),
  ('e1000000-0000-0000-0000-000000000004', 'Arjunan Chinnathurai', '9840002201', '2201', ARRAY['88/1']),
  ('e1000000-0000-0000-0000-000000000005', 'Saraswathi Murugesan', '9840002205', '2205', ARRAY['92/3B'])
ON CONFLICT DO NOTHING;

-- Grievances
INSERT INTO grievances (grievance_number, project_id, parcel_id, landowner_name, survey_number, subject, description, grievance_type, status, priority, submitted_at) VALUES
  ('GRV/CHN/2024/001', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001',
   'Muthusamy Gounder', '145/2A',
   'Objection to Section 19 Declaration — Market value underassessed',
   'The market value assessed for survey no. 145/2A at ₹186.75L is significantly below current market rate. Similar land in Parandur sold for ₹28L/cent in 2023. Request reassessment per RFCTLARR Section 26.',
   'compensation_dispute', 'under_review', 'high', '2024-02-15T10:00:00+05:30'),
  ('GRV/CHN/2024/002', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003',
   'Ramasamy Pillai', '148/3',
   'R&R site allotment pending for 8 months — no communication from authority',
   'Despite being declared displaced as per Section 19, no R&R site has been allotted in 8 months. Family of 6 living in temporary shelter. Request immediate action.',
   'rr_grievance', 'submitted', 'high', '2024-05-20T11:00:00+05:30'),
  ('GRV/CHN/2024/003', 'b1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000021',
   'Arjunan Chinnathurai', '88/1',
   'Objection to Section 11 — Land is multi-generation ancestral property',
   'The land proposed for CPRR is ancestral property held continuously for 4 generations. Request SIA to include heritage and cultural impact assessment.',
   'objection', 'acknowledged', 'normal', '2024-06-01T09:00:00+05:30')
ON CONFLICT DO NOTHING;

-- Field entries
INSERT INTO field_entries (parcel_id, project_id, officer_id, visit_date, gps_lat, gps_lng, gps_accuracy_m, field_status, land_use_actual, structures_present, structure_count, notes, is_verified) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000004', '2024-03-10', 12.8175, 80.0085, 4.2,
   'verified', 'agricultural', FALSE, 0, 'Active paddy cultivation. No encroachment. Boundary markers intact. Owner cooperative.', TRUE),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000004', '2024-03-11', 12.8178, 80.0235, 5.1,
   'disputed', 'agricultural', FALSE, 0, 'Owner disputes boundary — claims 15.6 Ha but revenue records show 15.6 Ha. Requires resurvey.', FALSE),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000006', '2024-03-15', 12.8175, 80.0415, 3.8,
   'possession_ready', 'residential', TRUE, 1, 'Single residential structure — owner has vacated. Possession can proceed.', TRUE),
  ('c1000000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000008',
   'a1000000-0000-0000-0000-000000000006', '2024-06-05', 13.3410, 80.2050, 6.0,
   'access_blocked', 'agricultural', FALSE, 0, 'Access road blocked due to local protest. Field verification incomplete.', FALSE)
ON CONFLICT DO NOTHING;

-- Suitability analyses
INSERT INTO suitability_analyses (project_id, analysed_by, proposed_area_ha,
  score_settlements, score_multicrop, score_forest, score_infrastructure,
  score_complexity, score_connectivity, score_disaster_risk, score_social_sensitivity,
  overall_score, recommendation, reasoning, alternatives) VALUES
  ('b1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000001', 1900,
   38, 25, 78, 60, 42, 72, 65, 35,
   52, 'CONDITIONAL',
   'The Parandur site scores 52/100. Key concerns: (1) High multi-crop agricultural land concentration (75% of proposed area is paddy/sugarcane — RFCTLARR mandates food security assessment), (2) 15+ villages within acquisition boundary with ~4,200 families, (3) Historical acquisition complexity in Kancheepuram region is high (avg 8.2 years). Site is technically feasible but will require significant R&R resources and legal challenges are likely.',
   '[{"name":"Alternative A — Sriperumbudur Corridor","score":71,"area_ha":1850,"reason":"Lower settlement density, existing SIPCOT infrastructure reduces cost, good rail connectivity. Multi-crop land only 30%."},{"name":"Alternative B — Maraimalai Nagar Extension","score":65,"area_ha":1950,"reason":"Coastal zone reduces conflict, but flood risk moderate. Industrial zone adjacency beneficial. SC/ST household concentration low."}]'::JSONB)
ON CONFLICT DO NOTHING;

-- Ripple impacts
INSERT INTO ripple_impacts (source_parcel_id, source_issue, impact_chain, total_delay_days, critical_path) VALUES
  ('c1000000-0000-0000-0000-000000000001',
   'Compensation dispute filed — court stay order pending',
   '[{"stage":"Award","entity":"Survey 145/2A","delay_days":90,"severity":"high","reason":"Court stay order blocks award finalization"},{"stage":"Compensation","entity":"3 adjacent parcels in Block A","delay_days":120,"severity":"high","reason":"Block A section compensation cannot be processed until 145/2A resolved — RFCTLARR requires block-level award"},{"stage":"Possession","entity":"Block A — 48.5 Ha","delay_days":180,"severity":"critical","reason":"Physical possession of Block A cannot commence until all block compensation settled"},{"stage":"Project Section","entity":"Runway Approach Zone — Parandur Airport","delay_days":210,"severity":"critical","reason":"Approach zone construction delayed pending Block A possession"},{"stage":"Project Milestone","entity":"Airport overall completion","delay_days":240,"severity":"critical","reason":"Approach zone delay cascades to overall project commissioning deadline — currently 2030-03-31"}]'::JSONB,
   240, TRUE),
  ('c1000000-0000-0000-0000-000000000021',
   'Section 11 notification challenged — legal notice from landowner',
   '[{"stage":"Section 19","entity":"Ponneri Stretch — 18.4 Ha","delay_days":60,"severity":"medium","reason":"Section 19 declaration blocked pending court admission of challenge"},{"stage":"Award","entity":"Ponneri Parcels","delay_days":120,"severity":"high","reason":"No award can be declared until Section 19 is finalized"},{"stage":"Project Section","entity":"CPRR — Ponneri Segment 8.2 km","delay_days":150,"severity":"high","reason":"Ring road alignment through Ponneri blocked"}]'::JSONB,
   150, FALSE)
ON CONFLICT DO NOTHING;

-- Land offers
INSERT INTO land_offers (offer_number, landowner_name, landowner_phone, survey_number, village, taluk, area_ha, land_use, asking_price_lakh, offer_reason, suitable_for, status) VALUES
  ('OFFER/CHN/2024/001', 'Subbaiah Rajan', '9840005001', '201/3A', 'Sriperumbudur', 'Sriperumbudur', 4.80, 'agricultural', 96.0,
   'My family has 4 parcels in this area. Happy to offer this one for infrastructure use as we are planning to consolidate farming elsewhere.',
   'Industrial, Highway', 'submitted'),
  ('OFFER/CHN/2024/002', 'Bhavani Krishnan', '9840005002', '88/5', 'Ponneri', 'Ponneri', 2.30, 'wasteland', 23.0,
   'Wasteland parcel — not cultivated for 10 years. Willing to offer for road widening.',
   'Highway, Ring Road', 'under_review'),
  ('OFFER/CHN/2024/003', 'Chellapandi Murugan', '9840005003', '312/1B', 'Avadi', 'Avadi', 1.20, 'commercial', 60.0,
   'Commercial plot near Ring Road alignment. Willing to sell to NHAI at fair value.',
   'Highway, Metro Depot', 'declined')
ON CONFLICT DO NOTHING;

-- Documents
INSERT INTO document_repository (project_id, parcel_id, doc_category, doc_type, file_name, file_path, file_size_kb, mime_type, uploaded_by) VALUES
  ('b1000000-0000-0000-0000-000000000001', NULL, 'notice', 'Section 11 Notification', 'section_11_parandur_TN2022_1041.pdf', '/uploads/chnarpt001/sec11_1041.pdf', 1240, 'application/pdf', 'a1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000001', NULL, 'notice', 'Section 19 Declaration', 'section_19_parandur_TN2023_0428.pdf', '/uploads/chnarpt001/sec19_0428.pdf', 980, 'application/pdf', 'a1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 'award', 'Award Notice Survey 146/1B', 'award_146_1B_2023_1110.pdf', '/uploads/chnarpt001/award_146.pdf', 560, 'application/pdf', 'a1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000002', NULL, 'notice', 'Section 11 Notification', 'metro_sec11_TN2021_0872.pdf', '/uploads/chnmetr002/sec11_0872.pdf', 890, 'application/pdf', 'a1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'legal', 'Title Deed Survey 145/2A', 'title_deed_145_2A.pdf', '/uploads/chnarpt001/title_145.pdf', 340, 'application/pdf', 'a1000000-0000-0000-0000-000000000004'),
  ('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'photo', 'Field Photo — Survey 145/2A', 'field_145_2A_2024_march.jpg', '/uploads/chnarpt001/photo_145.jpg', 2100, 'image/jpeg', 'a1000000-0000-0000-0000-000000000004')
ON CONFLICT DO NOTHING;
