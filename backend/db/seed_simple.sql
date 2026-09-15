-- NLAMS Simple Seed Data (Matches schema_simple.sql)

-- Clear existing data
TRUNCATE users, projects, land_parcels, proposals, notifications, alerts, 
         audit_logs, suitability_analyses, landowner_users, integration_logs CASCADE;

-- Insert Users (7 users)
INSERT INTO users (id, name, email, password_hash, role, department, district, state, phone, is_active) VALUES
('a1000000-0000-0000-0000-000000000001', 'Rajesh Kumar IAS', 'rajesh.kumar@dolr.gov.in', 
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEkKwO', -- Password@123
 'central_admin', 'Department of Land Resources', 'New Delhi', 'Delhi', '9811001234', TRUE),

('a1000000-0000-0000-0000-000000000002', 'Priya Chandran IAS', 'priya.chandran@tn.gov.in',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEkKwO', -- Password@123
 'state_officer', 'Tamil Nadu Land Acquisition', 'Chennai', 'Tamil Nadu', '9840001111', TRUE),

('a1000000-0000-0000-0000-000000000003', 'Senthil Murugan IAS', 'collector.chennai@tn.gov.in',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEkKwO', -- Password@123
 'district_collector', 'District Collectorate Chennai', 'Chennai', 'Tamil Nadu', '9840002222', TRUE),

('a1000000-0000-0000-0000-000000000004', 'Kumaran Selvam', 'kumaran.s@tn.gov.in',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEkKwO', -- Password@123
 'field_officer', 'Revenue Department', 'Chennai', 'Tamil Nadu', '9840003333', TRUE),

('a1000000-0000-0000-0000-000000000005', 'Anand Krishnamurthy', 'anand.k@aai.aero',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEkKwO', -- Password@123
 'project_agency', 'Airports Authority of India', 'Chennai', 'Tamil Nadu', '9840004444', TRUE),

('a1000000-0000-0000-0000-000000000006', 'Lakshmi Venkatesh', 'lakshmi.v@cmrl.gov.in',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEkKwO', -- Password@123
 'project_agency', 'Chennai Metro Rail Limited', 'Chennai', 'Tamil Nadu', '9840005555', TRUE),

('a1000000-0000-0000-0000-000000000007', 'Ravi Prakash', 'ravi.p@nhai.gov.in',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEkKwO', -- Password@123
 'project_agency', 'National Highways Authority', 'Chennai', 'Tamil Nadu', '9840006666', TRUE);

-- Insert Projects (8 Chennai projects)
INSERT INTO projects (id, project_code, project_name, project_type, acquiring_agency, purpose, 
                      district, state, total_area_required_ha, current_stage, start_date, 
                      target_completion_date, total_estimated_cost_lakh, created_by) VALUES

('b1000000-0000-0000-0000-000000000001', 'AAI-CHN-2024-001', 'Parandur Greenfield Airport', 
 'airport', 'Airports Authority of India', 'New international airport for Chennai', 
 'Kanchipuram', 'Tamil Nadu', 2300.00, 'section_19_declaration', '2024-01-15', 
 '2030-12-31', 1200000.00, 'a1000000-0000-0000-0000-000000000005'),

('b1000000-0000-0000-0000-000000000002', 'CMRL-2024-002', 'Chennai Metro Phase 2 Extension', 
 'metro', 'Chennai Metro Rail Limited', 'Metro corridor extension - Madhavaram to SIPCOT', 
 'Chennai', 'Tamil Nadu', 120.50, 'section_23_award', '2023-06-01', 
 '2027-03-31', 85000.00, 'a1000000-0000-0000-0000-000000000006'),

('b1000000-0000-0000-0000-000000000003', 'TN-GOV-2024-003', 'New Secretariat Complex', 
 'government_building', 'Tamil Nadu Government', 'Integrated secretariat building', 
 'Chennai', 'Tamil Nadu', 18.30, 'compensation_disbursement', '2023-03-01', 
 '2025-12-31', 5200.00, 'a1000000-0000-0000-0000-000000000002'),

('b1000000-0000-0000-0000-000000000004', 'NHAI-2024-004', 'NH-48 Widening (Chennai-Bangalore)', 
 'highway', 'National Highways Authority of India', '6-lane widening of NH-48 corridor', 
 'Kanchipuram', 'Tamil Nadu', 45.20, 'section_11_survey', '2024-02-01', 
 '2026-06-30', 12500.00, 'a1000000-0000-0000-0000-000000000007'),

('b1000000-0000-0000-0000-000000000005', 'PORTS-2024-005', 'Kamarajar Port Expansion', 
 'port', 'Chennai Port Trust', 'Container terminal expansion', 
 'Chennai', 'Tamil Nadu', 580.00, 'project_proposal', '2024-04-01', 
 '2029-12-31', 45000.00, 'a1000000-0000-0000-0000-000000000002'),

