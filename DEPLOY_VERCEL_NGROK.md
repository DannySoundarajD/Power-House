# 🚀 Deploy Frontend to Vercel + Backend to Ngrok

**Best approach for free accounts!**

- **Frontend:** Deployed to Vercel (free, fast, permanent URL)
- **Backend:** Running locally with ngrok tunnel (free, temporary URL)

---

## ✅ Benefits of This Approach

✨ **No ngrok frontend tunnel needed** - Vercel hosts it for free  
✨ **Only 1 ngrok tunnel** - Works with free account  
✨ **Permanent frontend URL** - yourapp.vercel.app (doesn't change)  
✨ **Fast frontend loading** - Vercel CDN worldwide  
✨ **Easy updates** - Just git push to redeploy  
✨ **Professional URL** - No ngrok warning banner on frontend  

---

## 📋 Prerequisites

### One-Time Setup

1. **Vercel Account** (Free)
   - Sign up: https://vercel.com/signup
   - Install Vercel CLI: `npm install -g vercel`
   - Login: `vercel login`

2. **Ngrok** (Already have it!)
   - Authenticated: `ngrok config add-authtoken <token>`

3. **Git Repository** (Optional but recommended)
   - Initialize: `git init`
   - Add remote: `git remote add origin <your-repo-url>`

---

## 🎯 Deployment Steps

### Step 1: Start Backend with Ngrok

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

**Copy the HTTPS URL** (e.g., `https://abcd-1234-efgh.ngrok-free.app`)

---

### Step 2: Configure Frontend for Vercel

**In project root:**
```powershell
cd d:\SIH2026\PS3\frontend

# Set backend ngrok URL as environment variable
# REPLACE with your actual backend ngrok URL!
$backendUrl = "https://YOUR-BACKEND-NGROK-URL.ngrok-free.app"

# Create .env.production for Vercel
Set-Content .env.production "VITE_API_URL=$backendUrl/api"
```

**Verify the file:**
```powershell
Get-Content .env.production
# Should show: VITE_API_URL=https://your-backend.ngrok-free.app/api
```

---

### Step 3: Deploy to Vercel

**First-time deployment:**
```powershell
cd d:\SIH2026\PS3\frontend

# Deploy to Vercel
vercel

# Follow prompts:
# ? Set up and deploy "frontend"? Yes
# ? Which scope? (Your username)
# ? Link to existing project? No
# ? What's your project's name? nlams-chennai
# ? In which directory is your code located? ./
# ? Want to override settings? No
```

**After first deployment, for updates:**
```powershell
# Production deployment
vercel --prod
```

---

### Step 4: Add Backend URL to Vercel Environment Variables

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to: https://vercel.com/dashboard
2. Select your project (nlams-chennai)
3. Go to **Settings** → **Environment Variables**
4. Add variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend.ngrok-free.app/api`
   - **Environment:** Production
5. Click **Save**
6. Redeploy: `vercel --prod`

**Option B: Via CLI**
```powershell
# Add environment variable
vercel env add VITE_API_URL production

# When prompted, enter: https://your-backend.ngrok-free.app/api
```

---

### Step 5: Share URLs

You'll get 2 URLs:

**Frontend (Permanent):**
```
https://nlams-chennai.vercel.app
```
Or custom domain like:
```
https://nlams-chennai-yourusername.vercel.app
```

**Backend (Changes each session):**
```
https://xxxx-yyyy.ngrok-free.app
```

**Share the Vercel URL** with your friend! No ngrok warning banner! 🎉

---

## 🔄 Workflow After Initial Setup

### Every Testing Session

1. **Start backend + ngrok** (generates new URL each time):
   ```powershell
   # Terminal 1
   cd backend && npm start
   
   # Terminal 2
   ngrok http 5000
   # Copy new backend URL
   ```

2. **Update Vercel environment variable** (if backend URL changed):
   ```powershell
   cd frontend
   
   # Update via dashboard: vercel.com → Settings → Environment Variables
   # OR update .env.production and redeploy:
   $backendUrl = "NEW-NGROK-URL"
   Set-Content .env.production "VITE_API_URL=$backendUrl/api"
   vercel --prod
   ```

3. **Share Vercel URL** - same URL every time!

---

## 🎯 Optimization: Use Ngrok Static Domain (Paid)

To avoid updating Vercel every session:

**Ngrok Static Domain** ($10/month):
- Get permanent URL: `https://nlams-backend.ngrok.app`
- Set once in Vercel, never change
- Start backend: `ngrok http 5000 --domain=nlams-backend.ngrok.app`

**Without paid ngrok:**
- Backend URL changes every 2 hours
- Need to redeploy Vercel or update env vars

---

## 📝 Vercel Configuration Files

### Create `vercel.json` (Optional)

```powershell
cd d:\SIH2026\PS3\frontend
```

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures React Router works correctly on Vercel.

---

## 🔧 Backend CORS Update (Already Done!)

Your `backend/server.js` already accepts ngrok URLs:
```javascript
// Already configured to accept:
- *.ngrok.io
- *.ngrok-free.app
- *.ngrok.app
```

**Add Vercel domain:**
```javascript
// In backend/server.js, add Vercel to allowed origins:
const allowedOrigins = [
  'http://localhost:5173',
  'https://nlams-chennai.vercel.app', // Your Vercel URL
  'https://nlams-chennai-yourusername.vercel.app', // If different
  process.env.FRONTEND_URL,
].filter(Boolean);
```

**Or just update .env:**
```powershell
cd d:\SIH2026\PS3\backend
```

Add to `.env`:
```
FRONTEND_URL=https://nlams-chennai.vercel.app
```

Backend already has wildcard CORS for ngrok and Vercel domains, so it should work!

---

## 🧪 Testing

### Test Backend Locally
```powershell
curl http://localhost:5000/health
# Should return: {"status":"ok",...}
```

### Test Backend via Ngrok
Open in browser: `https://your-backend.ngrok-free.app/health`

### Test Frontend on Vercel
1. Open: `https://nlams-chennai.vercel.app`
2. Login: `collector.chennai@tn.gov.in` / `Password@123`
3. Check dashboard loads
4. Check map renders
5. Open browser console - should see API calls to your ngrok backend

---

## 🐛 Troubleshooting

### "CORS error on Vercel frontend"

**Cause:** Backend doesn't allow Vercel domain

**Fix:** Update `backend/server.js` or restart backend to pick up CORS changes

### "API calls failing (404/500)"

**Cause:** Wrong backend URL in Vercel

**Fix:**
1. Check `.env.production`: `Get-Content .env.production`
2. Should be: `VITE_API_URL=https://your-ngrok-url.ngrok-free.app/api`
3. Redeploy: `vercel --prod`

### "Vercel deployment failed"

**Cause:** Build errors

**Fix:**
```powershell
# Test build locally first
cd frontend
npm run build
# Fix any errors, then redeploy
```

### "Backend ngrok URL changed"

**Cause:** Ngrok session expired (2 hours free limit)

**Fix:**
1. Restart ngrok: `ngrok http 5000`
2. Copy new URL
3. Update Vercel env var or redeploy with new `.env.production`

### "Vercel deployment takes long"

**Cause:** Initial deployment installs dependencies

**Fix:** Normal! First deploy ~2-3 minutes. Updates ~30 seconds.

---

## 📊 What Your Friend Sees

### No Ngrok Warning! 🎉

**Frontend:** Professional Vercel URL
```
https://nlams-chennai.vercel.app
```
- No warning banner
- Fast loading (Vercel CDN)
- Permanent URL

**Backend:** Handled transparently
- API calls go to your ngrok backend
- Your friend never sees the backend URL
- Works seamlessly

---

## 💰 Cost Comparison

| Service | Free Plan | Paid Plan |
|---------|-----------|-----------|
| **Vercel** | ✅ Free forever | $20/mo (Pro) |
| | Unlimited projects | Better performance |
| | 100GB bandwidth | Team features |
| **Ngrok** | ✅ 1 tunnel, 2hr sessions | $10/mo (Personal) |
| | Basic features | Static domain |
| | | Unlimited sessions |

**Recommended for you:**
- Vercel: Free ✅
- Ngrok: Free (or $10/mo for static domain)

**Total: $0 - $10/month**

---

## 🎓 Git Setup (Optional but Recommended)

Connect to GitHub for automatic deployments:

```powershell
cd d:\SIH2026\PS3

# Initialize git (if not done)
git init

# Create .gitignore (already exists)
# Make sure it includes:
# - node_modules/
# - .env
# - NGROK_URLS.txt

# Commit
git add .
git commit -m "Initial commit - NLAMS prototype"

# Push to GitHub
git remote add origin https://github.com/yourusername/nlams-chennai.git
git branch -M main
git push -u origin main
```

**Connect Vercel to GitHub:**
1. Go to: https://vercel.com/new
2. Import Git Repository
3. Select your repo
4. Vercel auto-deploys on every push!

---

## ✅ Deployment Checklist

### Initial Setup
- [ ] Vercel account created
- [ ] Vercel CLI installed: `npm install -g vercel`
- [ ] Logged in: `vercel login`
- [ ] Backend running: `cd backend && npm start`
- [ ] Ngrok tunnel created: `ngrok http 5000`
- [ ] Backend URL copied

### Frontend Deployment
- [ ] `.env.production` updated with backend URL
- [ ] Deployed to Vercel: `vercel --prod`
- [ ] Vercel URL received
- [ ] Environment variables set in Vercel dashboard
- [ ] Tested Vercel frontend in browser
- [ ] Login works
- [ ] API calls work
- [ ] Dashboard loads data

### Sharing
- [ ] Share Vercel URL (not ngrok)
- [ ] Share demo credentials
- [ ] Share `SHARE_WITH_FRIEND.md` (optional)
- [ ] Tell friend about features to test

---

## 🎯 Quick Commands Reference

### Start Backend Session
```powershell
# Terminal 1 - Backend
cd d:\SIH2026\PS3\backend
npm start

# Terminal 2 - Ngrok
ngrok http 5000
# Copy URL
```

### Update Frontend (if backend URL changed)
```powershell
cd d:\SIH2026\PS3\frontend

# Update env
$backendUrl = "NEW-NGROK-URL"
Set-Content .env.production "VITE_API_URL=$backendUrl/api"

# Redeploy
vercel --prod
```

### View Deployment
```powershell
# Open in browser
vercel --prod --open

# Check logs
vercel logs
```

---

## 📚 Documentation Files

- `DEPLOY_VERCEL_NGROK.md` - This file
- `SHARE_WITH_FRIEND.md` - For your testers
- `NGROK_SETUP.md` - Ngrok detailed guide
- `README.md` - Main project docs

---

## 🎉 Summary

**What You Have:**
- ✅ Frontend on Vercel (permanent, fast, professional)
- ✅ Backend on ngrok (temporary, but only 1 tunnel needed)
- ✅ Works with free accounts
- ✅ No ngrok warning on frontend
- ✅ Easy to share

**Workflow:**
1. Start backend + ngrok (2 terminals)
2. Deploy/update Vercel if needed
3. Share Vercel URL
4. Your friend tests seamlessly!

**Next Steps:**
- Follow Step 1-5 above to deploy
- Share Vercel URL with your friend
- Keep backend + ngrok terminals running

---

<div align="center">

**Best of Both Worlds! 🎊**

*Professional frontend + Flexible backend*

**Let's deploy to Vercel now!**

</div>
