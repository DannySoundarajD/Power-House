-- ============================================================
-- NLAMS Seed Data - Chennai District, Tamil Nadu
-- Real projects: Parandur Airport, Secretariat Relocation,
-- Chennai Metro Phase 2, Vandalur-Walajabad Highway,
-- TIDEL Park OMR Expansion, Chennai Port Trust Expansion
-- ============================================================

-- USERS (passwords are bcrypt of 'Password@123')
INSERT INTO users (id, employee_id, name, email, password_hash, role, department, district, phone) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'MIN001', 'Rajesh Kumar IAS', 'rajesh.kumar@dolr.gov.in',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSSqRcapO1GLK4bOmRb6J9uS', 'central_admin',
   'Ministry of Rural Development - DoLR', 'New Delhi', '9810000001'),
  ('a1000000-0000-0000-0000-000000000002', 'TN001', 'Priya Chandran IAS', 'priya.chandran@tn.gov.in',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSSqRcapO1GLK4bOmRb6J9uS', 'state_officer',
   'Revenue & Disaster Management Dept - TN', 'Chennai', '9444000002'),
  ('a1000000-0000-0000-0000-000000000003', 'CHN001', 'Senthil Murugan IAS', 'collector.chennai@tn.gov.in',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSSqRcapO1GLK4bOmRb6J9uS', 'district_collector',
   'District Collectorate Chennai', 'Chennai', '9444000003'),
  ('a1000000-0000-0000-0000-000000000004', 'FO001', 'Kumaran Selvam', 'kumaran.s@tn.gov.in',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSSqRcapO1GLK4bOmRb6J9uS', 'field_officer',
   'Taluk Office - Chengalpattu', 'Chengalpattu', '9840000004'),
  ('a1000000-0000-0000-0000-000000000005', 'PA001', 'Anand Krishnamurthy', 'anand.k@aai.aero',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSSqRcapO1GLK4bOmRb6J9uS', 'project_agency',
   'Airports Authority of India', 'Chennai', '9840000005'),
  ('a1000000-0000-0000-0000-000000000006', 'FO002', 'Meenakshi Rajan', 'meenakshi.r@tn.gov.in',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSSqRcapO1GLK4bOmRb6J9uS', 'field_officer',
   'Taluk Office - Sriperumbudur', 'Chennai', '9840000006'),
  ('a1000000-0000-0000-0000-000000000007', 'PA002', 'Venkataraman Iyer', 'venkat.i@cmrl.in',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSSqRcapO1GLK4bOmRb6J9uS', 'project_agency',
   'Chennai Metro Rail Ltd', 'Chennai', '9840000007');

-- PROJECTS
INSERT INTO projects (id, project_code, name, project_type, description, implementing_agency,
  district, total_area_ha, area_proposed_ha, area_notified_ha, area_acquired_ha, area_possessed_ha,
  estimated_cost_cr, start_date, target_completion, current_stage, progress_pct, created_by) VALUES

-- Project 1: Parandur International Airport
('b1000000-0000-0000-0000-000000000001',
 'CHN-ARPT-001',
 'Parandur Greenfield International Airport',
 'airport',
 'New greenfield international airport at Parandur village, Kancheepuram District to decongest Chennai Airport. The project involves acquisition of approximately 4,694 acres of multi-crop agricultural land and involves relocation of 15+ villages.',
 'Airports Authority of India (AAI) / TIDCO',
 'Chennai', 1900.00, 1900.00, 1200.00, 680.00, 320.00,
 25000.00, '2022-09-01', '2030-03-31', 'section_19_declaration', 36.0,
 'a1000000-0000-0000-0000-000000000003'),

-- Project 2: Chennai Metro Phase 2 Extension
('b1000000-0000-0000-0000-000000000002',
 'CHN-METR-002',
 'Chennai Metro Rail Phase 2 - Corridor 5 (Madhavaram to Sholinganallur)',
 'metro',
 'Phase 2 metro corridor spanning 47.47 km from Madhavaram to Sholinganallur via Taramani and Sholinganallur. Requires land acquisition at 12 locations for stations, depots, and viaducts.',
 'Chennai Metro Rail Limited (CMRL)',
 'Chennai', 48.50, 48.50, 38.20, 28.60, 22.40,
 3770.00, '2021-06-01', '2027-12-31', 'compensation_paid', 62.0,
 'a1000000-0000-0000-0000-000000000003'),

-- Project 3: New Tamil Nadu Secretariat Relocation
('b1000000-0000-0000-0000-000000000003',
 'CHN-SECR-003',
 'New Tamil Nadu Secretariat Complex - Omandurar Estate',
 'urban_development',
 'Construction of new integrated Tamil Nadu Secretariat at Omandurar Government Estate, replacing the historic Fort St. George complex for modern administrative infrastructure. 4.6 lakh sq ft complex.',
 'TANGEDCO / PWD Tamil Nadu',
 'Chennai', 12.00, 12.00, 12.00, 10.50, 8.00,
 2400.00, '2020-01-01', '2025-12-31', 'possession_taken', 75.0,
 'a1000000-0000-0000-0000-000000000003'),

