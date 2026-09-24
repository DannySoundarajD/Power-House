# Run NLAMS Locally (No Deployment)

## Quick Start - 3 Simple Steps

### Step 1: Start Backend
Open a terminal and run:
```powershell
cd d:\SIH2026\PS3\backend
npm start
```

✅ Backend will run on **http://localhost:5000**

### Step 2: Start Frontend
Open another terminal and run:
```powershell
cd d:\SIH2026\PS3\frontend
npm run dev
```

✅ Frontend will run on **http://localhost:5173**

### Step 3: Open in Browser
Open your browser and go to:
- **http://localhost:5173**

## Login Credentials
- **Email:** `collector.chennai@tn.gov.in`
- **Password:** `Password@123`

## Other Test Users (all use `Password@123`)
- `admin@nlams.gov.in` - Central Admin
- `surveyor.south@tn.gov.in` - Surveyor  
- `legal.chennai@tn.gov.in` - Legal Officer
- `comp.officer@tn.gov.in` - Compensation Officer
- `owner.smith@gmail.com` - Landowner
- `owner.kumar@gmail.com` - Landowner

## That's It!

No ngrok, no Vercel, no deployment needed. Just local development.

## Troubleshooting

### If backend fails to start
Check if PostgreSQL is running:
```powershell
# Check service status
Get-Service -Name postgresql*
```

If not running:
```powershell
# Start PostgreSQL service
Start-Service -Name postgresql-x64-16
```

### If port 5000 or 5173 is already in use
Find and kill the process:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

### If login fails
The password hash should already be correct, but if needed:
```powershell
# Connect to database
$env:Path = "C:\Program Files\PostgreSQL\16\bin;" + $env:Path
psql -U postgres -d nlams_db
# Password: Danny123$1

# In psql:
UPDATE users SET password_hash = '$2b$12$7OpSfzVsDPg4kxbFjbvxtOoeJSkO3PFIAsuZD4kFOr3TtvSfE8yf6' 
WHERE email = 'collector.chennai@tn.gov.in';
\q
```

## Configuration

### Backend Environment (.env)
Located at `d:\SIH2026\PS3\backend\.env` - already configured

### Frontend Environment  
Located at `d:\SIH2026\PS3\frontend\.env.development` - already configured to use `http://localhost:5000/api`

## Stop the Application

Press **Ctrl+C** in both terminal windows (backend and frontend) to stop the servers.
