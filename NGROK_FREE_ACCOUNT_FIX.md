# 🔧 Ngrok Free Account Fix

## ❌ The Error You Saw

```
ERR_NGROK_3200
The endpoint floristically-glottogonic-eusebio.ngrok-free.dev is offline.
```

## 🤔 What Happened?

The automated script tried to create **2 ngrok tunnels** (one for backend, one for frontend), but **free ngrok accounts only allow 1 tunnel at a time**.

When the script created the second tunnel, the first one was automatically closed, causing the "offline" error.

---

## ✅ The Solution

Use the **manual 2-terminal method** OR upgrade ngrok.

### Option 1: Manual Deployment (FREE - Works Perfectly!)

#### **For Full Remote Access** (Friend on different network)

Open **4 PowerShell terminals:**

**Terminal 1 - Backend:**
```powershell
cd d:\SIH2026\PS3\backend
npm start
```
Wait for: `✅ NLAMS Backend running on http://localhost:5000`

**Terminal 2 - Backend Ngrok:**
```powershell
ngrok http 5000
```
**COPY THE HTTPS URL** (e.g., `https://abcd-1234.ngrok-free.app`)

**Terminal 3 - Frontend:**
```powershell
cd d:\SIH2026\PS3\frontend

# PASTE your backend ngrok URL here:
$backendUrl = "https://YOUR-BACKEND-URL-FROM-TERMINAL-2.ngrok-free.app"
Set-Content .env.production "VITE_API_URL=$backendUrl/api"

npm run build
npm run preview -- --port 5173 --host
```

**Terminal 4 - Frontend Ngrok:**
```powershell
ngrok http 5173
```
**COPY THE HTTPS URL** - this is what you share with your friend!

---

#### **For Same Network Only** (Friend on same Wi-Fi - Easier!)

Open **3 PowerShell terminals:**

**Terminal 1 - Backend (No Ngrok):**
```powershell
cd d:\SIH2026\PS3\backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd d:\SIH2026\PS3\frontend
npm run dev
```

**Terminal 3 - Frontend Ngrok Only:**
```powershell
ngrok http 5173
```
**Share this URL!** (Backend stays on localhost)

---

#### **For UI Demo Only** (No Database - Fastest!)

Open **2 PowerShell terminals:**

**Terminal 1 - Frontend:**
```powershell
cd d:\SIH2026\PS3\frontend
npm run dev
```

**Terminal 2 - Ngrok:**
```powershell
ngrok http 5173
```
**Share this URL!** (Works with mock data)

---

### Option 2: Upgrade Ngrok (Paid Plan)

**Cost:** $10/month  
**Benefits:**
- Multiple simultaneous tunnels
- No 2-hour timeout
- Custom domains
- Better performance

**Upgrade:** https://ngrok.com/pricing

After upgrading, the automated script `.\deploy-ngrok.ps1` will work perfectly!

---

## 🎯 Which Method Should I Use?

| Your Situation | Use This Method | Terminals Needed |
|----------------|-----------------|------------------|
| Friend on **different network**, full features | Manual - Full Remote | 4 |
| Friend on **same Wi-Fi** as you | Manual - Same Network | 3 |
| Just show UI/design | Manual - Frontend Only | 2 |
| Have ngrok **paid plan** | Automated script | 1 (runs everything) |

---

## 📋 Step-by-Step for You

Since you have **free ngrok**, here's what to do:

### 1. Stop the Current Script
In the terminal running `deploy-ngrok.ps1`:
```powershell
# Press Ctrl+C
```

### 2. Choose Your Method

**If friend needs full access from different network:**
- Follow "Manual - Full Remote Access" above (4 terminals)

**If friend is on same Wi-Fi:**
- Follow "Manual - Same Network" above (3 terminals)

**If just demoing UI:**
- Follow "Manual - UI Demo Only" above (2 terminals)

### 3. Follow the Commands

Copy-paste the commands from the method you chose above.

### 4. Test Yourself

Open the frontend ngrok URL in your browser:
- Click "Visit Site" on ngrok warning (normal for free)
- Login: `collector.chennai@tn.gov.in` / `Password@123`
- Check dashboard loads

### 5. Share!

Send your friend:
- The frontend ngrok URL
- Demo credentials
- `SHARE_WITH_FRIEND.md` file (optional)

---

## ⚠️ Important Notes

### About the Ngrok Warning Page

Your friend will see:
```
⚠️  You are about to visit https://xxxx.ngrok-free.app
This page is served by ngrok.io for free

[Visit Site] button
```

**This is NORMAL for free ngrok accounts.** Tell them to click "Visit Site".

### About Session Timeouts

Free ngrok sessions last **2 hours**.

After timeout:
1. Ngrok terminal will show "session expired"
2. Re-run `ngrok http XXXX` command
3. You'll get a NEW URL
4. Share the new URL with your friend

---

## 🐛 Common Issues

### "ERR_NGROK_3200" again
- One of your services (backend/frontend) stopped
- Check all terminals are still running
- Restart the stopped service

### "Cannot open multiple sessions"
- You're trying to run 2 ngrok instances
- Close one ngrok terminal
- Or use the "Same Network" method (only 1 ngrok needed)

### "502 Bad Gateway"
- Backend server crashed
- Go to Terminal 1, restart: `npm start`

### "CORS error"
- Frontend has wrong backend URL
- Check `.env.production` file
- Should have your backend ngrok URL
- Rebuild: `npm run build`

---

## 📚 Full Documentation

- **Simple guide:** `DEPLOY_MANUAL_2_TERMINALS.md`
- **Detailed setup:** `NGROK_SETUP.md`
- **Quick reference:** `QUICK_DEPLOY_CHECKLIST.md`
- **For your friend:** `SHARE_WITH_FRIEND.md`

---

## 🎉 Summary

**The Problem:**
- Automated script needs 2 ngrok tunnels
- Free ngrok only allows 1 tunnel

**The Solution:**
- Use manual 2-terminal method (works perfectly!)
- Or upgrade ngrok to paid plan

**What to Do:**
1. Stop current script (Ctrl+C)
2. Choose method based on your situation
3. Follow commands for that method
4. Share frontend ngrok URL with friend
5. Keep terminals open while testing

---

<div align="center">

**You've Got This! 🚀**

*Manual method works great with free ngrok!*

**Next:** Open `DEPLOY_MANUAL_2_TERMINALS.md` for detailed steps

</div>