-- Project 4: Vandalur-Walajabad 4-Lane Highway
('b1000000-0000-0000-0000-000000000004',
 'CHN-NHWY-004',
 'NH-48 Vandalur-Walajabad 4-Lane Highway Widening',
 'highway',
 'Four-laning of the Vandalur to Walajabad section of NH-48 (previously NH-4). Total length 36 km. Requires acquisition of agricultural and residential plots in Kancheepuram district.',
 'National Highways Authority of India (NHAI)',
 'Chennai', 180.00, 180.00, 155.00, 130.00, 110.00,
 1850.00, '2020-04-01', '2025-06-30', 'compensation_paid', 71.0,
 'a1000000-0000-0000-0000-000000000003'),

-- Project 5: TIDEL Park OMR Phase 3
('b1000000-0000-0000-0000-000000000005',
 'CHN-TIDL-005',
 'TIDEL Park Phase 3 - OMR IT Corridor Expansion',
 'industrial_corridor',
 'Expansion of TIDEL Park IT complex along Old Mahabalipuram Road (OMR). New tech park spanning 35 acres in Sholinganallur. Acquisition of commercial and residential plots.',
 'TIDCO / ELCOT Tamil Nadu',
 'Chennai', 14.20, 14.20, 14.20, 12.80, 12.80,
 680.00, '2019-07-01', '2024-03-31', 'closed', 100.0,
 'a1000000-0000-0000-0000-000000000003'),

-- Project 6: Chennai Port Expansion - Kamarajar Port Integration
('b1000000-0000-0000-0000-000000000006',
 'CHN-PORT-006',
 'Chennai Port - Kamarajar Integration Road Corridor',
 'port',
 'Construction of dedicated port connectivity road from Kamarajar Port (Ennore) to NH-16 (Kolkata Highway) to ease port traffic. Total length 18.5 km.',
 'Chennai Port Trust / NHAI',
 'Chennai', 95.00, 95.00, 72.00, 48.00, 28.00,
 1200.00, '2021-11-01', '2026-06-30', 'compensation_assessed', 42.0,
 'a1000000-0000-0000-0000-000000000003'),

-- Project 7: SIPCOT Industrial Park - Sriperumbudur
('b1000000-0000-0000-0000-000000000007',
 'CHN-SIPC-007',
 'SIPCOT Industrial Park Phase 2 - Sriperumbudur',
 'industrial_corridor',
 'Second phase of SIPCOT industrial park at Sriperumbudur for electronics and automobile component manufacturing. Home to key Foxconn, Flextronics suppliers.',
 'State Industries Promotion Corporation of Tamil Nadu (SIPCOT)',
 'Chennai', 580.00, 580.00, 520.00, 490.00, 460.00,
 3200.00, '2018-04-01', '2023-12-31', 'closed', 100.0,
 'a1000000-0000-0000-0000-000000000003'),

-- Project 8: Chennai Peripheral Ring Road
('b1000000-0000-0000-0000-000000000008',
 'CHN-RING-008',
 'Chennai Peripheral Ring Road (CPRR) - Phase 1',
 'highway',
 'Outer ring road for Chennai Metropolitan Area. 62 km corridor connecting NH-16 (Kolkata road) to NH-32 (Pondicherry road) bypassing the city. Passes through Redhills, Ponneri, Avadi, Ambattur, Sriperumbudur.',
 'NHAI / TNRDC',
 'Chennai', 310.00, 310.00, 220.00, 140.00, 80.00,
 6800.00, '2023-01-01', '2028-12-31', 'section_11_notification', 28.0,
 'a1000000-0000-0000-0000-000000000003');

-- LAND PARCELS for Parandur Airport (Project 1) - Realistic Chennai coordinates
INSERT INTO land_parcels (id, project_id, survey_number, patta_number, village, taluk, area_ha,
  land_use, owner_name, stage, section11_date, section19_date, award_date, possession_date,
  compensation_assessed_lakh, compensation_paid_lakh, geom) VALUES

('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
 '145/2A', 'P-1204', 'Parandur', 'Kancheepuram',
 12.45, 'agricultural', 'Muthusamy Gounder',
 'section_19_declaration', '2022-10-15', '2023-04-20', NULL, NULL,
 186.75, 0,
 ST_GeomFromText('POLYGON((80.0050 12.8150, 80.0120 12.8150, 80.0120 12.8200, 80.0050 12.8200, 80.0050 12.8150))', 4326)),

('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001',
 '146/1B', 'P-1205', 'Parandur', 'Kancheepuram',
 8.30, 'agricultural', 'Lakshmi Devi Selvam',
 'award_declared', '2022-10-15', '2023-04-20', '2023-11-10', NULL,
 124.50, 62.25,
 ST_GeomFromText('POLYGON((80.0120 12.8150, 80.0190 12.8150, 80.0190 12.8200, 80.0120 12.8200, 80.0120 12.8150))', 4326)),

('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001',
 '148/3', 'P-1210', 'Parandhur', 'Kancheepuram',
 15.60, 'agricultural', 'Ramasamy Pillai',
 'section_11_notification', '2022-10-15', NULL, NULL, NULL,
 234.00, 0,
 ST_GeomFromText('POLYGON((80.0190 12.8150, 80.0280 12.8150, 80.0280 12.8210, 80.0190 12.8210, 80.0190 12.8150))', 4326)),

