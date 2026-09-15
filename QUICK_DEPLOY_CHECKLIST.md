# ✅ Quick Deploy Checklist - Ngrok Setup

**Goal:** Share NLAMS with your friend via ngrok  
**Time:** 5-10 minutes  
**Difficulty:** Easy

---

## 📋 Before You Start (One-Time Setup)

### 1. Install Ngrok (If Not Already Installed)
```powershell
# Check if ngrok is installed
ngrok version
```

**If not installed:**
- Download: https://ngrok.com/download
- Extract to a folder (e.g., `C:\ngrok`)
- Add to PATH or use full path

### 2. Authenticate Ngrok (One-Time)
```powershell
# Get your auth token from: https://dashboard.ngrok.com/get-started/your-authtoken
ngrok config add-authtoken YOUR_TOKEN_HERE
```

✅ **Done? Great! You won't need to do this again.**

---

## 🚀 Deploy NLAMS (Every Time You Want to Share)

### ⚠️ Important: Free Ngrok Limitation
Free ngrok accounts only allow **1 tunnel at a time**. You have 2 options:

---

### **Option A: Manual 2-Terminal Method (FREE - Recommended)**

#### Terminal 1: Start Backend
```powershell
cd d:\SIH2026\PS3\backend
npm start
# Wait for: ✅ NLAMS Backend running on http://localhost:5000
```

#### Terminal 2: Create Backend Ngrok Tunnel
```powershell
ngrok http 5000
# Copy the HTTPS URL (e.g., https://xxxx-yyyy.ngrok-free.app)
```

#### Terminal 3: Configure & Build Frontend
```powershell
cd d:\SIH2026\PS3\frontend

# Replace with YOUR backend ngrok URL from Terminal 2!
$backendUrl = "https://YOUR-BACKEND-URL.ngrok-free.app"
Set-Content .env.production "VITE_API_URL=$backendUrl/api"

npm run build
npm run preview -- --port 5173 --host
```

#### Terminal 4: Create Frontend Ngrok Tunnel
```powershell
ngrok http 5173
# Copy the HTTPS URL - THIS is what you share!
```

**See:** `DEPLOY_MANUAL_2_TERMINALS.md` for detailed steps

---

### **Option B: Same Network Only (FREE - Easier)**

If your friend is on the **same Wi-Fi/network**:

#### Terminal 1: Start Backend (No Ngrok)
```powershell
cd d:\SIH2026\PS3\backend
npm start
```

#### Terminal 2: Start Frontend
```powershell
cd d:\SIH2026\PS3\frontend
npm run dev
```

#### Terminal 3: Ngrok (Frontend Only)
```powershell
ngrok http 5173
# Share this URL!
```

---

### **Option C: Frontend Only - Mock Data (FREE - Fastest)**

No backend needed, works with mock data:

#### Terminal 1: Start Frontend
```powershell
cd d:\SIH2026\PS3\frontend
npm run dev
```

#### Terminal 2: Ngrok
```powershell
ngrok http 5173
# Share this URL!
```

**Copy the Frontend URL** from Terminal 2/3 - that's what you'll share!

### Step 4: Test It Yourself First
```powershell
# Open the frontend ngrok URL in your browser
# Click "Visit Site" on ngrok warning page
# Login with: collector.chennai@tn.gov.in / Password@123
# Make sure dashboard loads
```

### Step 5: Share with Your Friend

**Send them:**
1. **Frontend URL** (from Terminal 3 or 4)
2. **Login credentials:**
   ```
   Email: collector.chennai@tn.gov.in
   Password: Password@123
   ```
3. **(Optional)** The file `SHARE_WITH_FRIEND.md` for detailed testing guide

---

## 🎯 Which Option Should I Use?

| Your Situation | Recommended Option |
|----------------|-------------------|
| Friend on **different network**, needs **full features** | **Option A** - Manual 2-Terminal |
| Friend on **same Wi-Fi/network** as you | **Option B** - Same Network |
| Just want to show **UI/design** quickly | **Option C** - Frontend Only (Mock Data) |
| Have **ngrok paid plan** | Use `deploy-ngrok.ps1` script (automated) |

---

## 🎯 That's It!

Your friend can now:
- Open the URL in their browser
- Login and test the app
- See all 3 innovations
- Test from anywhere in the world

---

## ⏸️ When You're Done Testing

### Stop All Services
In each terminal running a service:
```powershell
# Press Ctrl+C in each terminal
# Or just close all terminals
```

