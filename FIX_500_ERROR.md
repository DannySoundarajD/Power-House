# 🔧 Fix 500 Internal Server Error - Database Connection

## ❌ The Error

```
POST https://floristically-glottogonic-eusebio.ngrok-free.dev/api/auth/login 
500 (Internal Server Error)
```

## 🤔 What This Means

Your **backend is running** (good!) but it's crashing when trying to connect to the **database**.

Common causes:
1. PostgreSQL service not running
2. Database doesn't exist
3. Wrong credentials in `.env`
4. Database schema not loaded

---

## ✅ Quick Fix

### Step 1: Check PostgreSQL Service

```powershell
# Check if PostgreSQL is running
Get-Service postgresql*
```

**If stopped, start it:**
```powershell
# Replace with your actual service name (check output above)
Start-Service postgresql-x64-16
```

### Step 2: Verify Database Exists

```powershell
# Connect to PostgreSQL
psql -U postgres

# List databases
\l

# Should see: nlams_db

# If NOT there, create it:
CREATE DATABASE nlams_db;
CREATE USER nlams_user WITH PASSWORD 'nlams_secure_2024';
GRANT ALL PRIVILEGES ON DATABASE nlams_db TO nlams_user;
\q
```

### Step 3: Load Database Schema

```powershell
cd d:\SIH2026\PS3\backend

# Enable PostGIS extension
psql -U postgres -d nlams_db -c "CREATE EXTENSION IF NOT EXISTS postgis;"

# Load schema
psql -U nlams_user -d nlams_db -f db/schema.sql

# Load seed data
psql -U nlams_user -d nlams_db -f db/seed.sql
```

**Enter password when prompted:** `nlams_secure_2024`

### Step 4: Check Backend .env File

```powershell
cd d:\SIH2026\PS3\backend

# Check if .env exists
Get-Content .env
```

**Should contain:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nlams_db
DB_USER=nlams_user
DB_PASSWORD=nlams_secure_2024

JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_REFRESH_SECRET=your_refresh_token_secret_key
JWT_EXPIRES_IN=8h

PORT=5000
NODE_ENV=development
```

**If .env doesn't exist:**
```powershell
Copy-Item .env.example .env
# Then edit .env with your database password
```

### Step 5: Restart Backend

```powershell
# Stop current backend (Ctrl+C in backend terminal)

# Restart
cd d:\SIH2026\PS3\backend
npm start
```

**Look for:**
```
✅ NLAMS Backend running on http://localhost:5000
```

**If you see database errors, the fix above didn't work.**

---

## 🚀 Even Easier: Use Setup Script

```powershell
cd d:\SIH2026\PS3\backend

# Run database setup wizard
.\setup-db.ps1
```

This script will:
1. Check PostgreSQL service
2. Create database if needed
3. Load schema
4. Load seed data
5. Configure everything

---

## 🔍 Check Backend Logs

Look at your **backend terminal** for errors. Common errors:

### Error: "password authentication failed"

**Fix:** Update `.env` with correct password

```powershell
cd backend
notepad .env
# Update DB_PASSWORD line
```

### Error: "database does not exist"

**Fix:** Create database (see Step 2 above)

### Error: "relation does not exist"

**Fix:** Load schema (see Step 3 above)

```powershell
psql -U nlams_user -d nlams_db -f db/schema.sql
```

### Error: "ECONNREFUSED"

**Fix:** PostgreSQL service not running

```powershell
Start-Service postgresql-x64-16
```

---

## 📋 Complete Setup from Scratch

If nothing works, start fresh:

### Step 1: Start PostgreSQL

```powershell
# Find your PostgreSQL service name
Get-Service postgresql*

# Start it (replace with your service name)
Start-Service postgresql-x64-16

# Verify it's running
Get-Service postgresql*
# Status should be "Running"
```

### Step 2: Create Database & User

```powershell
# Open psql as postgres superuser
psql -U postgres

# In psql prompt:
CREATE DATABASE nlams_db;
CREATE USER nlams_user WITH PASSWORD 'nlams_secure_2024';
GRANT ALL PRIVILEGES ON DATABASE nlams_db TO nlams_user;
ALTER DATABASE nlams_db OWNER TO nlams_user;

# Enable PostGIS
\c nlams_db
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

# Exit
\q
```

### Step 3: Load Schema as nlams_user

```powershell
cd d:\SIH2026\PS3\backend