('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000001',
 '152/1', 'P-1215', 'Manambakkam', 'Kancheepuram',
 22.80, 'agricultural', 'Chinnaponnu Natarajan',
 'compensation_paid', '2022-10-15', '2023-04-20', '2023-11-10', NULL,
 342.00, 342.00,
 ST_GeomFromText('POLYGON((80.0280 12.8150, 80.0380 12.8150, 80.0380 12.8220, 80.0280 12.8220, 80.0280 12.8150))', 4326)),

('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001',
 '160/2A', 'P-1220', 'Udayampalayam', 'Kancheepuram',
 9.40, 'residential', 'Kamala Subramaniam',
 'possession_taken', '2022-10-15', '2023-04-20', '2023-11-10', '2024-02-28',
 282.00, 282.00,
 ST_GeomFromText('POLYGON((80.0380 12.8150, 80.0450 12.8150, 80.0450 12.8200, 80.0380 12.8200, 80.0380 12.8150))', 4326));

-- Land parcels for Chennai Metro Phase 2 (Project 2)
INSERT INTO land_parcels (id, project_id, survey_number, patta_number, village, taluk, area_ha,
  land_use, owner_name, stage, section11_date, section19_date, award_date, possession_date,
  compensation_assessed_lakh, compensation_paid_lakh, geom) VALUES

('c1000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000002',
 '22/4B', 'T-8891', 'Sholinganallur', 'Sholinganallur',
 0.85, 'commercial', 'Chennai Metropolitan Development Authority',
 'possession_taken', '2021-08-01', '2022-01-15', '2022-07-20', '2022-11-30',
 127.50, 127.50,
 ST_GeomFromText('POLYGON((80.2270 12.9010, 80.2310 12.9010, 80.2310 12.9040, 80.2270 12.9040, 80.2270 12.9010))', 4326)),

('c1000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000002',
 '35/1A', 'T-8895', 'Taramani', 'Adyar',
 1.20, 'residential', 'Multiple Owners (Apartment Complex)',
 'compensation_paid', '2021-08-01', '2022-01-15', '2022-07-20', NULL,
 360.00, 360.00,
 ST_GeomFromText('POLYGON((80.2400 12.9820, 80.2450 12.9820, 80.2450 12.9860, 80.2400 12.9860, 80.2400 12.9820))', 4326)),

('c1000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000002',
 '48/2', 'T-9102', 'Madhavaram', 'Madhavaram',
 2.10, 'industrial', 'TIDCO Depot Site',
 'award_declared', '2021-08-01', '2022-01-15', '2023-03-10', NULL,
 315.00, 157.50,
 ST_GeomFromText('POLYGON((80.2480 13.1480, 80.2530 13.1480, 80.2530 13.1520, 80.2480 13.1520, 80.2480 13.1480))', 4326));

-- Land parcels for Peripheral Ring Road (Project 8)
INSERT INTO land_parcels (id, project_id, survey_number, patta_number, village, taluk, area_ha,
  land_use, owner_name, stage, section11_date, section19_date, award_date, possession_date,
  compensation_assessed_lakh, compensation_paid_lakh, geom) VALUES

('c1000000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000008',
 '88/1', 'R-2201', 'Ponneri', 'Ponneri',
 18.40, 'agricultural', 'Arjunan Chinnathurai',
 'section_11_notification', '2023-06-15', NULL, NULL, NULL,
 276.00, 0,
 ST_GeomFromText('POLYGON((80.2010 13.3380, 80.2090 13.3380, 80.2090 13.3440, 80.2010 13.3440, 80.2010 13.3380))', 4326)),

('c1000000-0000-0000-0000-000000000022', 'b1000000-0000-0000-0000-000000000008',
 '92/3B', 'R-2205', 'Avadi', 'Avadi',
 25.60, 'agricultural', 'Saraswathi Murugesan',
 'proposed', NULL, NULL, NULL, NULL,
 384.00, 0,
 ST_GeomFromText('POLYGON((80.0920 13.1150, 80.1010 13.1150, 80.1010 13.1220, 80.0920 13.1220, 80.0920 13.1150))', 4326));

-- PROPOSALS
INSERT INTO proposals (id, proposal_number, project_id, title, description, area_requested_ha,
  urgency, status, submitted_by, submitted_at, reviewed_by, reviewed_at, approved_by, approved_at) VALUES
('d1000000-0000-0000-0000-000000000001', 'PROP/CHN/2024/001',
 'b1000000-0000-0000-0000-000000000001',
 'Section 11 Notification for Parandur Airport - Block B Extension',
 'Additional land required for runway extension and taxi-ways in Block B of Parandur Airport site. Total 320 acres additional to original SIA.',
 129.50, 'critical', 'approved',
 'a1000000-0000-0000-0000-000000000004', '2024-01-15 10:00:00+05:30',
 'a1000000-0000-0000-0000-000000000003', '2024-01-22 15:30:00+05:30',
 'a1000000-0000-0000-0000-000000000002', '2024-02-01 11:00:00+05:30'),
