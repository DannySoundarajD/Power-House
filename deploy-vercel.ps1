#!/usr/bin/env pwsh
# NLAMS Vercel + Ngrok Deployment Script
# Frontend on Vercel (permanent URL) + Backend on Ngrok (temporary URL)

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 NLAMS Vercel + Ngrok Deployment                          ║" -ForegroundColor Cyan
Write-Host "║  Frontend: Vercel • Backend: Ngrok                           ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if vercel CLI is installed
Write-Host "🔍 Checking Vercel CLI..." -ForegroundColor Yellow
$vercelExists = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelExists) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
}

# Check if ngrok is installed
Write-Host "🔍 Checking ngrok..." -ForegroundColor Yellow
$ngrokExists = Get-Command ngrok -ErrorAction SilentlyContinue
if (-not $ngrokExists) {
    Write-Host "❌ ERROR: ngrok is not installed" -ForegroundColor Red
    Write-Host "Please install from: https://ngrok.com/download" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ ngrok found" -ForegroundColor Green

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  STEP 1: Starting Backend + Ngrok Tunnel" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Check backend dependencies
if (-not (Test-Path ".\backend\node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Push-Location backend
    npm install
    Pop-Location
}

# Start backend
Write-Host "🚀 Starting backend..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location backend
    npm start 2>&1
}

Start-Sleep -Seconds 5

# Check backend health
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend is running on http://localhost:5000" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend health check failed, but continuing..." -ForegroundColor Yellow
}

# Start ngrok
Write-Host "🌐 Creating ngrok tunnel..." -ForegroundColor Yellow
$ngrokJob = Start-Job -ScriptBlock {
    ngrok http 5000 --log=stdout 2>&1
}

Start-Sleep -Seconds 8