# Load schema
psql -U nlams_user -d nlams_db -f db/schema.sql
# Enter password: nlams_secure_2024

# Load seed data
psql -U nlams_user -d nlams_db -f db/seed.sql
# Enter password: nlams_secure_2024
```

### Step 4: Verify Data Loaded

```powershell
psql -U nlams_user -d nlams_db

# In psql prompt:
# Check tables
\dt

# Count records
SELECT COUNT(*) FROM users;
# Should return: 7

SELECT COUNT(*) FROM projects;
# Should return: 8

# Exit
\q
```

### Step 5: Configure Backend .env

```powershell
cd d:\SIH2026\PS3\backend

# Create .env if not exists
if (!(Test-Path .env)) {
    Copy-Item .env.example .env
}

# Verify configuration
Get-Content .env
```

**Make sure these lines are correct:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nlams_db
DB_USER=nlams_user
DB_PASSWORD=nlams_secure_2024
```

### Step 6: Restart Backend

```powershell
# In backend terminal, stop with Ctrl+C

# Restart
npm start
```

**Should see:**
```
✅ NLAMS Backend running on http://localhost:5000
📦 Database: PostgreSQL + PostGIS
🔒 Security: JWT + Helmet + Rate Limiting
```

**No database errors!**

### Step 7: Test Backend

```powershell
# Test health endpoint
curl http://localhost:5000/health

# Should return:
# {"status":"ok","service":"NLAMS API","version":"1.0.0",...}
```

### Step 8: Test Login Locally

```powershell
# Try login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"collector.chennai@tn.gov.in\",\"password\":\"Password@123\"}'

# Should return:
# {"token":"eyJhb...", "user":{...}}
```

**If this works, backend is fully operational!**

---

## 🎯 Verify Everything Works

### Test Checklist

- [ ] PostgreSQL service running
- [ ] Database `nlams_db` exists
- [ ] Tables loaded (18 tables)
- [ ] Seed data loaded (7 users, 8 projects)
- [ ] Backend `.env` configured correctly
- [ ] Backend starts without errors
- [ ] Health endpoint works: `curl http://localhost:5000/health`
- [ ] Login works locally (see test above)
- [ ] Ngrok tunnel active
- [ ] Login works via ngrok: Try in browser at ngrok URL

---

## 🔧 Alternative: Use Frontend-Only Mode

If database setup is too complex right now, you can test the frontend with **mock data**:

### Option: Frontend with Mock Data

```powershell
cd d:\SIH2026\PS3\frontend

# Use development mode (has mock data built-in)
npm run dev

# In another terminal
ngrok http 5173

# Share ngrok URL - works without database!
```

Or deploy to Vercel without backend:

```powershell
cd frontend

# Point to mock/demo mode
Set-Content .env.production "VITE_API_URL=http://localhost:5000/api"

# Build and deploy
npm run build
vercel --prod
```

Frontend has mock data for:
- Login (any credentials work in dev mode)
- Dashboard (shows sample data)
- Projects (8 Chennai projects)
- Map (sample parcels)

---

## 💡 Pro Tips

### Save PostgreSQL Password

Create pgpass file to avoid entering password:

**Windows:** `%APPDATA%\postgresql\pgpass.conf`

```
localhost:5432:nlams_db:nlams_user:nlams_secure_2024
```

### Check PostgreSQL Logs

If still having issues:

```powershell
# PostgreSQL log location (typical path)
Get-Content "C:\Program Files\PostgreSQL\16\data\log\*.log" -Tail 50
```

### Restart PostgreSQL Service

```powershell
Restart-Service postgresql-x64-16
```

---

## 🐛 Still Not Working?

### Get Detailed Error

Look at your backend terminal, you should see detailed error message like:

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

Or:

```
error: password authentication failed for user "nlams_user"
```

Or:

```
error: relation "users" does not exist
```

**Share the specific error** and I can provide exact fix!

---

## ✅ Success!

Once fixed, you should:

1. ✅ Backend starts without errors
2. ✅ Can curl `http://localhost:5000/health`
3. ✅ Can login via ngrok URL in browser
4. ✅ Vercel frontend can login successfully
5. ✅ Dashboard loads with real data

---

<div align="center">

**Common Issue: Database Not Set Up**

**Quick Fix:** Run `.\setup-db.ps1` in backend folder

*Or follow Step 1-8 above for manual setup*

</div>