('d1000000-0000-0000-0000-000000000002', 'PROP/CHN/2024/002',
 'b1000000-0000-0000-0000-000000000008',
 'SIA for Chennai Peripheral Ring Road - Ponneri Section',
 'Social Impact Assessment for 8.2 km stretch of CPRR passing through Ponneri taluk. 340 families to be affected.',
 65.00, 'urgent', 'under_review',
 'a1000000-0000-0000-0000-000000000006', '2024-03-10 09:00:00+05:30',
 'a1000000-0000-0000-0000-000000000003', '2024-03-18 14:00:00+05:30',
 NULL, NULL),
('d1000000-0000-0000-0000-000000000003', 'PROP/CHN/2024/003',
 'b1000000-0000-0000-0000-000000000006',
 'Additional Acquisition for Port Road Corridor - Ennore Section',
 'Additional parcels required for service road along port connectivity corridor.',
 18.30, 'normal', 'submitted',
 'a1000000-0000-0000-0000-000000000004', '2024-04-05 11:30:00+05:30',
 NULL, NULL, NULL, NULL);

-- WORKFLOW STAGES
INSERT INTO workflow_stages (proposal_id, stage_name, stage_order, assigned_role, assigned_to, status, comments, acted_at, deadline) VALUES
('d1000000-0000-0000-0000-000000000001', 'Field Officer Submission', 1, 'field_officer', 'a1000000-0000-0000-0000-000000000004', 'approved', 'Documents verified and uploaded', '2024-01-15 10:00:00+05:30', '2024-01-20 17:00:00+05:30'),
('d1000000-0000-0000-0000-000000000001', 'District Collector Review', 2, 'district_collector', 'a1000000-0000-0000-0000-000000000003', 'approved', 'SIA complete, recommend approval', '2024-01-22 15:30:00+05:30', '2024-01-30 17:00:00+05:30'),
('d1000000-0000-0000-0000-000000000001', 'State Officer Approval', 3, 'state_officer', 'a1000000-0000-0000-0000-000000000002', 'approved', 'Approved with conditions', '2024-02-01 11:00:00+05:30', '2024-02-10 17:00:00+05:30'),
('d1000000-0000-0000-0000-000000000001', 'Central Ministry Endorsement', 4, 'central_admin', 'a1000000-0000-0000-0000-000000000001', 'approved', 'Endorsed for gazette notification', '2024-02-08 09:00:00+05:30', '2024-02-15 17:00:00+05:30'),

('d1000000-0000-0000-0000-000000000002', 'Field Officer Submission', 1, 'field_officer', 'a1000000-0000-0000-0000-000000000006', 'approved', 'SIA report submitted', '2024-03-10 09:00:00+05:30', '2024-03-15 17:00:00+05:30'),
('d1000000-0000-0000-0000-000000000002', 'District Collector Review', 2, 'district_collector', 'a1000000-0000-0000-0000-000000000003', 'approved', 'Reviewed, pending state approval', '2024-03-18 14:00:00+05:30', '2024-03-25 17:00:00+05:30'),
('d1000000-0000-0000-0000-000000000002', 'State Officer Approval', 3, 'state_officer', 'a1000000-0000-0000-0000-000000000002', 'pending', NULL, NULL, '2024-04-10 17:00:00+05:30'),

('d1000000-0000-0000-0000-000000000003', 'Field Officer Submission', 1, 'field_officer', 'a1000000-0000-0000-0000-000000000004', 'approved', 'Initial documents submitted', '2024-04-05 11:30:00+05:30', '2024-04-10 17:00:00+05:30'),
('d1000000-0000-0000-0000-000000000003', 'District Collector Review', 2, 'district_collector', 'a1000000-0000-0000-0000-000000000003', 'pending', NULL, NULL, '2024-04-20 17:00:00+05:30');