**This stops:**
- Backend server (Terminal 1)
- Ngrok tunnels (Terminals 2 & 4)
- Frontend server (Terminal 3)

---

## 🐛 Quick Troubleshooting

### "ngrok: command not found"
**Fix:** Install ngrok (see One-Time Setup above)

### "Failed to authenticate"
**Fix:** Run the auth command (see One-Time Setup above)

### "ERR_NGROK_3200: Endpoint is offline"
**Fix:** The service stopped. Check if backend/frontend is still running, restart if needed

### "Multiple ngrok tunnels not allowed (free account)"
**Fix:** You're trying to run 2 ngrok tunnels on free plan
- Use Option B (Same Network) or Option C (Frontend Only)
- Or upgrade to ngrok paid plan ($10/month)

### "Cannot connect to database"
**Fix:** Make sure PostgreSQL is running
```powershell
Get-Service postgresql*
# If not running: Start-Service postgresql-x64-16
```

### "CORS error in browser"
**Fix:** Backend is already configured. If still occurs:
1. Check `.env.production` has correct backend URL
2. Rebuild frontend: `npm run build`
3. Restart backend: `cd backend && npm start`

### "502 Bad Gateway"
**Fix:** Backend server crashed, restart Terminal 1

### "Ngrok warning page - 'Visit Site' button"
**This is normal for free ngrok!** Click "Visit Site" to continue.

---

## 📱 Works on Mobile Too!

Your friend can test on their phone:
- Just open the frontend URL on mobile browser
- Same login credentials work
- Test mobile-responsive features

---

## ⏱ Time Limits

**Free ngrok account:**
- Sessions last 2 hours
- After 2 hours: Re-run the script
- Get new URLs each time

**Want longer sessions?**
- Upgrade to ngrok paid plan (optional)

---

## 🎓 What to Tell Your Friend

**Minimum:**
```
Hey! Test my NLAMS app:
URL: https://your-ngrok-url.ngrok-free.app
(Click "Visit Site" on the warning page - it's normal for free ngrok)
Login: collector.chennai@tn.gov.in
Password: Password@123

Check out the Dashboard and GIS Map!
```

**Detailed:**
```
Send them the SHARE_WITH_FRIEND.md file
It has:
- All login credentials (5 govt users + 2 landowners)
- Complete feature testing guide
- Step-by-step instructions
```

---

## 💡 Pro Tips

1. **Test yourself first** - Make sure everything works before sharing
2. **Use HTTPS URLs** - Ngrok provides both HTTP and HTTPS, use HTTPS
3. **Monitor the ngrok inspector** - Open http://localhost:4040 to see live traffic
4. **Keep terminals open** - Closing any terminal stops that service
5. **Screenshot the URLs** - Easy to refer back to
6. **Use Option A for full remote** - Works from anywhere
7. **Use Option C for quick UI demo** - No setup needed

---

## 📊 Expected Ngrok Output

When ngrok starts successfully, you'll see:
```
ngrok

Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://xxxx-yyyy.ngrok-free.app -> http://localhost:5173

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Share the HTTPS URL** (e.g., `https://xxxx-yyyy.ngrok-free.app`)

---

## ✅ Success Checklist

Before sharing with your friend:

- [ ] Ngrok authenticated (one-time)
- [ ] Decided which option to use (A, B, or C)
- [ ] All required terminals running
- [ ] Tested ngrok URL yourself (clicked "Visit Site" on warning)
- [ ] Login works
- [ ] Dashboard shows 8 projects
- [ ] Map renders parcels (if using backend)
- [ ] Ready to share!

---

## 🎉 You're Ready!

**For full remote access (Option A):**
- 4 terminals: Backend, Backend Ngrok, Frontend, Frontend Ngrok
- Share the Frontend ngrok URL

**For same network (Option B):**
- 3 terminals: Backend, Frontend, Frontend Ngrok
- Share the Frontend ngrok URL

**For UI demo only (Option C):**
- 2 terminals: Frontend, Frontend Ngrok
- Share the Frontend ngrok URL

**Questions?** Check:
- `DEPLOY_MANUAL_2_TERMINALS.md` - Step-by-step manual guide
- `NGROK_SETUP.md` - Detailed ngrok guide
- `SHARE_WITH_FRIEND.md` - User guide

---

<div align="center">

**Happy Sharing! 🚀**

*Your friend will love testing NLAMS!*

</div>
