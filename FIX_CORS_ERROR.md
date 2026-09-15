# 🔧 Fix CORS Error: Backend Not Responding

## ❌ The Error You're Seeing

```
Access to XMLHttpRequest at 'https://floristically-glottogonic-eusebio.ngrok-free.dev/api/auth/login' 
from origin 'https://frontend-rust-psi-63.vercel.app' has been blocked by CORS policy
```

## 🤔 What This Means

Your **backend ngrok tunnel is offline**. This happens because:
1. Backend server stopped
2. Ngrok session expired (2 hour limit on free accounts)
3. Ngrok process was closed

---

## ✅ Quick Fix (2 Steps)

### Step 1: Start Backend + Ngrok

**Open PowerShell in project root:**

```powershell
cd d:\SIH2026\PS3

# Terminal 1 - Start Backend
cd backend
npm start
```

**Wait for:**
```
✅ NLAMS Backend running on http://localhost:5000
```

**Open NEW PowerShell terminal:**

```powershell
# Terminal 2 - Start Ngrok
ngrok http 5000
```

**You'll see:**
```
Forwarding   https://xxxx-yyyy-zzzz.ngrok-free.app -> http://localhost:5000
```

**Copy the HTTPS URL** (e.g., `https://xxxx-yyyy-zzzz.ngrok-free.app`)

---

### Step 2: Update Frontend on Vercel

**In a third PowerShell terminal:**

```powershell
cd d:\SIH2026\PS3\frontend

# Paste your NEW ngrok URL here:
$backendUrl = "https://YOUR-NEW-NGROK-URL.ngrok-free.app"

# Update .env.production
Set-Content .env.production "VITE_API_URL=$backendUrl/api"

# Redeploy to Vercel
vercel --prod
```

**Done!** Your Vercel frontend now points to the new backend ngrok URL.

---

## 🚀 Even Easier: Use the Script

Instead of manual steps above, just run:

```powershell
cd d:\SIH2026\PS3
.\deploy-vercel.ps1
```

This script:
1. ✅ Starts backend
2. ✅ Creates ngrok tunnel
3. ✅ Updates frontend with new backend URL
4. ✅ Deploys to Vercel automatically

---

## ⏱ Why This Happens

**Free ngrok sessions expire after 2 hours.**

When ngrok expires:
- Your old ngrok URL stops working
- Frontend on Vercel still tries to use old URL
- Result: CORS error

**Solution:** Restart backend + ngrok, update Vercel

---

## 🔍 Verify Backend is Running

### Test Backend Locally
```powershell
curl http://localhost:5000/health
```

**Should return:**
```json
{"status":"ok","service":"NLAMS API","version":"1.0.0"}
```

### Test Backend via Ngrok
**Open in browser:** `https://your-ngrok-url.ngrok-free.app/health`

**Should return:** Same JSON as above

If these work, backend is running correctly!

---

## 🎯 Current Status Check

Run these commands to check what's running:

```powershell
# Check if backend is running
Get-Process node -ErrorAction SilentlyContinue

# Check if ngrok is running  
Get-Process ngrok -ErrorAction SilentlyContinue

# Test backend health
curl http://localhost:5000/health
```

---

## 📋 Step-by-Step Visual Guide

### Your Current State ❌
```
Vercel Frontend
    ↓ (trying to call)
https://floristically-glottogonic-eusebio.ngrok-free.dev ❌ OFFLINE
```

### What You Need ✅
```
Vercel Frontend
    ↓ (calling)
https://new-ngrok-url.ngrok-free.app ✅ ONLINE
    ↓ (tunneling to)
http://localhost:5000 ✅ Backend Running
```

---

## 🔧 Detailed Fix Steps

### Step 1: Stop Old Processes (if any)

```powershell
# Stop all node processes
Get-Process node | Stop-Process -Force

# Stop all ngrok processes
Get-Process ngrok | Stop-Process -Force
```

### Step 2: Start Backend