-- AFFECTED FAMILIES
INSERT INTO affected_families (project_id, parcel_id, family_head, family_size, category, is_displaced, rr_status, rr_site_allotted, rr_house_constructed, livelihood_restored) VALUES
('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Muthusamy Gounder', 5, 'OBC', TRUE, 'in_progress', TRUE, FALSE, FALSE),
('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 'Lakshmi Devi Selvam', 4, 'General', TRUE, 'completed', TRUE, TRUE, TRUE),
('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003', 'Ramasamy Pillai', 6, 'SC', TRUE, 'not_started', FALSE, FALSE, FALSE),
('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000004', 'Chinnaponnu Natarajan', 3, 'OBC', FALSE, 'completed', FALSE, FALSE, TRUE),
('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000005', 'Kamala Subramaniam', 4, 'General', TRUE, 'completed', TRUE, TRUE, TRUE),
('b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000011', 'CMDA (Govt)', 0, 'General', FALSE, 'completed', FALSE, FALSE, FALSE),
('b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000012', 'Residents Association OMR-42', 18, 'General', TRUE, 'in_progress', TRUE, FALSE, TRUE),
('b1000000-0000-0000-0000-000000000006', NULL, 'Ennore Fishing Community Leader', 12, 'SC', TRUE, 'not_started', FALSE, FALSE, FALSE),
('b1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000021', 'Arjunan Chinnathurai', 4, 'OBC', FALSE, 'not_started', FALSE, FALSE, FALSE),
('b1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000022', 'Saraswathi Murugesan', 5, 'SC', TRUE, 'not_started', FALSE, FALSE, FALSE);

-- MILESTONES
INSERT INTO milestones (project_id, milestone_name, stage, target_date, achieved_date, is_achieved, is_critical) VALUES
('b1000000-0000-0000-0000-000000000001', 'Social Impact Assessment Completion', 'proposed', '2022-08-31', '2022-09-10', TRUE, TRUE),
('b1000000-0000-0000-0000-000000000001', 'Section 11 Notification', 'section_11_notification', '2022-10-31', '2022-10-15', TRUE, TRUE),
('b1000000-0000-0000-0000-000000000001', 'Section 19 Declaration', 'section_19_declaration', '2023-03-31', '2023-04-20', TRUE, TRUE),
('b1000000-0000-0000-0000-000000000001', 'Award Declaration - 80% Parcels', 'award_declared', '2023-12-31', NULL, FALSE, TRUE),
('b1000000-0000-0000-0000-000000000001', 'Compensation Disbursement - 100%', 'compensation_paid', '2024-09-30', NULL, FALSE, TRUE),
('b1000000-0000-0000-0000-000000000001', 'Full Possession', 'possession_taken', '2025-03-31', NULL, FALSE, TRUE),

('b1000000-0000-0000-0000-000000000002', 'SIA Approval', 'proposed', '2021-06-30', '2021-07-01', TRUE, FALSE),
('b1000000-0000-0000-0000-000000000002', 'Section 11 Notification', 'section_11_notification', '2021-08-31', '2021-08-01', TRUE, TRUE),
('b1000000-0000-0000-0000-000000000002', 'Section 19 Declaration', 'section_19_declaration', '2022-01-31', '2022-01-15', TRUE, TRUE),
('b1000000-0000-0000-0000-000000000002', 'Award - 90% Parcels', 'award_declared', '2022-07-31', '2022-07-20', TRUE, TRUE),
('b1000000-0000-0000-0000-000000000002', '100% Compensation Paid', 'compensation_paid', '2023-12-31', NULL, FALSE, TRUE),

('b1000000-0000-0000-0000-000000000008', 'SIA Initiation', 'proposed', '2023-01-31', '2023-02-10', TRUE, FALSE),
('b1000000-0000-0000-0000-000000000008', 'Section 11 Notification', 'section_11_notification', '2023-06-30', '2023-06-15', TRUE, TRUE),
('b1000000-0000-0000-0000-000000000008', 'Section 19 Declaration', 'section_19_declaration', '2024-01-31', NULL, FALSE, TRUE),
('b1000000-0000-0000-0000-000000000008', 'Award Declaration', 'award_declared', '2025-06-30', NULL, FALSE, TRUE);

-- ALERTS
INSERT INTO alerts (project_id, alert_type, severity, title, description, target_role) VALUES
('b1000000-0000-0000-0000-000000000001', 'deadline_breach', 'critical',
 'Award Declaration Overdue - Parandur Airport',
 '80% award target was due 2023-12-31. Currently at 42%. Immediate action required for 890 parcels.',
 'district_collector'),
('b1000000-0000-0000-0000-000000000008', 'pending_approval', 'high',
 'CPRR Section 19 Declaration Pending',
 'Section 19 declaration for Chennai Peripheral Ring Road (Ponneri section) is overdue by 45 days.',
 'state_officer'),
('b1000000-0000-0000-0000-000000000006', 'compensation_delay', 'high',
 'Compensation Pending - Port Road Ennore Section',
 '12 displaced fishing families have not received compensation. Statutory 3-month deadline approaching.',
 'district_collector'),
('b1000000-0000-0000-0000-000000000002', 'deadline_breach', 'medium',
 'Metro Phase 2 Compensation - Final Tranche Pending',
 'Remaining 15% compensation (₹84.5L) for Taramani station parcels pending bank transfer.',
 'field_officer'),
('b1000000-0000-0000-0000-000000000001', 'rr_delay', 'high',
 'R&R Progress Stalled - Parandur Airport',
 '48 displaced families without R&R site allotment. RFCTLARR deadline breach risk.',
 'state_officer');

-- NOTIFICATIONS (Statutory)
INSERT INTO notifications (project_id, notification_type, gazette_number, gazette_date, issued_by, total_area_ha) VALUES
('b1000000-0000-0000-0000-000000000001', 'section_11', 'TN/GAZETTE/2022/1041', '2022-10-15', 'District Collector, Kancheepuram', 1200.00),
('b1000000-0000-0000-0000-000000000001', 'section_19', 'TN/GAZETTE/2023/0428', '2023-04-20', 'District Collector, Kancheepuram', 680.00),
('b1000000-0000-0000-0000-000000000002', 'section_11', 'TN/GAZETTE/2021/0872', '2021-08-01', 'District Collector, Chennai', 48.50),
('b1000000-0000-0000-0000-000000000002', 'section_19', 'TN/GAZETTE/2022/0124', '2022-01-15', 'District Collector, Chennai', 38.20),
('b1000000-0000-0000-0000-000000000004', 'section_11', 'TN/GAZETTE/2020/0410', '2020-04-15', 'District Collector, Kancheepuram', 180.00),
('b1000000-0000-0000-0000-000000000004', 'section_19', 'TN/GAZETTE/2020/1102', '2020-11-20', 'District Collector, Kancheepuram', 155.00),
('b1000000-0000-0000-0000-000000000008', 'section_11', 'TN/GAZETTE/2023/0618', '2023-06-15', 'District Collector, Chennai', 220.00);

-- ============================================================
-- INNOVATION 1: SUITABILITY ANALYSES
-- ============================================================

INSERT INTO suitability_analyses (project_id, analysed_by, proposed_area_ha,
  score_settlements, score_multicrop, score_forest, score_infrastructure,
  score_complexity, score_connectivity, score_disaster_risk, score_social_sensitivity,
  overall_score, recommendation, reasoning, alternatives, analysed_at) VALUES
  ('b1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000001', 1900,
   38, 25, 78, 60, 42, 72, 65, 35,
   52, 'CONDITIONAL',
   'The Parandur site scores 52/100. Key concerns: (1) High multi-crop agricultural land concentration (75% of proposed area is paddy/sugarcane — RFCTLARR Section 10 mandates food security assessment), (2) 15+ villages within acquisition boundary with ~4,200 families, (3) Historical acquisition complexity in Kancheepuram region is high (avg 8.2 years). Site is technically feasible but will require significant R&R resources and legal challenges are likely.',
   '[{"name":"Alternative A — Sriperumbudur Corridor","score":71,"area_ha":1850,"reason":"Lower settlement density, existing SIPCOT infrastructure reduces cost, good rail connectivity. Multi-crop land only 30%."},{"name":"Alternative B — Maraimalai Nagar Extension","score":65,"area_ha":1950,"reason":"Coastal zone reduces conflict, but flood risk moderate. Industrial zone adjacency beneficial. SC/ST household concentration low."}]'::JSONB,
   '2024-03-12T14:30:00+05:30'),
  ('b1000000-0000-0000-0000-000000000008',
   'a1000000-0000-0000-0000-000000000002', 310,
   64, 58, 82, 70, 55, 78, 68, 62,
   67, 'SUITABLE',
   'The Chennai Peripheral Ring Road (CPRR) Phase 1 corridor scores 67/100. Positives: (1) Lower multi-crop agricultural percentage (42%), (2) Good connectivity to existing NH-16 and NH-32, (3) Moderate settlement density with 8 major villages, (4) Lower flood risk as corridor avoids Cooum floodplain. Recommendation: SUITABLE with focused R&R planning for 3 critical settlement pockets.',
   '[{"name":"Alternative Inner Loop","score":48,"area_ha":280,"reason":"Higher settlement density, passes through 14 established villages. Lower score despite shorter length."},{"name":"Alternative Outer Bypass","score":61,"area_ha":340,"reason":"Avoids dense settlements but adds 12 km length. Higher forest proximity lowers environmental score."}]'::JSONB,
   '2023-05-20T11:15:00+05:30');

-- ============================================================
-- INNOVATION 2: RIPPLE IMPACTS
-- ============================================================

INSERT INTO ripple_impacts (source_parcel_id, source_issue, impact_chain, total_delay_days, critical_path, calculated_at) VALUES
  ('c1000000-0000-0000-0000-000000000001',
   'Compensation dispute filed — court stay order pending',
   '[{"stage":"Award","entity":"Survey 145/2A","delay_days":90,"severity":"high","reason":"Court stay order blocks award finalization"},{"stage":"Compensation","entity":"3 adjacent parcels in Block A","delay_days":120,"severity":"high","reason":"Block A section compensation cannot be processed until 145/2A resolved — RFCTLARR requires block-level award"},{"stage":"Possession","entity":"Block A — 48.5 Ha","delay_days":180,"severity":"critical","reason":"Physical possession of Block A cannot commence until all block compensation settled"},{"stage":"Project Section","entity":"Runway Approach Zone — Parandur Airport","delay_days":210,"severity":"critical","reason":"Approach zone construction delayed pending Block A possession"},{"stage":"Project Milestone","entity":"Airport overall completion","delay_days":240,"severity":"critical","reason":"Approach zone delay cascades to overall project commissioning deadline — currently 2030-03-31"}]'::JSONB,
   240, TRUE, '2024-06-10T16:45:00+05:30'),
  ('c1000000-0000-0000-0000-000000000021',
   'Section 11 notification challenged — legal notice from landowner',
   '[{"stage":"Section 19","entity":"Ponneri Stretch — 18.4 Ha","delay_days":60,"severity":"medium","reason":"Section 19 declaration blocked pending court admission of challenge"},{"stage":"Award","entity":"Ponneri Parcels","delay_days":120,"severity":"high","reason":"No award can be declared until Section 19 is finalized"},{"stage":"Project Section","entity":"CPRR — Ponneri Segment 8.2 km","delay_days":150,"severity":"high","reason":"Ring road alignment through Ponneri blocked"}]'::JSONB,
   150, FALSE, '2024-08-15T10:00:00+05:30');

-- ============================================================
-- INNOVATION 3: LANDOWNER PORTAL DATA
-- ============================================================

-- Landowner users
INSERT INTO landowner_users (id, name, phone, phone_last4, email, survey_numbers) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'Muthusamy Gounder', '9840001204', '1204', 'muthu.gounder@gmail.com', ARRAY['145/2A','146/1B']),
  ('e1000000-0000-0000-0000-000000000002', 'Ramasamy Pillai', '9840001210', '1210', 'ramasamy.p@yahoo.com', ARRAY['148/3']),
  ('e1000000-0000-0000-0000-000000000003', 'Kamala Subramaniam', '9840001220', '1220', NULL, ARRAY['160/2A']),
  ('e1000000-0000-0000-0000-000000000004', 'Arjunan Chinnathurai', '9840002201', '2201', 'arjunan.c@gmail.com', ARRAY['88/1']),
  ('e1000000-0000-0000-0000-000000000005', 'Saraswathi Murugesan', '9840002205', '2205', NULL, ARRAY['92/3B']);

