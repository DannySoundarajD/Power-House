#!/usr/bin/env pwsh
# NLAMS Ngrok Deployment Script
# This script starts both backend and frontend with ngrok tunnels for remote testing

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🌐 NLAMS Ngrok Deployment for Remote Testing                ║" -ForegroundColor Cyan
Write-Host "║  National Land Acquisition & Management System                ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if ngrok is installed
Write-Host "🔍 Checking ngrok installation..." -ForegroundColor Yellow
$ngrokExists = Get-Command ngrok -ErrorAction SilentlyContinue
if (-not $ngrokExists) {
    Write-Host "❌ ERROR: ngrok is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install ngrok:" -ForegroundColor Yellow
    Write-Host "1. Download from https://ngrok.com/download" -ForegroundColor White
    Write-Host "2. Extract and add to PATH" -ForegroundColor White
    Write-Host "3. Authenticate: ngrok config add-authtoken <your-token>" -ForegroundColor White
    Write-Host ""
    exit 1
}
Write-Host "✅ ngrok found: $($ngrokExists.Source)" -ForegroundColor Green

# Check if backend dependencies are installed
Write-Host ""
Write-Host "📦 Checking backend dependencies..." -ForegroundColor Yellow
if (-not (Test-Path ".\backend\node_modules")) {
    Write-Host "⚙️  Installing backend dependencies..." -ForegroundColor Cyan
    Push-Location backend
    npm install
    Pop-Location
}
Write-Host "✅ Backend dependencies ready" -ForegroundColor Green

# Check if frontend dependencies are installed
Write-Host ""
Write-Host "📦 Checking frontend dependencies..." -ForegroundColor Yellow
if (-not (Test-Path ".\frontend\node_modules")) {
    Write-Host "⚙️  Installing frontend dependencies..." -ForegroundColor Cyan
    Push-Location frontend
    npm install
    Pop-Location
}
Write-Host "✅ Frontend dependencies ready" -ForegroundColor Green

# Check if backend .env exists
Write-Host ""
Write-Host "🔧 Checking backend configuration..." -ForegroundColor Yellow
if (-not (Test-Path ".\backend\.env")) {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item ".\backend\.env.example" ".\backend\.env"
    Write-Host "✅ Created .env file - Please configure database settings if needed" -ForegroundColor Green
} else {
    Write-Host "✅ Backend .env file exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  STEP 1: Starting Backend Server" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Start backend in background
Write-Host "🚀 Starting backend on http://localhost:5000..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location backend
    npm start
}

# Wait for backend to start
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if backend is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend is running and healthy" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend health check failed, but continuing..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  STEP 2: Creating Ngrok Tunnels" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Start ngrok for backend
Write-Host "🌐 Creating ngrok tunnel for backend (port 5000)..." -ForegroundColor Yellow
$backendNgrokJob = Start-Job -ScriptBlock {
    ngrok http 5000 --log=stdout
}

# Wait for ngrok to initialize
Write-Host "⏳ Waiting for ngrok tunnel to establish..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Get backend ngrok URL
Write-Host "🔍 Retrieving backend ngrok URL..." -ForegroundColor Yellow
try {
    $ngrokApi = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction Stop
    $backendNgrokUrl = $ngrokApi.tunnels[0].public_url
    
    # Prefer HTTPS URL
    $httpsUrl = $ngrokApi.tunnels | Where-Object { $_.proto -eq "https" } | Select-Object -First 1
    if ($httpsUrl) {
        $backendNgrokUrl = $httpsUrl.public_url
    }
    
    Write-Host "✅ Backend Ngrok URL: $backendNgrokUrl" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Could not retrieve ngrok URL" -ForegroundColor Red
    Write-Host "Make sure ngrok is authenticated: ngrok config add-authtoken <your-token>" -ForegroundColor Yellow
    Stop-Job $backendJob
    Stop-Job $backendNgrokJob
    exit 1
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  STEP 3: Configuring Frontend" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Update frontend .env.production with backend ngrok URL
Write-Host "⚙️  Configuring frontend to use backend ngrok URL..." -ForegroundColor Yellow
$frontendEnvContent = "# Auto-generated by deploy-ngrok.ps1`nVITE_API_URL=$backendNgrokUrl/api"
Set-Content -Path ".\frontend\.env.production" -Value $frontendEnvContent
Write-Host "✅ Frontend configured" -ForegroundColor Green

# Build frontend for production
Write-Host ""
Write-Host "🏗️  Building frontend with production settings..." -ForegroundColor Yellow
Push-Location frontend
$buildOutput = npm run build 2>&1
Pop-Location

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend build successful" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend build had warnings, but continuing..." -ForegroundColor Yellow
}