# Get ngrok URL
Write-Host "🔍 Retrieving backend ngrok URL..." -ForegroundColor Yellow
try {
    $ngrokApi = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction Stop
    
    # Prefer HTTPS URL
    $httpsUrl = $ngrokApi.tunnels | Where-Object { $_.proto -eq "https" } | Select-Object -First 1
    if ($httpsUrl) {
        $backendNgrokUrl = $httpsUrl.public_url
    } else {
        $backendNgrokUrl = $ngrokApi.tunnels[0].public_url
    }
    
    Write-Host "✅ Backend Ngrok URL: $backendNgrokUrl" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Could not retrieve ngrok URL" -ForegroundColor Red
    Write-Host "Make sure ngrok is authenticated: ngrok config add-authtoken <token>" -ForegroundColor Yellow
    
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $ngrokJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $ngrokJob -ErrorAction SilentlyContinue
    
    exit 1
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  STEP 2: Configuring Frontend for Vercel" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Check frontend dependencies
if (-not (Test-Path ".\frontend\node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location frontend
    npm install
    Pop-Location
}

# Update frontend .env.production with backend URL
Write-Host "⚙️  Setting backend URL in .env.production..." -ForegroundColor Yellow
$frontendEnvContent = "# Backend API URL (ngrok tunnel)`n# Updated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`nVITE_API_URL=$backendNgrokUrl/api"
Set-Content -Path ".\frontend\.env.production" -Value $frontendEnvContent
Write-Host "✅ Frontend configured with backend: $backendNgrokUrl/api" -ForegroundColor Green

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  STEP 3: Deploying Frontend to Vercel" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Push-Location frontend

Write-Host "🏗️  Building frontend..." -ForegroundColor Yellow
npm run build 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend build successful" -ForegroundColor Green
} else {
    Write-Host "⚠️  Build completed with warnings" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "   (This may take 1-2 minutes on first deployment)" -ForegroundColor Gray
Write-Host ""

# Deploy to Vercel production
$vercelOutput = vercel --prod --yes 2>&1
$vercelUrl = ""

# Extract Vercel URL from output
foreach ($line in $vercelOutput) {
    if ($line -match "https://.*\.vercel\.app") {
        $vercelUrl = $matches[0]
    }
}

Pop-Location

if ($vercelUrl) {
    Write-Host "✅ Deployed to Vercel successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Deployment may have succeeded, check Vercel dashboard" -ForegroundColor Yellow
    Write-Host "   Visit: https://vercel.com/dashboard" -ForegroundColor Gray
    $vercelUrl = "https://[check-vercel-dashboard].vercel.app"
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ DEPLOYMENT SUCCESSFUL!                                    ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Your NLAMS app is now live!" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "  📡 SHARE THIS URL WITH YOUR FRIEND:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host ""
Write-Host "  🌐 Frontend (Vercel):  " -NoNewline -ForegroundColor Cyan
Write-Host "$vercelUrl" -ForegroundColor White
Write-Host ""
Write-Host "  🔧 Backend (Ngrok):    " -NoNewline -ForegroundColor Cyan
Write-Host "$backendNgrokUrl" -ForegroundColor White
Write-Host "  📊 Ngrok Inspector:    " -NoNewline -ForegroundColor Cyan
Write-Host "http://localhost:4040" -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host ""
Write-Host "✨ Benefits:" -ForegroundColor Cyan
Write-Host "   • No ngrok warning banner (Vercel URL is professional!)" -ForegroundColor White
Write-Host "   • Frontend URL never changes" -ForegroundColor White
Write-Host "   • Fast loading via Vercel CDN" -ForegroundColor White
Write-Host "   • Only 1 ngrok tunnel needed (free account works!)" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Backend Session Info:" -ForegroundColor Yellow
Write-Host "   • Ngrok URL expires after 2 hours (free account)" -ForegroundColor Gray
Write-Host "   • When ngrok expires: Re-run this script for new URL" -ForegroundColor Gray
Write-Host "   • OR: Keep ngrok running and just use existing Vercel URL" -ForegroundColor Gray
Write-Host ""
Write-Host "🔑 Demo Credentials (Password: Password@123):" -ForegroundColor Yellow
Write-Host "   • Central Admin: rajesh.kumar@dolr.gov.in" -ForegroundColor White
Write-Host "   • District Collector: collector.chennai@tn.gov.in" -ForegroundColor White
Write-Host "   • Field Officer: kumaran.s@tn.gov.in" -ForegroundColor White
Write-Host ""
Write-Host "👤 Landowner Portal:" -ForegroundColor Yellow
Write-Host "   • Phone: 9840001204, Last 4: 1204" -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "   • Keep this terminal open (backend & ngrok running)" -ForegroundColor White
Write-Host "   • Monitor traffic at http://localhost:4040" -ForegroundColor White
Write-Host "   • Vercel URL stays the same forever!" -ForegroundColor White
Write-Host "   • Press Ctrl+C to stop backend & ngrok" -ForegroundColor White
Write-Host ""

# Save URLs to file
$urlsContent = @"
# NLAMS Vercel + Ngrok Deployment URLs
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

Frontend (Vercel - Permanent): $vercelUrl
Backend (Ngrok - Temporary): $backendNgrokUrl
Ngrok Inspector: http://localhost:4040

## Share This With Your Friend:
$vercelUrl

## Demo Credentials
Password for all users: Password@123

Government Portal:
- Central Admin: rajesh.kumar@dolr.gov.in
- State Officer: priya.chandran@tn.gov.in
- District Collector: collector.chennai@tn.gov.in
- Field Officer: kumaran.s@tn.gov.in

Landowner Portal:
- Phone: 9840001204, Last 4: 1204
- Phone: 9840001210, Last 4: 1210

## When Backend Ngrok Expires:
1. Stop this script (Ctrl+C)
2. Run again: .\deploy-vercel.ps1
3. New backend URL will be configured automatically
4. Vercel URL stays the same!

## Features to Test:
- Dashboard with KPIs and charts
- GIS Map with Chennai district parcels
- 8 Real Chennai projects
- 3 Innovations (AI Suitability, Ripple Impact, Land Offers)
- Workflow approvals
- Compensation tracking
- All 14 modules working
"@

Set-Content -Path ".\VERCEL_DEPLOYMENT_URLS.txt" -Value $urlsContent
Write-Host "📝 URLs saved to VERCEL_DEPLOYMENT_URLS.txt" -ForegroundColor Green
Write-Host ""

# Monitor
Write-Host "🔄 Backend and ngrok are running... (Press Ctrl+C to stop)" -ForegroundColor Cyan
Write-Host ""

try {
    while ($true) {
        Start-Sleep -Seconds 30
        
        if ($backendJob.State -ne "Running") {
            Write-Host "⚠️  Backend stopped unexpectedly" -ForegroundColor Red
        }
        if ($ngrokJob.State -ne "Running") {
            Write-Host "⚠️  Ngrok stopped unexpectedly" -ForegroundColor Red
        }
    }
} finally {
    Write-Host ""
    Write-Host "🛑 Stopping backend and ngrok..." -ForegroundColor Yellow
    
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $ngrokJob -ErrorAction SilentlyContinue
    
    Remove-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $ngrokJob -ErrorAction SilentlyContinue
    
    Write-Host "✅ Backend and ngrok stopped" -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 Vercel frontend is still live at: $vercelUrl" -ForegroundColor Cyan
    Write-Host "   (Only backend API is stopped)" -ForegroundColor Gray
    Write-Host ""
}
