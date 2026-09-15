# 🌐 NLAMS Ngrok Deployment Guide

Complete guide to share your NLAMS app with remote users via ngrok.

---

## 🚀 Quick Start (Automated)

### Single Command Deployment

```powershell
.\deploy-ngrok.ps1
```

This script will:
1. ✅ Check ngrok installation
2. ✅ Install dependencies (backend + frontend)
3. ✅ Start backend server (http://localhost:5000)
4. ✅ Create ngrok tunnel for backend
5. ✅ Build frontend with backend ngrok URL
6. ✅ Start frontend preview server
7. ✅ Create ngrok tunnel for frontend
8. ✅ Display shareable URLs

**Expected Output:**
```
╔═══════════════════════════════════════════════════════════════╗
║  ✅ NLAMS DEPLOYMENT SUCCESSFUL!                              ║
╚═══════════════════════════════════════════════════════════════╝

📡 SHARE THESE URLS WITH YOUR FRIEND:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  🌐 Frontend (Main App):  https://xxxx-xxxx-xxxx.ngrok-free.app
  🔧 Backend API:          https://yyyy-yyyy-yyyy.ngrok-free.app
  📊 Ngrok Inspector:      http://localhost:4040
```

---

## 📋 Prerequisites

### 1. Install Ngrok

**Download:**
- Visit: https://ngrok.com/download
- Download for Windows
- Extract to a folder (e.g., `C:\ngrok`)

**Add to PATH:**
```powershell
# Option 1: Add to PATH via System Properties
# Windows Key → Search "Environment Variables"
# Edit PATH → Add ngrok folder path

# Option 2: Add to PATH via PowerShell (Admin)
$env:Path += ";C:\ngrok"
[Environment]::SetEnvironmentVariable("Path", $env:Path, "Machine")
```

**Verify Installation:**
```powershell
ngrok version
# Should show: ngrok version 3.x.x
```

### 2. Authenticate Ngrok

**Get Auth Token:**
1. Sign up at https://dashboard.ngrok.com/signup
2. Copy your auth token from https://dashboard.ngrok.com/get-started/your-authtoken

**Configure:**
```powershell
ngrok config add-authtoken <YOUR_AUTH_TOKEN>
```

### 3. Install Node.js Dependencies

```powershell
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

---

## 🎯 Option A: Automated Deployment (Recommended)

### Step 1: Run Deployment Script

```powershell
# Make sure you're in the project root (d:\SIH2026\PS3)
.\deploy-ngrok.ps1
```

### Step 2: Share URLs

The script will display URLs like:
```
🌐 Frontend (Main App):  https://1a2b-3c4d-5e6f.ngrok-free.app
🔧 Backend API:          https://7g8h-9i0j-1k2l.ngrok-free.app
```

**Share the Frontend URL** with your friend - that's the only URL they need!

### Step 3: Keep Terminal Open

- Leave the PowerShell window running
- All services will stop when you close it or press `Ctrl+C`

---

## 🛠 Option B: Manual Deployment

If the automated script has issues, follow these manual steps:

### Terminal 1: Start Backend

```powershell
cd backend

# Make sure .env exists
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
}

# Start backend
npm start
```

Wait until you see:
```
✅ NLAMS Backend running on http://localhost:5000
```

### Terminal 2: Create Backend Ngrok Tunnel

```powershell
ngrok http 5000
```

You'll see output like:
```
Forwarding  https://xxxx-yyyy-zzzz.ngrok-free.app -> http://localhost:5000
```

**Copy the HTTPS URL** (e.g., `https://xxxx-yyyy-zzzz.ngrok-free.app`)

### Terminal 3: Configure and Build Frontend

```powershell
cd frontend

# Create production environment file with backend ngrok URL
# Replace YOUR_BACKEND_NGROK_URL with the URL from Terminal 2
$backendUrl = "https://xxxx-yyyy-zzzz.ngrok-free.app"
Set-Content .env.production "VITE_API_URL=$backendUrl/api"

# Build frontend
npm run build

# Start preview server
npm run preview -- --port 5173 --host
```

### Terminal 4: Create Frontend Ngrok Tunnel

```powershell
ngrok http 5173
```

You'll see:
```
Forwarding  https://aaaa-bbbb-cccc.ngrok-free.app -> http://localhost:5173
```

