# 🌐 Ngrok Deployment Summary

Quick reference for deploying NLAMS via ngrok for remote testing.

---

## ✅ Files Created for Ngrok Support

### 1. Backend Changes
- ✅ `backend/server.js` - Updated CORS to accept ngrok URLs
- ✅ Backend now allows any `*.ngrok.io`, `*.ngrok-free.app`, `*.ngrok.app` origins

### 2. Frontend Configuration
- ✅ `frontend/.env.development` - Local backend URL
- ✅ `frontend/.env.production` - Ngrok backend URL (auto-generated)

### 3. Deployment Scripts
- ✅ `deploy-ngrok.ps1` - Automated deployment script (PowerShell)
- ✅ Handles both backend and frontend ngrok tunnels
- ✅ Configures frontend to use backend ngrok URL
- ✅ Monitors services and displays shareable URLs

### 4. Documentation
- ✅ `NGROK_SETUP.md` - Complete ngrok deployment guide
- ✅ `SHARE_WITH_FRIEND.md` - Instructions for your testing team
- ✅ `NGROK_URLS.txt` - Auto-generated URL reference (created when you run script)
- ✅ `README.md` - Updated with ngrok quick start

---

## 🚀 Quick Deploy

### Single Command
```powershell
.\deploy-ngrok.ps1
```

**What it does:**
1. Checks ngrok installation
2. Installs dependencies (if needed)
3. Starts backend (localhost:5000)
4. Creates backend ngrok tunnel
5. Configures frontend with backend URL
6. Builds frontend
7. Starts frontend preview (localhost:5173)
8. Creates frontend ngrok tunnel
9. Displays URLs to share

**Expected time:** 2-3 minutes

---

## 📋 Prerequisites Checklist

Before running the script:

- [x] Node.js installed (`node --version`)
- [x] npm dependencies installed (or script will install)
- [x] PostgreSQL running with NLAMS database (or use frontend-only mode)
- [x] **Ngrok installed** (`ngrok --version`)
- [x] **Ngrok authenticated** (`ngrok config add-authtoken <token>`)

### Get Ngrok Auth Token
1. Sign up: https://dashboard.ngrok.com/signup
2. Get token: https://dashboard.ngrok.com/get-started/your-authtoken
3. Run: `ngrok config add-authtoken <YOUR_TOKEN>`

---

## 🎯 Deployment Options

### Option 1: Full Stack (Backend + Frontend)
**Best for:** Complete testing with real database

```powershell
# Ensure PostgreSQL is running
Get-Service postgresql*

# Deploy
.\deploy-ngrok.ps1
```

**Result:** Two ngrok URLs (backend + frontend)

### Option 2: Frontend Only
**Best for:** Quick UI demo without database setup

```powershell
cd frontend
npm install
npm run dev

# In separate terminal
ngrok http 5173
```

**Result:** One ngrok URL (frontend with mock data)

---

## 📊 What Your Friend Will See

### Shared URLs Format
```
Frontend: https://1a2b-3c4d-5e6f.ngrok-free.app
Backend:  https://7g8h-9i0j-1k2l.ngrok-free.app
```

### Ngrok Free Account Notice
Your friend will see a ngrok warning banner:
```
"You are about to visit https://xxxx.ngrok-free.app
This page is served by ngrok.io for free"
[Visit Site] button
```

This is normal for free ngrok accounts. They click "Visit Site" to proceed.

---

## 🔍 Monitoring

### Ngrok Inspector
Open http://localhost:4040 to see:
- All HTTP requests in real-time
- Request/response details
- Error logs
- Performance metrics

Share this with your friend for debugging!

---

## ⏱ Session Duration

### Free Ngrok Account
- **Timeout:** 2 hours per session
- **Solution:** Re-run `.\deploy-ngrok.ps1` after timeout

### Paid Ngrok Account
- **Timeout:** No limit
- **Custom domains:** Available
- **More tunnels:** Multiple concurrent

---

## 🔐 Security Notes

### What's Exposed
✅ **Safe:**
- Frontend static files
- Backend API endpoints
- Demo data only (Chennai projects)

❌ **NOT Exposed:**
- Your PostgreSQL database (localhost only)
- Your file system
- Other services on your machine

### Safe Practices
- Share URLs only with your testing team
- Stop services when done (Ctrl+C)
- Monitor traffic via ngrok inspector
- Use demo credentials only

---

## 🐛 Common Issues & Fixes

### "ngrok: command not found"
```powershell
# Check if installed
Get-Command ngrok

# If not found, download from https://ngrok.com/download
# Add to PATH or use full path
C:\path\to\ngrok.exe http 5000
```

### "Failed to authenticate"
```powershell
# Get auth token from dashboard
ngrok config add-authtoken <YOUR_TOKEN>
```

### "CORS error in browser"
- Backend is already configured to accept ngrok URLs
- If still occurs, restart backend:
  ```powershell
  cd backend
  npm start
  ```

### "502 Bad Gateway"
- Backend server stopped
- Check if it's running:
  ```powershell
  curl http://localhost:5000/health
  ```
- Restart if needed