-- Grievances
INSERT INTO grievances (grievance_number, project_id, parcel_id, submitted_by, landowner_name, survey_number, subject, description, grievance_type, status, priority, assigned_to, submitted_at) VALUES
  ('GRV/CHN/2024/001', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001',
   'e1000000-0000-0000-0000-000000000001', 'Muthusamy Gounder', '145/2A',
   'Objection to Section 19 Declaration — Market value underassessed',
   'The market value assessed for survey no. 145/2A at ₹186.75L is significantly below current market rate. Similar land in Parandur sold for ₹28L/cent in 2023. Request reassessment per RFCTLARR Section 26.',
   'compensation_dispute', 'under_review', 'high', 'a1000000-0000-0000-0000-000000000003', '2024-02-15T10:00:00+05:30'),
  ('GRV/CHN/2024/002', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003',
   'e1000000-0000-0000-0000-000000000002', 'Ramasamy Pillai', '148/3',
   'R&R site allotment pending for 8 months — no communication from authority',
   'Despite being declared displaced as per Section 19, no R&R site has been allotted in 8 months. Family of 6 living in temporary shelter. Request immediate action.',
   'rr_grievance', 'submitted', 'high', NULL, '2024-05-20T11:00:00+05:30'),
  ('GRV/CHN/2024/003', 'b1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000021',
   'e1000000-0000-0000-0000-000000000004', 'Arjunan Chinnathurai', '88/1',
   'Objection to Section 11 — Land is multi-generation ancestral property',
   'The land proposed for CPRR is ancestral property held continuously for 4 generations. Request SIA to include heritage and cultural impact assessment.',
   'objection', 'acknowledged', 'normal', 'a1000000-0000-0000-0000-000000000003', '2024-06-01T09:00:00+05:30');