('b1000000-0000-0000-0000-000000000006', 'NHAI-2024-006', 'Chennai Peripheral Ring Road', 
 'highway', 'National Highways Authority of India', 'Ring road to decongest Chennai', 
 'Chennai', 'Tamil Nadu', 75.70, 'section_4_intent', '2024-01-10', 
 '2028-03-31', 8500.00, 'a1000000-0000-0000-0000-000000000007'),

('b1000000-0000-0000-0000-000000000007', 'SIPCOT-2024-007', 'Sriperumbudur IT SEZ', 
 'industrial_corridor', 'SIPCOT', 'Special Economic Zone for IT/electronics', 
 'Kanchipuram', 'Tamil Nadu', 92.00, 'compensation_disbursement', '2023-09-01', 
 '2025-12-31', 3800.00, 'a1000000-0000-0000-0000-000000000002'),

('b1000000-0000-0000-0000-000000000008', 'TNHB-2024-008', 'Tambaram Satellite Town', 
 'smart_city', 'Tamil Nadu Housing Board', 'Integrated township development', 
 'Kanchipuram', 'Tamil Nadu', 150.00, 'project_proposal', '2024-03-15', 
 '2029-06-30', 6200.00, 'a1000000-0000-0000-0000-000000000002');

-- Insert Land Parcels (12 parcels)
INSERT INTO land_parcels (id, project_id, survey_number, patta_number, village, district, taluk,
                          area_ha, land_use, owner_name, latitude, longitude, current_stage,
                          market_value_lakh, compensation_assessed_lakh, compensation_paid_lakh) VALUES

('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 
 '145/2A', 'P2045', 'Parandur', 'Kanchipuram', 'Kanchipuram', 
 12.45, 'agricultural', 'Muthusamy Gounder', 12.8156, 80.0051, 'section_19_declaration',
 186.75, 186.75, 0),

('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001',
 '145/3B', 'P2046', 'Parandur', 'Kanchipuram', 'Kanchipuram',
 8.20, 'agricultural', 'Lakshmi Narayanan', 12.8162, 80.0058, 'section_19_declaration',
 123.00, 123.00, 0),

('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002',
 '87/1A', 'P5012', 'Madhavaram', 'Chennai', 'Madhavaram',
 2.15, 'residential', 'Ramasamy Pillai', 13.1485, 80.2314, 'section_23_award',
 645.00, 645.00, 322.50);

-- Insert Proposals
INSERT INTO proposals (id, proposal_number, project_id, title, description, submitted_by,
                       current_status, submitted_at) VALUES

('d1000000-0000-0000-0000-000000000001', 'PROP-2024-001', 'b1000000-0000-0000-0000-000000000001',
 'Land Acquisition for Parandur Airport Phase 1', 'Initial land acquisition for runway and terminal',
 'a1000000-0000-0000-0000-000000000005', 'approved', '2024-01-20 10:00:00'),

('d1000000-0000-0000-0000-000000000002', 'PROP-2024-002', 'b1000000-0000-0000-0000-000000000002',
 'Metro Phase 2 - Madhavaram Section', 'Land for metro elevated corridor',
 'a1000000-0000-0000-0000-000000000006', 'approved', '2023-06-15 14:30:00');

-- Insert Notifications
INSERT INTO notifications (id, project_id, notification_type, section_reference, gazette_number,
                          published_date, expiry_date, content, is_active) VALUES

('f1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
 'Section 19 Declaration', 'RFCTLARR 2013 Section 19', 'TN-GAZ-2024-0156',
 '2024-02-01', '2024-05-01', 'Declaration for Parandur Airport land acquisition', TRUE);

-- Insert Alerts
INSERT INTO alerts (id, project_id, title, description, severity, is_resolved) VALUES

('g1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
 'SIA Clearance Pending', 'Social Impact Assessment report awaiting approval', 'high', FALSE),

('g1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002',
 'Compensation Disbursement Delayed', '15 families awaiting compensation payment', 'medium', FALSE);

-- Insert Suitability Analyses
INSERT INTO suitability_analyses (id, project_id, analysis_date, settlement_score, agriculture_score,
                                  forest_score, overall_score, recommendation, reasoning) VALUES

('h1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
 '2024-01-10', 75, 65, 85, 78, 'SUITABLE',
 'Low settlement density with minimal displacement. Agricultural land is single-crop. No protected forests nearby.');

-- Insert Landowner Users
INSERT INTO landowner_users (id, phone, name, aadhaar_last4, is_verified) VALUES

('e1000000-0000-0000-0000-000000000001', '9840001204', 'Muthusamy Gounder', '1204', TRUE),
('e1000000-0000-0000-0000-000000000002', '9840001210', 'Ramasamy Pillai', '1210', TRUE);

-- Insert Integration Logs
INSERT INTO integration_logs (api_name, endpoint, method, status_code, response_time_ms, called_by) VALUES

('DILRMP', '/api/v1/land-records', 'GET', 200, 245, 'a1000000-0000-0000-0000-000000000004'),
('PFMS', '/api/v1/payment-status', 'POST', 200, 189, 'a1000000-0000-0000-0000-000000000003');

-- Success message
SELECT 'Database seeded successfully with 7 users, 8 projects, and sample data!' AS status;