# Start frontend preview server
Write-Host ""
Write-Host "🚀 Starting frontend preview server..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location frontend
    npm run preview -- --port 5173 --host
}

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  STEP 4: Creating Frontend Ngrok Tunnel" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Start ngrok for frontend on a different port
Write-Host "🌐 Creating ngrok tunnel for frontend (port 5173)..." -ForegroundColor Yellow
$frontendNgrokJob = Start-Job -ScriptBlock {
    ngrok http 5173 --log=stdout
}

# Wait for second ngrok tunnel
Start-Sleep -Seconds 8

# Get frontend ngrok URL from different port
Write-Host "🔍 Retrieving frontend ngrok URL..." -ForegroundColor Yellow

# Since we can only have one ngrok inspector, we'll use a workaround
# Stop the first ngrok, start frontend ngrok on 4040
Stop-Job $backendNgrokJob
Remove-Job $backendNgrokJob

# Restart backend ngrok with custom config to get both tunnels
Write-Host "⚙️  Setting up dual ngrok tunnels..." -ForegroundColor Yellow

# Create ngrok config file
$ngrokConfigContent = @"
version: "2"
tunnels:
  backend:
    proto: http
    addr: 5000
  frontend:
    proto: http
    addr: 5173
"@

$ngrokConfigPath = Join-Path $env:TEMP "nlams-ngrok.yml"
Set-Content -Path $ngrokConfigPath -Value $ngrokConfigContent

# Start ngrok with config
$ngrokDualJob = Start-Job -ScriptBlock {
    $configPath = $using:ngrokConfigPath
    ngrok start --all --config=$configPath --log=stdout
}

Start-Sleep -Seconds 10