-- Field entries
INSERT INTO field_entries (parcel_id, project_id, officer_id, visit_date, gps_lat, gps_lng, gps_accuracy_m, field_status, land_use_actual, structures_present, structure_count, trees_present, irrigation_present, notes, is_verified) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000004', '2024-03-10', 12.8175, 80.0085, 4.2,
   'verified', 'agricultural', FALSE, 0, TRUE, TRUE, 'Active paddy cultivation. No encroachment. Boundary markers intact. Owner cooperative.', TRUE),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000004', '2024-03-11', 12.8178, 80.0235, 5.1,
   'disputed', 'agricultural', FALSE, 0, TRUE, TRUE, 'Owner disputes boundary — claims 15.6 Ha but revenue records show 15.6 Ha. Requires resurvey.', FALSE),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000006', '2024-03-15', 12.8175, 80.0415, 3.8,
   'possession_ready', 'residential', TRUE, 1, FALSE, FALSE, 'Single residential structure — owner has vacated. Possession can proceed.', TRUE),
  ('c1000000-0000-0000-0000-000000000021', 'b1000000-0000-0000-0000-000000000008',
   'a1000000-0000-0000-0000-000000000006', '2024-06-05', 13.3410, 80.2050, 6.0,
   'access_blocked', 'agricultural', FALSE, 0, TRUE, TRUE, 'Access road blocked due to local protest. Field verification incomplete.', FALSE);

-- Land offers (Innovation 3)
INSERT INTO land_offers (offer_number, landowner_name, landowner_phone, landowner_email, survey_number, village, taluk, district, area_ha, land_use, asking_price_lakh, offer_reason, suitable_for, status, submitted_at) VALUES
  ('OFFER/CHN/2024/001', 'Subbaiah Rajan', '9840005001', 'subbaiah.r@gmail.com', '201/3A', 'Sriperumbudur', 'Sriperumbudur', 'Chennai', 4.80, 'agricultural', 96.0,
   'My family has 4 parcels in this area. Happy to offer this one for infrastructure use as we are planning to consolidate farming elsewhere.',
   'Industrial, Highway', 'submitted', '2024-06-10T14:30:00+05:30'),
  ('OFFER/CHN/2024/002', 'Bhavani Krishnan', '9840005002', 'bhavani.k@yahoo.com', '88/5', 'Ponneri', 'Ponneri', 'Chennai', 2.30, 'wasteland', 23.0,
   'Wasteland parcel — not cultivated for 10 years. Willing to offer for road widening.',
   'Highway, Ring Road', 'under_review', '2024-07-05T10:00:00+05:30'),
  ('OFFER/CHN/2024/003', 'Chellapandi Murugan', '9840005003', NULL, '312/1B', 'Avadi', 'Avadi', 'Chennai', 1.20, 'commercial', 60.0,
   'Commercial plot near Ring Road alignment. Willing to sell to NHAI at fair value.',
   'Highway, Metro Depot', 'declined', '2024-05-15T16:20:00+05:30');