**Share this Frontend URL** with your friend!

---

## 🔍 Verify Deployment

### Check Backend Health

```powershell
# Replace with your backend ngrok URL
curl https://your-backend-url.ngrok-free.app/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "NLAMS API",
  "version": "1.0.0",
  "timestamp": "2026-09-15T10:30:00.000Z"
}
```

### Check Frontend

Open the frontend ngrok URL in a browser. You should see the NLAMS login page.

### Test Login

Use demo credentials:
- **Email:** `collector.chennai@tn.gov.in`
- **Password:** `Password@123`

---

## 📊 Monitor Traffic

### Ngrok Inspector

Open http://localhost:4040 in your browser to see:
- All HTTP requests in real-time
- Request/response details
- Error logs

This is extremely useful for debugging!

---

## 🔑 Demo Credentials to Share

### Government Portal

All users have password: `Password@123`

| Role | Email |
|------|-------|
| Central Admin | rajesh.kumar@dolr.gov.in |
| State Officer | priya.chandran@tn.gov.in |
| District Collector | collector.chennai@tn.gov.in |
| Field Officer | kumaran.s@tn.gov.in |
| Project Agency (AAI) | anand.k@aai.aero |

### Landowner Citizen Portal

| Name | Phone | Last 4 Digits |
|------|-------|---------------|
| Muthusamy Gounder | 9840001204 | **1204** |
| Ramasamy Pillai | 9840001210 | **1210** |

---

## ✅ Features to Test

Share this checklist with your friend:

### 1. Dashboard
- [ ] View national KPIs (total projects, area, compensation)
- [ ] See project stage breakdown chart
- [ ] Check compensation trend graph
- [ ] View unresolved alerts

### 2. GIS Map
- [ ] See Chennai district parcels as polygons
- [ ] Click on parcels to see details
- [ ] Filter by acquisition stage
- [ ] View color-coded stage visualization

### 3. Projects
- [ ] Browse 8 real Chennai projects
- [ ] View Parandur Airport details
- [ ] Check project timeline and milestones
- [ ] See associated land parcels

### 4. Innovation 1: AI Suitability Analysis
- [ ] Navigate to "Land Suitability" page
- [ ] View suitability scores (0-100)
- [ ] Check 8-factor MCDA breakdown
- [ ] See alternative corridor suggestions

### 5. Innovation 2: Ripple Impact Analysis
- [ ] Navigate to "Ripple Impact" page
- [ ] Select a delayed parcel
- [ ] View dependency cascade chain
- [ ] See cost escalation estimates
- [ ] Check AI mitigation strategies

### 6. Innovation 3: Voluntary Land Offers
- [ ] Logout from government portal
- [ ] Login to Landowner Portal (Phone: 9840001204, Last 4: 1204)
- [ ] Navigate to "Land Offers" page
- [ ] Submit a voluntary land offer
- [ ] Track offer status

### 7. Workflow & Approvals
- [ ] Field Officer submits proposal
- [ ] District Collector approves
- [ ] View workflow stage progression

### 8. Compensation Tracking
- [ ] View assessed vs disbursed amounts
- [ ] Check DBT payment status
- [ ] See landowner-wise breakdown

---

## 🐛 Troubleshooting

### Issue: "Ngrok command not found"

**Solution:**
```powershell
# Check if ngrok is installed
Get-Command ngrok

# If not found, add to PATH or use full path
C:\path\to\ngrok\ngrok.exe http 5000
```

### Issue: "Ngrok authentication required"

**Solution:**
```powershell
# Get token from https://dashboard.ngrok.com/get-started/your-authtoken
ngrok config add-authtoken <YOUR_TOKEN>
```

### Issue: "CORS error in browser console"

**Solution:**
The backend is already configured to accept ngrok URLs. If you still see CORS errors:

1. Check that frontend is using the correct backend URL
2. Verify `frontend\.env.production` contains:
   ```
   VITE_API_URL=https://your-backend-ngrok-url.ngrok-free.app/api
   ```
3. Rebuild frontend: `npm run build`

### Issue: "Cannot connect to database"

**Solution:**
Ngrok exposes your local services, so the database must be running locally:

```powershell
# Check PostgreSQL service
Get-Service postgresql*

# If not running, start it
Start-Service postgresql-x64-16  # Adjust service name

# Or run setup script
cd backend
.\setup-db.ps1
```

