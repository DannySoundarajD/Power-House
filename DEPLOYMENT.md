# NLAMS Deployment Guide

## Live URLs
- **Frontend (Vercel):** https://frontend-rust-psi-63.vercel.app
- **Backend (ngrok):** https://floristically-glottogonic-eusebio.ngrok-free.dev
- **Login Page:** https://frontend-rust-psi-63.vercel.app/login

## Test Credentials
### District Collector (Chennai)
- **Email:** `collector.chennai@tn.gov.in`
- **Password:** `Password@123`
- **Role:** District Collector

### Other Test Users (all use `Password@123`)
- `admin@nlams.gov.in` - Central Admin
- `surveyor.south@tn.gov.in` - Surveyor
- `legal.chennai@tn.gov.in` - Legal Officer
- `comp.officer@tn.gov.in` - Compensation Officer
- `owner.smith@gmail.com` - Landowner
- `owner.kumar@gmail.com` - Landowner

## Running the Application

### Backend (with ngrok)
```powershell
# Terminal 1: Start backend server
cd d:\SIH2026\PS3\backend
npm start

# Terminal 2: Start ngrok tunnel with CORS fix
ngrok http 5000 --host-header="rewrite"
```

**Important:** The `--host-header="rewrite"` flag is REQUIRED for CORS to work properly through ngrok.

### Frontend (Auto-deploy)
- Automatically deploys to Vercel when pushing to GitHub
- Connected to repository for CI/CD

## Database Configuration

### PostgreSQL Connection
- **Host:** localhost
- **Port:** 5432
- **Database:** nlams_db
- **User:** nlams_user
- **Password:** nlams_secure_2024

### Postgres Superuser
- **User:** postgres
- **Password:** Danny123$1

### Connect to Database
```powershell
# Add PostgreSQL to PATH
$env:Path = "C:\Program Files\PostgreSQL\16\bin;" + $env:Path

# Connect as nlams_user
psql -U nlams_user -d nlams_db

# Connect as postgres (for admin tasks)
psql -U postgres -d nlams_db
```

## CORS Fix Applied

### Backend Changes
1. **Middleware order:** CORS placed before helmet
2. **Manual CORS headers:** Fallback middleware adds explicit headers
3. **Allowed origins:** Includes Vercel and ngrok URLs

### Frontend Changes
1. **ngrok-skip-browser-warning header:** Bypasses ngrok warning page
2. **User-Agent header:** Custom identifier for requests

### ngrok Configuration
- Using `--host-header="rewrite"` to properly handle CORS headers
- Free tier with inspection at http://127.0.0.1:4040

## Troubleshooting

### If login fails with 401
```powershell
# Verify user exists
psql -U postgres -d nlams_db
SELECT email, name, role FROM users;

# Update password hash if needed
UPDATE users SET password_hash = '$2b$12$7OpSfzVsDPg4kxbFjbvxtOoeJSkO3PFIAsuZD4kFOr3TtvSfE8yf6' 
WHERE email = 'collector.chennai@tn.gov.in';
```

### If CORS errors persist
1. Restart ngrok with `--host-header="rewrite"` flag
2. Restart backend server
3. Hard refresh browser (Ctrl+Shift+R)
4. Check ngrok inspector at http://127.0.0.1:4040

### If Vercel doesn't deploy
1. Check GitHub push succeeded: `git log --oneline -1`
2. Check Vercel dashboard for build logs
3. Manually trigger redeploy in Vercel dashboard

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nlams_db
DB_USER=nlams_user
DB_PASSWORD=nlams_secure_2024
JWT_SECRET=nlams_jwt_secret_key_2024_secure
JWT_REFRESH_SECRET=nlams_refresh_secret_2024
PORT=5000
```

### Frontend (.env.production)
```
VITE_API_URL=https://floristically-glottogonic-eusebio.ngrok-free.dev/api
```

## Architecture

### Technology Stack
- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL 16
- **Authentication:** JWT (access + refresh tokens)
- **Hosting:** Vercel (frontend) + ngrok (backend)

### Security Features
- Helmet.js for HTTP headers
- CORS protection with allowed origins
- Rate limiting (500 req/15min general, 20 req/15min auth)
- JWT tokens with 24h expiry
- Bcrypt password hashing (12 rounds)
- Audit logging for authentication events

## Next Steps for Production

1. **Replace ngrok** with proper hosting (AWS, Azure, Railway, Render)
2. **Install PostGIS** for geospatial features
3. **Setup proper secrets management** (AWS Secrets Manager, Azure Key Vault)
4. **Add monitoring** (Sentry, LogRocket, DataDog)
5. **Setup CI/CD pipelines** for backend deployment
6. **Configure custom domain** for frontend
7. **Add HTTPS certificate** for backend
8. **Setup database backups** and disaster recovery

## Support

For issues or questions about the deployment:
1. Check ngrok inspector: http://127.0.0.1:4040
2. Check backend logs in terminal
3. Check browser console for frontend errors
4. Check Vercel deployment logs in dashboard
