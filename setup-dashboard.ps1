# GitHub Copilot Dashboard - Auto Setup & Run Script (PowerShell)
# This script automatically downloads, configures, and runs the dashboard
# Works seamlessly when installed via VS Code Extension

$ErrorActionPreference = "Continue"

Write-Host "`n" -NoNewline
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   GitHub Copilot Dashboard - One-Click Setup                  ║" -ForegroundColor Green
Write-Host "║   Powered by github-copilot-prompts Extension                 ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "`n"

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please download from: https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit 1
}

# Detect if we're already in the release repo
if (Test-Path ".output\server\index.mjs") {
    Write-Host "✅ Release repository detected!`n" -ForegroundColor Green
    ConfigureAndRun
    exit 0
}

# Create temporary directory for download
$tempDir = "$env:TEMP\copilot-dashboard-setup-$(Get-Random)"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

Write-Host "📥 Downloading GitHub Copilot Dashboard Release..." -ForegroundColor Yellow
Write-Host "   Repository: https://github.com/ahsancloudcode/github-copilot-dashboard-release`n"

# Clone the repository
Set-Location $tempDir
try {
    git clone https://github.com/ahsancloudcode/github-copilot-dashboard-release . 2>$null
} catch {
    Write-Host "❌ Failed to download repository!" -ForegroundColor Red
    Write-Host "Please ensure:" -ForegroundColor Yellow
    Write-Host "  1. Git is installed: https://git-scm.com/" -ForegroundColor Yellow
    Write-Host "  2. You have internet connection`n" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✅ Repository downloaded successfully!`n" -ForegroundColor Green

# Check for pre-built server
if (-not (Test-Path ".output.zip")) {
    Write-Host "❌ Pre-built server not found!" -ForegroundColor Red
    Write-Host "Please download the release with .output.zip file`n" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "📦 Extracting pre-built server...`n" -ForegroundColor Yellow
try {
    Expand-Archive -Path ".output.zip" -DestinationPath "." -Force
} catch {
    Write-Host "❌ Failed to extract server!" -ForegroundColor Red
    pause
    exit 1
}

if (-not (Test-Path ".output\server\index.mjs")) {
    Write-Host "❌ Failed to extract server components!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "✅ Server extracted successfully!`n" -ForegroundColor Green

ConfigureAndRun

function ConfigureAndRun {
    Write-Host "🔧 Configuration Setup" -ForegroundColor Yellow
    Write-Host "════════════════════════════════════════`n"
    
    # Check if .env.local exists
    if (Test-Path ".env.local") {
        Write-Host "✅ .env.local found! Using existing configuration...`n" -ForegroundColor Green
    } else {
        Write-Host "Creating .env.local configuration...`n" -ForegroundColor Yellow
        
        # Generate secure session password
        $timestamp = (Get-Date -Format "yyyyMMddHHmmssfff")
        $random1 = Get-Random -Minimum 1000 -Maximum 9999
        $random2 = Get-Random -Minimum 1000 -Maximum 9999
        $sessionPassword = "cpwd_$timestamp`_$random1$random2"
        
        # Get GitHub org name from user
        $githubOrg = Read-Host "Enter your GitHub organization name (or press Enter for 'mocked-org' to test)"
        if ([string]::IsNullOrWhiteSpace($githubOrg)) {
            $githubOrg = "mocked-org"
            Write-Host "ℹ️  Using mock organization: $githubOrg`n" -ForegroundColor Cyan
        }
        
        # Create .env.local
        @"
NUXT_SESSION_PASSWORD=$sessionPassword
NUXT_PUBLIC_GITHUB_ORG=$githubOrg
NUXT_GITHUB_TOKEN=
NUXT_PUBLIC_IS_DATA_MOCKED=false
NUXT_PUBLIC_SCOPE=organization
"@ | Set-Content -Path ".env.local" -Encoding UTF8
        
        Write-Host "📝 Configuration file created: .env.local`n" -ForegroundColor Green
        Write-Host "⚠️  IMPORTANT - Add your GitHub credentials:" -ForegroundColor Yellow
        Write-Host "────────────────────────────────────────────`n"
        
        Write-Host "1. Get GitHub Token:" -ForegroundColor Cyan
        Write-Host "   a. Go to: https://github.com/settings/tokens" -ForegroundColor White
        Write-Host "   b. Click: Generate new token (classic)" -ForegroundColor White
        Write-Host "   c. Select scopes: " -ForegroundColor White -NoNewline
        Write-Host "copilot, manage_billing:copilot, read:org, read:enterprise" -ForegroundColor Yellow
        Write-Host "   d. Copy the token`n" -ForegroundColor White
        
        Write-Host "2. Edit .env.local:" -ForegroundColor Cyan
        Write-Host "   a. Open: .env.local" -ForegroundColor White
        Write-Host "   b. Paste your GitHub token in NUXT_GITHUB_TOKEN" -ForegroundColor White
        Write-Host "   c. Save the file`n" -ForegroundColor White
        
        Write-Host "3. Run this script again to start dashboard`n" -ForegroundColor Cyan
        
        Write-Host "Generated session password: $sessionPassword`n" -ForegroundColor Gray
        Write-Host "Testing? Set NUXT_PUBLIC_IS_DATA_MOCKED=true in .env.local`n" -ForegroundColor Cyan
        
        $continue = Read-Host "Ready to proceed? (yes/no)"
        if ($continue -ne "yes") {
            Write-Host "ℹ️  Configure your .env.local file and run this script again." -ForegroundColor Cyan
            pause
            exit 0
        }
    }
    
    # Verify .env.local exists
    if (-not (Test-Path ".env.local")) {
        Write-Host "❌ .env.local not found!" -ForegroundColor Red
        pause
        exit 1
    }
    
    Write-Host "`n🚀 Starting GitHub Copilot Dashboard..." -ForegroundColor Green
    Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "Dashboard URL: http://localhost:3000" -ForegroundColor White
    Write-Host "Repository: https://github.com/ahsancloudcode/github-copilot-dashboard-release" -ForegroundColor White
    Write-Host "════════════════════════════════════════`n" -ForegroundColor Cyan
    
    # Open browser
    Start-Sleep -Seconds 2
    try {
        Start-Process "http://localhost:3000"
    } catch {
        Write-Host "ℹ️  Open browser to: http://localhost:3000`n" -ForegroundColor Cyan
    }
    
    # Start the server
    if (Test-Path ".output\server\index.mjs") {
        node .output\server\index.mjs
    } else {
        Write-Host "❌ Server not found at .output\server\index.mjs" -ForegroundColor Red
        pause
        exit 1
    }
}
