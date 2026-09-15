# 🚀 Manual Ngrok Deployment (2-Terminal Method)

**For Free Ngrok Accounts - Works Perfectly!**

Free ngrok only allows 1 active tunnel at a time. This guide shows you how to deploy using 2 separate terminals for backend and frontend.

---

## 📋 Prerequisites

- [x] Ngrok installed: `ngrok version`
- [x] Ngrok authenticated: `ngrok config add-authtoken <token>`
- [x] Dependencies installed: Backend & Frontend `npm install`
- [x] PostgreSQL running (or use frontend mock mode)

---

## 🎯 Option 1: Full Remote Access (2 Ngrok Tunnels - Requires Paid Plan)

### Terminal 1: Backend + Ngrok
```powershell
# Start backend
cd d:\SIH2026\PS3\backend
npm start

# Backend should show: ✅ NLAMS Backend running on http://localhost:5000
```

**Keep this running, open NEW terminal:**
```powershell
# Create ngrok tunnel for backend
ngrok http 5000
```

**Copy the HTTPS URL** shown (e.g., `https://xxxx-yyyy.ngrok-free.app`)

---

### Terminal 2: Frontend Config + Ngrok

```powershell
cd d:\SIH2026\PS3\frontend

# Create production env with backend ngrok URL
# REPLACE with your backend URL from Terminal 1!
$backendUrl = "https://YOUR-BACKEND-URL.ngrok-free.app"
Set-Content .env.production "VITE_API_URL=$backendUrl/api"

# Build frontend
npm run build

# Start preview
npm run preview -- --port 5173 --host
```

**Keep this running, open NEW terminal:**
```powershell
# Create ngrok tunnel for frontend
ngrok http 5173
```

**Copy the HTTPS URL** and share with your friend!

---

## 🎯 Option 2: Same Network Only (1 Ngrok Tunnel - FREE)

If your friend is on the **same Wi-Fi/network**, you only need 1 tunnel:

### Terminal 1: Backend (No Ngrok)
```powershell
cd d:\SIH2026\PS3\backend
npm start
```

### Terminal 2: Frontend + Ngrok
```powershell
cd d:\SIH2026\PS3\frontend

# Use localhost backend (will work on same network)
Set-Content .env.production "VITE_API_URL=http://localhost:5000/api"

# Build and preview
npm run build
npm run preview -- --port 5173 --host
```

### Terminal 3: Ngrok (Just Frontend)
```powershell
ngrok http 5173
```

**Share the ngrok URL** - works if your friend is on same network!

---

## 🎯 Option 3: Frontend Only (Mock Data - FREE)

Test UI without database:

### Terminal 1: Frontend Dev Mode
```powershell
cd d:\SIH2026\PS3\frontend
npm run dev
```

### Terminal 2: Ngrok
```powershell
ngrok http 5173
```

**Share the ngrok URL** - frontend works with mock data!

---

## ✅ Verification Steps

### 1. Test Backend (Terminal 1)
```powershell
curl http://localhost:5000/health
# Should return: {"status":"ok","service":"NLAMS API",...}
```

### 2. Test Backend Ngrok
Open backend ngrok URL in browser: `https://your-backend.ngrok-free.app/health`

### 3. Test Frontend Ngrok
Open frontend ngrok URL in browser, try logging in:
- Email: `collector.chennai@tn.gov.in`
- Password: `Password@123`

---

## 🐛 Troubleshooting

### "ERR_NGROK_3200: Endpoint is offline"

**Cause:** The ngrok tunnel was stopped or timed out.

**Fix:**
1. Check if backend/frontend is still running in Terminal 1
2. Check if ngrok is still running in Terminal 2
3. If ngrok stopped, run `ngrok http XXXX` again
4. You'll get a NEW ngrok URL - share the new one

### "Multiple ngrok tunnels not allowed"

**Cause:** Free ngrok only allows 1 tunnel.

**Solutions:**
- **Option A:** Use "Option 2" above (same network only)
- **Option B:** Upgrade to ngrok paid plan ($10/month)
- **Option C:** Use frontend-only mode with mock data

### "CORS error"

**Already fixed!** Backend `server.js` is configured to accept ngrok URLs.

If still seeing errors:
1. Restart backend
2. Make sure `.env.production` has correct backend URL
3. Rebuild frontend: `npm run build`

---

## 📊 What Your Friend Sees

### Ngrok Free Account Warning
They'll see a screen:
```
⚠️  You are about to visit https://xxxx.ngrok-free.app
This page is served by ngrok.io for free

[Visit Site] button
```

**This is normal!** They click "Visit Site" to continue.

---

## 🔑 Demo Credentials

**Government Portal** (Password: `Password@123`)
- Central Admin: `rajesh.kumar@dolr.gov.in`
- District Collector: `collector.chennai@tn.gov.in`
- Field Officer: `kumaran.s@tn.gov.in`

**Landowner Portal**
- Phone: `9840001204`, Last 4: `1204`

---

## ⏱ Session Management

**Free Account:**
- 2 hours per session
- After timeout: Restart ngrok (new URL each time)

**Paid Account ($10/mo):**
- Unlimited duration
- Multiple simultaneous tunnels
- Custom domains

---

## 💡 Pro Tips

1. **Test yourself first** - Open the ngrok URL in incognito mode
2. **Monitor traffic** - Open http://localhost:4040 for ngrok inspector
3. **Keep terminals open** - Closing any terminal stops that service
4. **Screenshot URLs** - Easy to share later
5. **Use HTTPS URL** - Ngrok provides both, use HTTPS

---

## 📱 Works on Mobile!

Share the ngrok URL with your phone - works on mobile browsers too!

---

## 🎯 Quick Reference

**What to share:**
- Frontend ngrok URL (https://xxxx.ngrok-free.app)
- Demo credentials (above)
- File: `SHARE_WITH_FRIEND.md` (optional)

**What to keep running:**
- Terminal 1: Backend server
- Terminal 2: Ngrok for backend (or skip if same network)
- Terminal 3: Frontend preview
- Terminal 4: Ngrok for frontend

**How to stop:**
- Press `Ctrl+C` in each terminal
- Or just close all terminals

---

## ✅ Success Checklist

Before sharing:
- [ ] Backend running (http://localhost:5000/health works)
- [ ] Backend ngrok tunnel active (or skipped if same network)
- [ ] Frontend built with correct backend URL
- [ ] Frontend preview running
- [ ] Frontend ngrok tunnel active
- [ ] Can login via ngrok URL yourself
- [ ] Dashboard loads with data
- [ ] Ready to share!

---

<div align="center">

**Manual Deployment Complete! 🎉**

*More control, works with free ngrok!*

</div>
