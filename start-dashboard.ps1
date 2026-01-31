#!/usr/bin/env powershell

# ============================================
# GitHub Copilot Dashboard - PowerShell Launcher
# ============================================

$Host.UI.RawUI.WindowTitle = "GitHub Copilot Dashboard"

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║    GitHub Copilot Dashboard - Starting...          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-Host "✗ ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org" -ForegroundColor Yellow
    Write-Host "Then try again." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Get the directory where this script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$outputDir = Join-Path $scriptDir ".output"

# Check if .output directory exists
if (-not (Test-Path $outputDir)) {
    Write-Host "✗ ERROR: Production build not found" -ForegroundColor Red
    Write-Host "Expected location: $outputDir" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure the .output directory exists." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Setup environment variables
$env:NODE_ENV = "production"
if (-not $env:NUXT_SESSION_PASSWORD) {
    $env:NUXT_SESSION_PASSWORD = "copilot-$(Get-Random)-$(Get-Random)-$(Get-Random)"
}
$env:NUXT_PUBLIC_IS_DATA_MOCKED = "true"

# Check for .env.local file
$envLocalPath = Join-Path $scriptDir ".env.local"
if (Test-Path $envLocalPath) {
    Write-Host ""
    Write-Host "✓ Found .env.local - loading user credentials" -ForegroundColor Green
    $envContent = Get-Content $envLocalPath
    foreach ($line in $envContent) {
        if ($line -and -not $line.StartsWith("#")) {
            $key, $value = $line -split "=", 2
            if ($key -and $value) {
                $env:$($key.Trim()) = $value.Trim()
            }
        }
    }
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "⚠ No .env.local found - using mock data (sample data)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To use real GitHub data:" -ForegroundColor Yellow
    Write-Host "1. Create file: .env.local" -ForegroundColor Yellow
    Write-Host "2. Add line: NUXT_GITHUB_TOKEN=your_github_token" -ForegroundColor Yellow
    Write-Host "3. Save and restart this launcher" -ForegroundColor Yellow
    Write-Host ""
    Start-Sleep -Seconds 2
}

$serverPath = Join-Path $outputDir "server" "index.mjs"

Write-Host "ℹ Starting dashboard server..." -ForegroundColor Cyan
Write-Host "ℹ Opening dashboard at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

# Auto-open browser after a moment
$job = Start-Job -ScriptBlock {
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:3000" -ErrorAction SilentlyContinue
}

# Start the server
& node $serverPath

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Server failed to start" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Read-Host "Press Enter to exit"