### "Frontend blank page"
- Clear browser cache
- Try incognito mode
- Rebuild frontend:
  ```powershell
  cd frontend
  npm run build
  npm run preview
  ```

---

## 📱 Mobile Testing

Ngrok URLs work on mobile devices:
1. Share frontend ngrok URL with your phone
2. Open in mobile browser (Chrome/Safari)
3. Login with demo credentials
4. Test responsive features
5. Try field data collection module

---

## 🎓 Architecture

```
┌─────────────────────────────────────────┐
│  Your Friend's Browser                  │
│  (Anywhere in the world)                │
└──────────────┬──────────────────────────┘
               │ HTTPS
               │ https://xxxx.ngrok-free.app
               ▼
┌─────────────────────────────────────────┐
│  Ngrok Cloud Service                    │
│  (Tunneling & Routing)                  │
└──────────────┬──────────────────────────┘
               │ Encrypted tunnel
               │
               ▼
┌─────────────────────────────────────────┐
│  Your Computer (localhost)              │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Frontend (Port 5173)             │ │
│  │  React + Vite                     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Backend (Port 5000)              │ │
│  │  Node.js + Express                │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Database (Port 5432)             │ │
│  │  PostgreSQL + PostGIS             │ │
│  │  (NOT exposed to internet)        │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 📈 Performance Tips

### For Better Experience
1. **Close unnecessary apps** - Free up bandwidth
2. **Use HTTPS URLs** - Better security and compatibility
3. **Monitor inspector** - Check for slow requests
4. **Good internet** - Your upload speed matters

### Expected Response Times
- Login: < 2 seconds
- Dashboard: < 3 seconds
- Map render: 3-5 seconds
- API calls: < 1 second

Slower? Check:
- Your internet upload speed
- Database performance
- Ngrok inspector bottlenecks

---

## 📞 What to Share with Your Friend

### Essential Information
1. **Frontend ngrok URL** (e.g., https://xxxx.ngrok-free.app)
2. **Demo credentials** (see `SHARE_WITH_FRIEND.md`)
3. **Feature checklist** (what to test)

### Optional Information
4. Backend ngrok URL (for API testing)
5. Ngrok inspector URL (http://localhost:4040)
6. Known limitations (2-hour timeout, etc.)

### Send Them
- `SHARE_WITH_FRIEND.md` file
- Or just the URLs + credentials

---

## ✅ Deployment Checklist

Before sharing:

**Preparation:**
- [ ] Ngrok installed and authenticated
- [ ] PostgreSQL running (for full stack)
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed

**Deployment:**
- [ ] Run `.\deploy-ngrok.ps1`
- [ ] Wait for "DEPLOYMENT SUCCESSFUL" message
- [ ] Copy frontend ngrok URL
- [ ] Test login yourself first

**Verification:**
- [ ] Can access frontend ngrok URL
- [ ] Can login with demo credentials
- [ ] Dashboard loads with data
- [ ] Map renders parcels
- [ ] API calls work (check inspector)

**Sharing:**
- [ ] Share frontend URL with friend
- [ ] Share `SHARE_WITH_FRIEND.md` or credentials
- [ ] Share ngrok inspector URL (optional)
- [ ] Mention 2-hour timeout for free accounts

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ Friend can access frontend ngrok URL  
✅ Friend can login with demo credentials  
✅ Dashboard shows 8 Chennai projects  
✅ Map displays colored parcels  
✅ All 3 innovations are accessible  
✅ API calls complete successfully  
✅ No CORS errors in console  

---

## 🛑 Stopping Services

### Graceful Stop
```powershell
# In the terminal running deploy-ngrok.ps1
# Press Ctrl+C
```

**This will:**
- Stop backend server
- Stop frontend preview
- Stop ngrok tunnels
- Clean up resources

### Force Stop (if needed)
```powershell
# Kill all node processes
Get-Process node | Stop-Process

# Kill all ngrok processes
Get-Process ngrok | Stop-Process
```

---

## 📚 Additional Resources

### Documentation
- `NGROK_SETUP.md` - Detailed setup guide
- `SHARE_WITH_FRIEND.md` - User guide for testing
- `README.md` - Main project documentation
- `TESTING.md` - Test cases (46 scenarios)

### Ngrok Resources
- Dashboard: https://dashboard.ngrok.com/
- Docs: https://ngrok.com/docs
- Status: https://status.ngrok.com/
- Support: https://ngrok.com/docs/support/

---

## 🏆 Best Practices

### Do:
✅ Test yourself before sharing  
✅ Monitor ngrok inspector during testing  
✅ Share specific features to test  
✅ Provide demo credentials upfront  
✅ Mention 2-hour timeout  
✅ Stop services when done  

### Don't:
❌ Share ngrok URLs publicly  
❌ Use for production deployment  
❌ Leave services running 24/7  
❌ Share real sensitive data  
❌ Forget to stop services  

---

<div align="center">

**Ngrok Deployment Ready! 🚀**

*Share your NLAMS prototype with anyone, anywhere*

Run `.\deploy-ngrok.ps1` and start testing!

</div>
