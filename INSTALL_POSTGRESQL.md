# 🐘 Install PostgreSQL 16 + PostGIS for NLAMS

Complete installation guide for Windows.

---

## 📥 Step 1: Download PostgreSQL 16

### Option A: Official Installer (Recommended)

1. **Visit:** https://www.postgresql.org/download/windows/
2. **Click:** "Download the installer"
3. **Select:** PostgreSQL 16.x (latest stable)
4. **Choose:** Windows x86-64
5. **Download:** File size ~300 MB

**Direct link:** https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

---

## 🔧 Step 2: Install PostgreSQL

### Run the Installer

1. **Double-click** the downloaded `.exe` file
2. **Click** "Next" on welcome screen

### Installation Directory
- **Default:** `C:\Program Files\PostgreSQL\16`
- **Click:** "Next"

### Select Components
**✅ Check these:**
- [x] PostgreSQL Server
- [x] pgAdmin 4 (database management tool)
- [x] Command Line Tools
- [x] **Stack Builder** (IMPORTANT - for PostGIS!)

**Click:** "Next"

### Data Directory
- **Default:** `C:\Program Files\PostgreSQL\16\data`
- **Click:** "Next"

### Set Password
**⚠️ IMPORTANT:** Set a strong password for the `postgres` superuser

**Recommended:** `admin123` or `postgres123` (easy to remember for development)

**Write it down!** You'll need this.

**Click:** "Next"

### Port
- **Default:** `5432`
- **Keep default** unless you have another PostgreSQL instance
- **Click:** "Next"

### Locale
- **Default:** System default locale
- **Click:** "Next"

### Ready to Install
- **Review settings**
- **Click:** "Next"
- **Wait:** Installation takes 3-5 minutes

### Stack Builder
**✅ IMPORTANT:** When asked to launch Stack Builder:
- **Check:** "Yes, launch Stack Builder"
- **Click:** "Finish"

---

## 🗺️ Step 3: Install PostGIS (via Stack Builder)

### Stack Builder Opens Automatically

1. **Select:** PostgreSQL 16 on port 5432
2. **Click:** "Next"

3. **Expand:** "Spatial Extensions"
4. **Check:** ✅ **PostGIS 3.4.x Bundle for PostgreSQL 16**
5. **Click:** "Next"

6. **Download Directory:** Keep default
7. **Click:** "Next"

8. **Wait:** Downloads PostGIS (~50 MB)

9. **Click:** "Next" to install

10. **PostGIS Setup:**
    - **Click:** "I Agree"
    - **Keep all default options**
    - **Click:** "Next" → "Next" → "Yes" → "Close"

11. **Stack Builder:** Click "Finish"

---

## ✅ Step 4: Verify Installation

### Open PowerShell as Administrator

```powershell
# Check PostgreSQL is installed
Get-Service postgresql*

# Should show: postgresql-x64-16 (Running)
```

### Test psql Command

```powershell
# Add PostgreSQL to PATH if not already
$env:Path += ";C:\Program Files\PostgreSQL\16\bin"

# Test psql
psql --version

# Should show: psql (PostgreSQL) 16.x
```

### Connect to PostgreSQL

```powershell
# Connect as postgres superuser
psql -U postgres

# Enter the password you set during installation
```

**In psql prompt:**
```sql
-- Check PostGIS is available
SELECT * FROM pg_available_extensions WHERE name LIKE 'postgis';

-- Should show: postgis | 3.4.x | ...

-- Exit
\q
```

---

## 🔧 Step 5: Add PostgreSQL to PATH (Permanent)

So you can use `psql` command anywhere:

### Via PowerShell (Run as Administrator)

```powershell
# Get current PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")

# Add PostgreSQL bin directory
$newPath = $currentPath + ";C:\Program Files\PostgreSQL\16\bin"

# Set new PATH
[Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")

# Restart PowerShell for changes to take effect
```

### Verify PATH Update

**Close and reopen PowerShell**, then:

```powershell
psql --version
# Should work from any directory
```

---

## 🎯 Step 6: Setup NLAMS Database

Now that PostgreSQL is installed:

```powershell
cd d:\SIH2026\PS3\backend

# Run setup wizard
.\setup-db.ps1
```

**Follow the prompts:**
1. ✅ PostgreSQL check (should pass now!)
2. Enter postgres password (you set during installation)
3. Creates `nlams_db` database
4. Creates `nlams_user` user
5. Loads schema (18 tables)
6. Loads seed data (8 projects, 7 users)

