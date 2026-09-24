-- Populate all demo users for NLAMS
-- Password for all users: Password@123
-- Hash: $2b$12$7OpSfzVsDPg4kxbFjbvxtOoeJSkO3PFIAsuZD4kFOr3TtvSfE8yf6

-- First, clean existing users (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE users CASCADE;

-- Insert all demo users
INSERT INTO users (name, email, password_hash, role, department, district, phone, is_active, created_at, updated_at)
VALUES
  -- Central Admin
  ('System Admin', 'admin@nlams.gov.in', 
   '$2b$12$7OpSfzVsDPg4kxbFjbvxtOoeJSkO3PFIAsuZD4kFOr3TtvSfE8yf6',
   'central_admin', 'Ministry of Rural Development', 'New Delhi', '9810000001', TRUE, NOW(), NOW()),
  
  -- District Collector (Chennai)
  ('Senthil Murugan IAS', 'collector.chennai@tn.gov.in',
   '$2b$12$7OpSfzVsDPg4kxbFjbvxtOoeJSkO3PFIAsuZD4kFOr3TtvSfE8yf6',
   'district_collector', 'District Collectorate Chennai', 'Chennai', '9444000003', TRUE, NOW(), NOW()),
  
  -- State Officer
  ('Priya Chandran IAS', 'state.officer@tn.gov.in',
   '$2b$12$7OpSfzVsDPg4kxbFjbvxtOoeJSkO3PFIAsuZD4kFOr3TtvSfE8yf6',
   'state_officer', 'Revenue Department Tamil Nadu', 'Chennai', '9444000002', TRUE, NOW(), NOW()),
  
  -- Field Officer (Surveyor role)
  ('Kumaran Selvam', 'surveyor.south@tn.gov.in',
   '$2b$12$7OpSfzVsDPg4kxbFjbvxtOoeJSkO3PFIAsuZD4kFOr3TtvSfE8yf6',
   'field_officer', 'Survey Department Tamil Nadu', 'Chennai', '9840000004', TRUE, NOW(), NOW()),
  
  -- Field Officer (Legal)
  ('Meenakshi Rajan', 'legal.chennai@tn.gov.in',
   '$2b$12$7OpSfzVsDPg4kxbFjbvxtOoeJSkO3PFIAsuZD4kFOr3TtvSfE8yf6',
   'field_officer', 'Legal Department Chennai', 'Chennai', '9840000005', TRUE, NOW(), NOW()),
  
  -- Field Officer (Compensation)
  ('Anand Krishnamurthy', 'comp.officer@tn.gov.in',
   '$2b$12$7OpSfzVsDPg4kxbFjbvxtOoeJSkO3PFIAsuZD4kFOr3TtvSfE8yf6',
   'field_officer', 'Compensation Office Chennai', 'Chennai', '9840000006', TRUE, NOW(), NOW()),
  
  -- Project Agency (Landowner portal)
  ('John Smith', 'owner.smith@gmail.com',
   '$2b$12$7OpSfzVsDPg4kxbFjbvxtOoeJSkO3PFIAsuZD4kFOr3TtvSfE8yf6',
   'project_agency', 'Individual Landowner', 'Chennai', '9840000007', TRUE, NOW(), NOW()),
  
  ('Rajesh Kumar', 'owner.kumar@gmail.com',
   '$2b$12$7OpSfzVsDPg4kxbFjbvxtOoeJSkO3PFIAsuZD4kFOr3TtvSfE8yf6',
   'project_agency', 'Individual Landowner', 'Chennai', '9840000008', TRUE, NOW(), NOW())
ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- Verify insertion
SELECT 
  email, 
  name, 
  role,
  CASE WHEN is_active THEN 'Active' ELSE 'Inactive' END as status
FROM users 
ORDER BY role, email;