```powershell
cd d:\SIH2026\PS3\backend

# Make sure .env exists
if (!(Test-Path .env)) {
    Copy-Item .env.example .env
}

# Start backend
npm start
```

**Wait for:** `✅ NLAMS Backend running on http://localhost:5000`

### Step 3: Create Ngrok Tunnel

**In NEW terminal:**

```powershell
ngrok http 5000
```

**Copy the HTTPS forwarding URL**

### Step 4: Test Backend via Ngrok

**Open in browser:** `https://your-new-ngrok-url.ngrok-free.app/health`

Should see:
```json
{"status":"ok","service":"NLAMS API","version":"1.0.0","timestamp":"..."}
```

### Step 5: Update Vercel

```powershell
cd d:\SIH2026\PS3\frontend

# Replace with your actual ngrok URL
$backendUrl = "https://YOUR-NGROK-URL.ngrok-free.app"
Set-Content .env.production "VITE_API_URL=$backendUrl/api"

# Verify
Get-Content .env.production

# Deploy
vercel --prod
```

### Step 6: Test Vercel Frontend

1. Open your Vercel URL: `https://frontend-rust-psi-63.vercel.app`
2. Open browser DevTools (F12) → Console
3. Try logging in
4. Should see API calls to your new ngrok URL
5. No CORS errors!

---

## 💡 Pro Tips

### Keep Backend Running
```powershell
# Use the deployment script - it keeps everything running
.\deploy-vercel.ps1

# Keep terminal open while testing
# Script monitors backend and ngrok
```

### Monitor Ngrok
- Open http://localhost:4040 while ngrok is running
- See all API requests in real-time
- Check for errors

### Set Reminders
- Free ngrok expires after **2 hours**
- Set a reminder to restart
- Or upgrade to ngrok paid ($10/mo) for unlimited

---

## 🐛 Still Not Working?

### Error: "Cannot reach ngrok URL"

**Check:**
```powershell
# Is backend running?
curl http://localhost:5000/health

# Is ngrok running?
Get-Process ngrok

# Is ngrok tunnel active?
# Open: http://localhost:4040
# Should show "online" status
```

### Error: "Vercel build failed"

```powershell
# Test build locally first
cd frontend
npm run build

# If build succeeds locally
vercel --prod
```

### Error: "Still seeing old ngrok URL"

**Clear Vercel cache:**
```powershell
cd frontend
vercel --prod --force
```

---

## 📞 Quick Reference

**Start Everything:**
```powershell
.\deploy-vercel.ps1
```

**Just Restart Backend:**
```powershell
# Terminal 1
cd backend && npm start

# Terminal 2  
ngrok http 5000

# Terminal 3
cd frontend
$backend = "NEW-NGROK-URL"
Set-Content .env.production "VITE_API_URL=$backend/api"
vercel --prod
```

**Check Status:**
```powershell
# Backend health
curl http://localhost:5000/health

# Ngrok inspector
# Open: http://localhost:4040
```

---

## ✅ Success Checklist

Before sharing with friend:

- [ ] Backend running: `curl http://localhost:5000/health` works
- [ ] Ngrok running: Can see tunnel at http://localhost:4040
- [ ] Ngrok health: `https://your-ngrok-url.ngrok-free.app/health` works in browser
- [ ] Vercel updated: `.env.production` has new ngrok URL
- [ ] Vercel deployed: `vercel --prod` completed successfully
- [ ] Frontend works: Can login at `https://frontend-rust-psi-63.vercel.app`
- [ ] No CORS errors: Check browser console (F12)
- [ ] Dashboard loads: See 8 Chennai projects

---

## 🎉 Fixed!

Once you complete the steps above:

✅ Backend is running  
✅ Ngrok tunnel is active  
✅ Vercel frontend points to new ngrok URL  
✅ No CORS errors  
✅ Your friend can test!  

**Keep backend + ngrok terminal open** while your friend is testing.

---

<div align="center">

**Need Help?**

Run: `.\deploy-vercel.ps1`

*Easiest way to fix everything at once!*

</div>