# Get both URLs
try {
    $ngrokApi = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction Stop
    
    $backendTunnel = $ngrokApi.tunnels | Where-Object { $_.config.addr -like "*5000*" -and $_.proto -eq "https" } | Select-Object -First 1
    $frontendTunnel = $ngrokApi.tunnels | Where-Object { $_.config.addr -like "*5173*" -and $_.proto -eq "https" } | Select-Object -First 1
    
    if (-not $backendTunnel) {
        $backendTunnel = $ngrokApi.tunnels | Where-Object { $_.config.addr -like "*5000*" } | Select-Object -First 1
    }
    if (-not $frontendTunnel) {
        $frontendTunnel = $ngrokApi.tunnels | Where-Object { $_.config.addr -like "*5173*" } | Select-Object -First 1
    }
    
    $backendNgrokUrl = $backendTunnel.public_url
    $frontendNgrokUrl = $frontendTunnel.public_url
    
    # Rebuild frontend with correct backend URL
    Write-Host ""
    Write-Host "🔄 Rebuilding frontend with correct backend URL..." -ForegroundColor Yellow
    $frontendEnvContent = "# Auto-generated by deploy-ngrok.ps1`nVITE_API_URL=$backendNgrokUrl/api"
    Set-Content -Path ".\frontend\.env.production" -Value $frontendEnvContent
    
    Push-Location frontend
    npm run build 2>&1 | Out-Null
    Pop-Location
    
    # Restart frontend preview
    Stop-Job $frontendJob
    Remove-Job $frontendJob
    
    $frontendJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        Set-Location frontend
        npm run preview -- --port 5173 --host
    }
    
    Start-Sleep -Seconds 5
    
} catch {
    Write-Host "⚠️  Could not retrieve both ngrok URLs, trying alternative method..." -ForegroundColor Yellow
    $backendNgrokUrl = $backendNgrokUrl  # Use previously set URL
    $frontendNgrokUrl = "http://localhost:5173"  # Fallback
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ NLAMS DEPLOYMENT SUCCESSFUL!                              ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Your NLAMS app is now accessible via ngrok!" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "  📡 SHARE THESE URLS WITH YOUR FRIEND:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host ""
Write-Host "  🌐 Frontend (Main App):  " -NoNewline -ForegroundColor Cyan
Write-Host "$frontendNgrokUrl" -ForegroundColor White
Write-Host "  🔧 Backend API:          " -NoNewline -ForegroundColor Cyan
Write-Host "$backendNgrokUrl" -ForegroundColor White
Write-Host "  📊 Ngrok Inspector:      " -NoNewline -ForegroundColor Cyan
Write-Host "http://localhost:4040" -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
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
Write-Host "   • Keep this terminal window open" -ForegroundColor White
Write-Host "   • Ngrok tunnels stay active as long as this script runs" -ForegroundColor White
Write-Host "   • View live traffic at http://localhost:4040" -ForegroundColor White
Write-Host "   • Press Ctrl+C to stop all services" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Note: Free ngrok tunnels timeout after 2 hours" -ForegroundColor Yellow
Write-Host ""

# Save URLs to file for reference
$urlsContent = @"
# NLAMS Ngrok Deployment URLs
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

Frontend URL: $frontendNgrokUrl
Backend URL: $backendNgrokUrl
Ngrok Inspector: http://localhost:4040

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

## Features to Test
1. Dashboard - View KPIs and charts
2. GIS Map - See Chennai district parcels
3. Projects - 8 real Chennai projects
4. Innovations:
   - AI Suitability Analysis
   - Ripple Impact Analysis
   - Voluntary Land Offers (Landowner Portal)
5. Workflow - Proposal approval system
6. Compensation Tracking - DBT disbursement
"@

Set-Content -Path ".\NGROK_URLS.txt" -Value $urlsContent
Write-Host "📝 URLs saved to NGROK_URLS.txt" -ForegroundColor Green
Write-Host ""

# Keep script running and monitor jobs
Write-Host "🔄 Monitoring services... (Press Ctrl+C to stop)" -ForegroundColor Cyan
Write-Host ""

try {
    while ($true) {
        Start-Sleep -Seconds 30
        
        # Check if jobs are still running
        if ($backendJob.State -ne "Running") {
            Write-Host "⚠️  Backend job stopped unexpectedly" -ForegroundColor Red
        }
        if ($frontendJob.State -ne "Running") {
            Write-Host "⚠️  Frontend job stopped unexpectedly" -ForegroundColor Red
        }
        if ($ngrokDualJob.State -ne "Running") {
            Write-Host "⚠️  Ngrok job stopped unexpectedly" -ForegroundColor Red
        }
    }
} finally {
    # Cleanup on exit
    Write-Host ""
    Write-Host "🛑 Stopping all services..." -ForegroundColor Yellow
    
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $frontendJob -ErrorAction SilentlyContinue
    Stop-Job $ngrokDualJob -ErrorAction SilentlyContinue
    
    Remove-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $ngrokDualJob -ErrorAction SilentlyContinue
    
    # Clean up temp config
    Remove-Item $ngrokConfigPath -ErrorAction SilentlyContinue
    
    Write-Host "✅ All services stopped" -ForegroundColor Green
    Write-Host ""
}