**Should see:**
```
✓ PostgreSQL found
✓ Database created
✓ User created  
✓ PostGIS enabled
✓ Schema loaded (18 tables)
✓ Seed data loaded
✓ Setup complete!
```

---

## 🧪 Step 7: Test Everything Works

### Test Database Connection

```powershell
psql -U nlams_user -d nlams_db
# Password: nlams_secure_2024

# In psql:
SELECT COUNT(*) FROM users;
# Should return: 7

SELECT COUNT(*) FROM projects;  
# Should return: 8

\q
```

### Test Backend

```powershell
cd d:\SIH2026\PS3\backend

# Start backend
npm start

# Should see:
# ✅ NLAMS Backend running on http://localhost:5000
# 📦 Database: PostgreSQL + PostGIS
# No errors!
```

### Test API

**In another PowerShell:**

```powershell
# Test health
curl http://localhost:5000/health

# Test login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"collector.chennai@tn.gov.in\",\"password\":\"Password@123\"}'

# Should return JWT token!
```

---

## 🚀 Step 8: Deploy to Vercel + Ngrok

Now you have the full stack working:

```powershell
cd d:\SIH2026\PS3

# Run deployment script
.\deploy-vercel.ps1
```

This will:
1. ✅ Start backend (connects to PostgreSQL)
2. ✅ Create ngrok tunnel
3. ✅ Deploy frontend to Vercel
4. ✅ Give you permanent Vercel URL

---

## 🛠️ Troubleshooting

### "PostgreSQL service not starting"

**Check Windows Services:**
```powershell
# Open Services
services.msc

# Find: postgresql-x64-16
# Right-click → Start
```

### "psql not recognized"

**Add to PATH manually:**
1. Windows Key → Search "Environment Variables"
2. Click "Environment Variables"
3. Under "System variables", find "Path"
4. Click "Edit" → "New"
5. Add: `C:\Program Files\PostgreSQL\16\bin`
6. Click OK
7. Restart PowerShell

### "PostGIS not found"

**Install manually:**
```powershell
# Download PostGIS from:
# https://download.osgeo.org/postgis/windows/

# Or re-run Stack Builder
# C:\Program Files\PostgreSQL\16\bin\stackbuilder.exe
```

### "Password authentication failed"

**Reset postgres password:**
```powershell
# Edit pg_hba.conf
notepad "C:\Program Files\PostgreSQL\16\data\pg_hba.conf"

# Change "md5" to "trust" temporarily
# Restart PostgreSQL service
# Connect and change password
# Change back to "md5"
# Restart again
```

---

## 📊 What You Get

After installation:

- ✅ **PostgreSQL 16** - Modern SQL database
- ✅ **PostGIS 3.4** - Spatial/GIS extension
- ✅ **pgAdmin 4** - Database management GUI
- ✅ **psql** - Command-line tool
- ✅ **18 tables** - NLAMS schema loaded
- ✅ **Sample data** - 8 Chennai projects, 7 users
- ✅ **Backend working** - Connects to database
- ✅ **Ready to deploy** - Vercel + Ngrok

---

## 🎓 PostgreSQL Quick Reference

### Common Commands

```powershell
# Start PostgreSQL
Start-Service postgresql-x64-16

# Stop PostgreSQL
Stop-Service postgresql-x64-16

# Restart PostgreSQL
Restart-Service postgresql-x64-16

# Connect to database
psql -U nlams_user -d nlams_db

# Connect as superuser
psql -U postgres

# Backup database
pg_dump -U nlams_user nlams_db > backup.sql

# Restore database
psql -U nlams_user -d nlams_db < backup.sql
```

### psql Commands (inside psql prompt)

```sql
\l              -- List databases
\dt             -- List tables
\d table_name   -- Describe table
\q              -- Quit
```

---

## 💰 Cost

**PostgreSQL:** ✅ **100% FREE**
- Open source
- No license fees
- Unlimited use
- Enterprise-grade

---

## 🎉 Next Steps

1. **Install PostgreSQL** (follow steps above)
2. **Run:** `.\backend\setup-db.ps1`
3. **Start backend:** `cd backend && npm start`
4. **Deploy:** `.\deploy-vercel.ps1`
5. **Share Vercel URL** with your friend!

---

<div align="center">

**PostgreSQL Installation Time: ~15 minutes**

*Professional database for your NLAMS prototype!*

**Download now:** https://www.postgresql.org/download/windows/

</div>