-- Documents
INSERT INTO documents (project_id, parcel_id, proposal_id, doc_type, file_name, file_path, file_size_kb, mime_type, uploaded_by) VALUES
  ('b1000000-0000-0000-0000-000000000001', NULL, NULL, 'gazette_notification', 'section_11_parandur_TN2022_1041.pdf', '/uploads/chnarpt001/sec11_1041.pdf', 1240, 'application/pdf', 'a1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000001', NULL, NULL, 'gazette_notification', 'section_19_parandur_TN2023_0428.pdf', '/uploads/chnarpt001/sec19_0428.pdf', 980, 'application/pdf', 'a1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', NULL, 'award', 'award_146_1B_2023_1110.pdf', '/uploads/chnarpt001/award_146.pdf', 560, 'application/pdf', 'a1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000002', NULL, NULL, 'gazette_notification', 'metro_sec11_TN2021_0872.pdf', '/uploads/chnmetr002/sec11_0872.pdf', 890, 'application/pdf', 'a1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', NULL, 'title_deed', 'title_deed_145_2A.pdf', '/uploads/chnarpt001/title_145.pdf', 340, 'application/pdf', 'a1000000-0000-0000-0000-000000000004'),
  ('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', NULL, 'field_photo', 'field_145_2A_2024_march.jpg', '/uploads/chnarpt001/photo_145.jpg', 2100, 'image/jpeg', 'a1000000-0000-0000-0000-000000000004');

-- Integration logs (Mock API calls)
INSERT INTO integration_logs (system_name, endpoint, request_type, status, response_time_ms, called_by, called_at) VALUES
  ('TN Land Records (Patta/Chitta)', '/api/v1/land-records/survey/145-2A', 'GET', 'success', 245, 'a1000000-0000-0000-0000-000000000004', '2024-03-10T09:15:00+05:30'),
  ('TN Bhoomi Portal', '/api/v1/cadastral/maps/kancheepuram/parandur', 'GET', 'success', 1280, 'a1000000-0000-0000-0000-000000000004', '2024-03-10T09:16:00+05:30'),
  ('PFMS (Public Financial Mgmt System)', '/api/v1/disburse/compensation/CHN-ARPT-001', 'POST', 'success', 890, 'a1000000-0000-0000-0000-000000000003', '2024-04-05T14:30:00+05:30'),
  ('Aadhaar Authentication API', '/api/v1/kyc/verify', 'POST', 'success', 420, 'a1000000-0000-0000-0000-000000000004', '2024-04-05T14:31:00+05:30'),
  ('Tamil Nadu Revenue Dept API', '/api/v1/section-11/gazette/submit', 'POST', 'success', 3200, 'a1000000-0000-0000-0000-000000000003', '2024-02-01T11:00:00+05:30'),
  ('National Highways GIS Portal', '/api/v1/alignment/export/geojson', 'GET', 'failed', 15000, 'a1000000-0000-0000-0000-000000000006', '2024-06-15T10:30:00+05:30');

-- ============================================================
-- UPDATE SEQUENCES AND SUMMARY
-- ============================================================

-- Refresh materialized views if any
-- Rebuild indexes for performance
REINDEX TABLE land_parcels;
REINDEX TABLE projects;

-- Update project progress percentages based on stages
UPDATE projects SET progress_pct = 
  CASE current_stage
    WHEN 'proposed' THEN 10
    WHEN 'section_11_notification' THEN 25
    WHEN 'section_19_declaration' THEN 40
    WHEN 'award_declared' THEN 55
    WHEN 'compensation_assessed' THEN 65
    WHEN 'compensation_paid' THEN 75
    WHEN 'possession_taken' THEN 90
    WHEN 'closed' THEN 100
    ELSE progress_pct
  END
WHERE progress_pct = 0;

-- Create sample audit log entries
INSERT INTO audit_logs (table_name, record_id, action, new_data, changed_by, changed_at) VALUES
  ('projects', 'b1000000-0000-0000-0000-000000000001', 'UPDATE', 
   '{"current_stage":"section_19_declaration","area_notified_ha":1200.00}'::JSONB,
   'a1000000-0000-0000-0000-000000000003', '2023-04-20T16:30:00+05:30'),
  ('land_parcels', 'c1000000-0000-0000-0000-000000000002', 'UPDATE',
   '{"stage":"award_declared","award_date":"2023-11-10","compensation_assessed_lakh":124.50}'::JSONB,
   'a1000000-0000-0000-0000-000000000003', '2023-11-10T11:00:00+05:30'),
  ('proposals', 'd1000000-0000-0000-0000-000000000001', 'UPDATE',
   '{"status":"approved","approved_by":"a1000000-0000-0000-0000-000000000002","approved_at":"2024-02-01T11:00:00+05:30"}'::JSONB,
   'a1000000-0000-0000-0000-000000000002', '2024-02-01T11:00:00+05:30');

-- Vacuum and analyze for optimal query performance
VACUUM ANALYZE;

-- ============================================================
-- SEED DATA COMPLETE
-- Chennai District NLAMS Prototype
-- 8 Projects | 12 Land Parcels | 3 Proposals | 10 Affected Families
-- Innovation Data: Suitability Analysis, Ripple Impacts, Land Offers
-- ============================================================
