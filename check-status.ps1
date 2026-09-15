#!/usr/bin/env pwsh
# NLAMS Status Checker - Diagnose deployment issues

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🔍 NLAMS Status Checker                                      ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check PostgreSQL Service
Write-Host "1️⃣  Checking PostgreSQL Service..." -ForegroundColor Yellow
$pgService = Get-Service postgresql* -ErrorAction SilentlyContinue
if ($pgService) {
    if ($pgService.Status -eq "Running") {
        Write-Host "   ✅ PostgreSQL is running" -ForegroundColor Green
    } else {
        Write-Host "   ❌ PostgreSQL is stopped" -ForegroundColor Red
        Write-Host "   Fix: Start-Service $($pgService.Name)" -ForegroundColor Yellow
        $allGood = $false
    }
} else {
    Write-Host "   ❌ PostgreSQL not found" -ForegroundColor Red
    Write-Host "   Fix: Install PostgreSQL 16 from https://www.postgresql.org/download/" -ForegroundColor Yellow
    $allGood = $false
}
Write-Host ""

# Check Backend .env
Write-Host "2️⃣  Checking Backend Configuration..." -ForegroundColor Yellow
if (Test-Path ".\backend\.env") {
    Write-Host "   ✅ .env file exists" -ForegroundColor Green
    
    # Check critical env vars
    $envContent = Get-Content ".\backend\.env" -Raw
    if ($envContent -match "DB_NAME=") {
        Write-Host "   ✅ Database config found" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  DB_NAME not configured" -ForegroundColor Yellow
        $allGood = $false
    }
} else {
    Write-Host "   ❌ .env file missing" -ForegroundColor Red
    Write-Host "   Fix: Copy-Item .\backend\.env.example .\backend\.env" -ForegroundColor Yellow
    $allGood = $false
}
Write-Host ""

# Check Database Connection
Write-Host "3️⃣  Checking Database Connection..." -ForegroundColor Yellow
try {
    $result = psql -U nlams_user -d nlams_db -c "SELECT COUNT(*) FROM users;" 2>&1
    if ($result -match "7") {
        Write-Host "   ✅ Database connected (7 users found)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Database exists but data may be missing" -ForegroundColor Yellow
        Write-Host "   Fix: Run .\backend\setup-db.ps1" -ForegroundColor Yellow
        $allGood = $false
    }
} catch {
    Write-Host "   ❌ Cannot connect to database" -ForegroundColor Red
    Write-Host "   Fix: Run .\backend\setup-db.ps1 to create database" -ForegroundColor Yellow
    $allGood = $false
}
Write-Host ""

# Check Backend Process
Write-Host "4️⃣  Checking Backend Process..." -ForegroundColor Yellow
$nodeProcess = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcess) {
    Write-Host "   ✅ Backend process running (PID: $($nodeProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend not running" -ForegroundColor Red
    Write-Host "   Fix: cd backend && npm start" -ForegroundColor Yellow
    $allGood = $false
}
Write-Host ""

# Check Backend Health
Write-Host "5️⃣  Checking Backend Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/health" -TimeoutSec 5 -ErrorAction Stop
    if ($response.status -eq "ok") {
        Write-Host "   ✅ Backend responding (http://localhost:5000)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Backend responding but status not ok" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Backend not responding on port 5000" -ForegroundColor Red
    Write-Host "   Fix: cd backend && npm start" -ForegroundColor Yellow
    $allGood = $false
}
Write-Host ""

# Check Ngrok
Write-Host "6️⃣  Checking Ngrok Tunnel..." -ForegroundColor Yellow
$ngrokProcess = Get-Process ngrok -ErrorAction SilentlyContinue
if ($ngrokProcess) {
    Write-Host "   ✅ Ngrok process running (PID: $($ngrokProcess.Id))" -ForegroundColor Green
    
    try {
        $ngrokApi = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction Stop
        if ($ngrokApi.tunnels.Count -gt 0) {
            $tunnel = $ngrokApi.tunnels[0]
            Write-Host "   ✅ Tunnel active: $($tunnel.public_url)" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  No active tunnels" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ⚠️  Cannot access ngrok API (may be starting)" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ Ngrok not running" -ForegroundColor Red
    Write-Host "   Fix: ngrok http 5000" -ForegroundColor Yellow
    $allGood = $false
}
Write-Host ""

# Check Frontend Build
Write-Host "7️⃣  Checking Frontend..." -ForegroundColor Yellow
if (Test-Path ".\frontend\dist") {
    Write-Host "   ✅ Frontend built (dist folder exists)" -ForegroundColor Green
    
    if (Test-Path ".\frontend\.env.production") {
        $envProd = Get-Content ".\frontend\.env.production" -Raw
        if ($envProd -match "ngrok") {
            Write-Host "   ✅ Frontend configured with backend URL" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Backend URL not configured" -ForegroundColor Yellow
            Write-Host "   Fix: Update .\frontend\.env.production with ngrok URL" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "   ⚠️  Frontend not built yet" -ForegroundColor Yellow
    Write-Host "   Fix: cd frontend && npm run build" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
if ($allGood) {
    Write-Host "✅ All checks passed! System is ready." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Deploy to Vercel: cd frontend && vercel --prod" -ForegroundColor White
    Write-Host "  2. Or run: .\deploy-vercel.ps1" -ForegroundColor White
} else {
    Write-Host "⚠️  Some issues found. Follow fixes above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Quick fix:" -ForegroundColor Cyan
    Write-Host "  1. Fix database: .\backend\setup-db.ps1" -ForegroundColor White
    Write-Host "  2. Start backend: cd backend && npm start" -ForegroundColor White
    Write-Host "  3. Start ngrok: ngrok http 5000" -ForegroundColor White
    Write-Host "  4. Deploy: .\deploy-vercel.ps1" -ForegroundColor White
}
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host ""