### Issue: "Frontend shows blank page"

**Solution:**
```powershell
# Check browser console for errors
# Common fix: Rebuild frontend
cd frontend
npm run build
npm run preview -- --port 5173 --host
```

### Issue: "Ngrok tunnel closed after 2 hours"

**Cause:** Free ngrok accounts have 2-hour session limits.

**Solution:**
- Restart the `deploy-ngrok.ps1` script
- Or upgrade to ngrok paid plan for unlimited sessions

### Issue: "502 Bad Gateway"

**Cause:** Backend or frontend server stopped.

**Solution:**
```powershell
# Check if backend is running
curl http://localhost:5000/health

# Check if frontend is running
curl http://localhost:5173

# Restart the stopped service
```

---

## 🔒 Security Notes

### ⚠️ Important Warnings

1. **Development Mode Only**
   - These ngrok URLs expose your local development server
   - Do NOT use for production deployment
   - Do NOT share with untrusted users

2. **Database Access**
   - Your friend cannot access your local database
   - All data is on your machine
   - Database must be running on your system

3. **Free Ngrok Limitations**
   - 2-hour session timeout
   - Rate limiting on free tier
   - Ngrok warning banner on free accounts

4. **Sensitive Data**
   - The app uses demo data (Chennai district)
   - No real landowner PII is exposed
   - JWT tokens are session-based

### ✅ Safe Sharing Practices

- Share URLs only with your testing team
- Use temporary ngrok URLs (they expire anyway)
- Monitor traffic via ngrok inspector (localhost:4040)
- Stop services when testing is complete

---

## 📱 Mobile Testing

Ngrok URLs work on mobile devices too!

**Share the frontend URL with your friend's phone:**
1. They open the ngrok URL in mobile browser
2. Login with demo credentials
3. Test mobile-responsive features
4. Field data collection module is mobile-optimized

---

## 🎓 Advanced: Custom Domain (Paid)

If you have an ngrok paid plan, you can use custom domains:

```powershell
# Backend with custom domain
ngrok http 5000 --domain=nlams-api.yourdomain.com

# Frontend with custom domain
ngrok http 5173 --domain=nlams.yourdomain.com
```

Update `frontend\.env.production`:
```
VITE_API_URL=https://nlams-api.yourdomain.com/api
```

---

## 📞 Support

### Quick Reference Files

- **URLs Saved:** `NGROK_URLS.txt` (auto-generated by script)
- **Main Docs:** `README.md`
- **Testing Guide:** `TESTING.md`
- **Deployment Options:** `DEPLOYMENT.md`

### Common Commands

```powershell
# Check ngrok version
ngrok version

# Check ngrok config
ngrok config check

# View ngrok help
ngrok http --help

# Kill all ngrok processes
Get-Process ngrok | Stop-Process

# View backend logs
cd backend
npm start

# View frontend logs
cd frontend
npm run dev
```

---

## 🎉 Success Checklist

Before sharing with your friend, verify:

- [✓] Ngrok installed and authenticated
- [✓] Backend running on localhost:5000
- [✓] Backend ngrok tunnel active
- [✓] Frontend built with backend ngrok URL
- [✓] Frontend running on localhost:5173
- [✓] Frontend ngrok tunnel active
- [✓] Can login with demo credentials
- [✓] Dashboard loads with charts
- [✓] GIS map renders parcels
- [✓] URLs saved to NGROK_URLS.txt

**Share the frontend ngrok URL + demo credentials = Done! 🚀**

---

## 📊 Performance Tips

### For Better Remote Testing Experience

1. **Use HTTPS URLs** - Ngrok provides both HTTP and HTTPS, prefer HTTPS
2. **Close unnecessary apps** - Free bandwidth for ngrok tunnels
3. **Check network speed** - Upload speed matters for serving requests
4. **Use ngrok inspector** - Monitor slow requests at localhost:4040

### Expected Response Times

- Login: < 2 seconds
- Dashboard load: < 3 seconds
- Map render: 3-5 seconds (depends on parcel count)
- API calls: < 1 second

If slower, check:
- Your internet upload speed
- Database query performance
- Ngrok inspector for bottlenecks

---

<div align="center">

**Happy Testing! 🎉**

*Share your NLAMS app with the world (or just your friend) via ngrok*

</div>
