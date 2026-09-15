# NLAMS Database Setup Script (PowerShell)
# Smart India Hackathon 2026 - PS-26016

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NLAMS Database Setup Wizard" -ForegroundColor Cyan
Write-Host "  Chennai District Prototype" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$DB_NAME = "nlams_db"
$DB_USER = "nlams_user"
$DB_PASSWORD = "nlams_secure_2024"
$POSTGRES_USER = "postgres"

Write-Host "Step 1: Checking PostgreSQL installation..." -ForegroundColor Yellow

# Check if psql is available
try {
    $null = Get-Command psql -ErrorAction Stop
    Write-Host "✓ PostgreSQL found" -ForegroundColor Green
} catch {
    Write-Host "✗ PostgreSQL not found in PATH" -ForegroundColor Red
    Write-Host "Please install PostgreSQL 16 from: https://www.postgresql.org/download/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Creating database and user..." -ForegroundColor Yellow

# Drop existing database if exists (for clean reinstall)
$dropDB = Read-Host "Drop existing database if exists? (y/N)"
if ($dropDB -eq "y" -or $dropDB -eq "Y") {
    Write-Host "Dropping existing database..." -ForegroundColor Yellow
    psql -U $POSTGRES_USER -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>$null
    psql -U $POSTGRES_USER -c "DROP USER IF EXISTS $DB_USER;" 2>$null
}

# Create user
Write-Host "Creating user '$DB_USER'..." -ForegroundColor Yellow
psql -U $POSTGRES_USER -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Note: User may already exist, continuing..." -ForegroundColor Yellow
}

# Create database
Write-Host "Creating database '$DB_NAME'..." -ForegroundColor Yellow
psql -U $POSTGRES_USER -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to create database" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Database created" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Installing PostGIS extension..." -ForegroundColor Yellow

psql -U $DB_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS postgis;"
psql -U $DB_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS ""uuid-ossp"";"
psql -U $DB_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install extensions" -ForegroundColor Red
    exit 1
}

Write-Host "✓ PostGIS installed" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Running schema migrations..." -ForegroundColor Yellow

psql -U $DB_USER -d $DB_NAME -f "db/schema.sql"

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to run schema" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Schema created" -ForegroundColor Green

Write-Host ""
Write-Host "Step 5: Seeding demo data..." -ForegroundColor Yellow

psql -U $DB_USER -d $DB_NAME -f "db/seed.sql"

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to seed data" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Data seeded" -ForegroundColor Green

Write-Host ""
Write-Host "Step 6: Verifying installation..." -ForegroundColor Yellow

# Check PostGIS version
$postgis_version = psql -U $DB_USER -d $DB_NAME -t -c "SELECT PostGIS_Version();"
Write-Host "PostGIS Version: $postgis_version" -ForegroundColor Cyan

# Check table counts
$tables = psql -U $DB_USER -d $DB_NAME -t -c "\dt" | Measure-Object -Line
Write-Host "Tables created: $($tables.Lines)" -ForegroundColor Cyan

$projects = psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM projects;"
Write-Host "Projects: $projects" -ForegroundColor Cyan

$parcels = psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM land_parcels;"
Write-Host "Land Parcels: $parcels" -ForegroundColor Cyan

$users = psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM users;"
Write-Host "Users: $users" -ForegroundColor Cyan

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Database Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Database Configuration:" -ForegroundColor Cyan
Write-Host "  Host: localhost" -ForegroundColor White
Write-Host "  Port: 5432" -ForegroundColor White
Write-Host "  Database: $DB_NAME" -ForegroundColor White
Write-Host "  User: $DB_USER" -ForegroundColor White
Write-Host "  Password: $DB_PASSWORD" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Copy .env.example to .env" -ForegroundColor White
Write-Host "  2. Update .env with database credentials" -ForegroundColor White
Write-Host "  3. Run: npm install" -ForegroundColor White
Write-Host "  4. Run: npm start" -ForegroundColor White
Write-Host ""
Write-Host "Access the application at:" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
