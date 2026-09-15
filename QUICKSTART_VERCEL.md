# ⚡ Quick Start: Vercel + Ngrok Deployment

**Easiest way to share NLAMS with your friend!**

---

## 🎯 One Command Deployment

```powershell
cd d:\SIH2026\PS3
.\deploy-vercel.ps1
```

**That's it!** Script does everything:
1. ✅ Starts backend
2. ✅ Creates ngrok tunnel for backend
3. ✅ Configures frontend with backend URL
4. ✅ Deploys frontend to Vercel
5. ✅ Gives you permanent Vercel URL to share

---

## 📋 First-Time Setup (5 minutes)

### 1. Install Vercel CLI
```powershell
npm install -g vercel
```

### 2. Login to Vercel
```powershell
vercel login
```
- Opens browser
- Sign up/login with GitHub/GitLab/Email
- Free account works perfectly!

### 3. Authenticate Ngrok (if not done)
```powershell
ngrok config add-authtoken YOUR_TOKEN
```
Get token from: https://dashboard.ngrok.com/get-started/your-authtoken

---

## 🚀 Deploy

```powershell
.\deploy-vercel.ps1
```

**What happens:**
- Backend starts on localhost:5000
- Ngrok creates tunnel for backend
- Frontend deploys to Vercel
- You get **permanent Vercel URL**

**Duration:** 1-2 minutes

---

## 📤 Share with Friend

After deployment, you'll see:
```
🌐 Frontend (Vercel):  https://nlams-chennai.vercel.app
```

**Share this URL** - it's:
- ✨ Permanent (never changes!)
- ✨ Professional (no ngrok warning)
- ✨ Fast (Vercel CDN)
- ✨ Free forever

**Also share:**
- Login: `collector.chennai@tn.gov.in`
- Password: `Password@123`

---

## 🔄 When Ngrok Expires (2 hours)

Just re-run the script:
```powershell
.\deploy-vercel.ps1
```

- New backend ngrok URL generated
- Frontend auto-updated on Vercel
- **Same Vercel URL** (your friend keeps using it!)

---

## ⏹️ Stop Backend

```powershell
# In the terminal running deploy-vercel.ps1
Ctrl+C
```

**Note:** Frontend on Vercel stays live! Only backend stops.

---

## ✅ Benefits vs Other Methods

| Feature | Vercel+Ngrok | 2 Ngrok Tunnels | Frontend Only |
|---------|--------------|-----------------|---------------|
| **Free Account** | ✅ Yes | ❌ No (needs paid) | ✅ Yes |
| **No Ngrok Warning** | ✅ Yes | ❌ No | ✅ Yes |
| **Permanent URL** | ✅ Yes | ❌ No | ❌ No |
| **Full Features** | ✅ Yes | ✅ Yes | ❌ Mock data |
| **Fast Loading** | ✅ Yes (CDN) | ⚠️ OK | ⚠️ OK |
| **Ease of Setup** | ✅ 1 command | ⚠️ 4 terminals | ✅ 2 terminals |

---

## 🎓 What Your Friend Sees

**Opens:** `https://nlams-chennai.vercel.app`
- No warning screen! Professional URL
- Fast loading from Vercel CDN
- Full NLAMS features
- Real database data
- All 3 innovations working

They never see:
- Ngrok warning banner
- Ngrok URLs
- "Visit Site" button

---

## 📊 Cost

- **Vercel:** Free forever
- **Ngrok:** Free (or $10/mo for permanent backend URL)
- **Total:** $0

---

## 🐛 Troubleshooting

### "Vercel login failed"
```powershell
# Clear cache and try again
vercel logout
vercel login
```

### "Ngrok not authenticated"
```powershell
ngrok config add-authtoken YOUR_TOKEN
```

### "Frontend deployed but API failing"
- Check backend is running (Terminal shows "Backend running")
- Check ngrok inspector: http://localhost:4040
- Check browser console for errors

### "Want to redeploy"
```powershell
# Just run script again
.\deploy-vercel.ps1
```

---

## 💡 Pro Tips

1. **Keep terminal open** while testing (backend must run)
2. **Monitor ngrok inspector** at http://localhost:4040
3. **Screenshot Vercel URL** - it's permanent!
4. **Use same URL forever** - no need to share new URLs
5. **Update only when ngrok expires** (every 2 hours on free)

---

## 🎉 You're Ready!

```powershell
cd d:\SIH2026\PS3
.\deploy-vercel.ps1

# Wait 1-2 minutes
# Share the Vercel URL that appears!
```

**Questions?** See `DEPLOY_VERCEL_NGROK.md` for detailed guide.

---

<div align="center">

**Easiest Deployment Method! 🚀**

*One command • Permanent URL • No ngrok warning*

</div>
