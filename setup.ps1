#!/usr/bin/env pwsh
# GitHub Copilot Prompts Dashboard - Setup Script
# Generates .env-copy with secure random password and mock data enabled

Write-Host "🔧 Setting up GitHub Copilot Dashboard..." -ForegroundColor Cyan
Write-Host ""

# Generate random password (32+ characters)
$randomPassword = -join ((1..40) | ForEach-Object { [char]((Get-Random -InputObject (33..126)) ) })

# Create .env.local with MOCK DATA ENABLED by default
$envContent = @"
# GitHub Copilot Prompts Dashboard - Configuration
# Auto-generated: $(Get-Date)

# Session Password (Auto-generated - Required)
NUXT_SESSION_PASSWORD=$randomPassword

# Data Source (IMPORTANT)
# ✅ Mock/Demo Data (Recommended for first-time setup)
NUXT_PUBLIC_IS_DATA_MOCKED=true

# GitHub API Token (Optional - only if you want real GitHub data)
# Get from: https://github.com/settings/tokens
# Scopes: copilot, manage_billing:copilot, read:org, read:enterprise
NUXT_GITHUB_TOKEN=

# Organization Name (Optional - only needed for real GitHub data)
NUXT_PUBLIC_GITHUB_ORG=
"@

# Write to file
$envContent | Set-Content -Path ".env.local" -Encoding UTF8

Write-Host "✅ .env.local created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Session Password: $randomPassword" -ForegroundColor Yellow
Write-Host "Mock Data Enabled: YES (using demo data)" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: npm install"
Write-Host "  2. Run: npm run dev"
Write-Host "  3. Open: http://localhost:3000/"
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "  • Dashboard uses MOCK DATA by default - perfect for testing"
Write-Host "  • To use real GitHub data, edit .env.local and add GitHub token"
Write-Host "  • Then set NUXT_PUBLIC_IS_DATA_MOCKED=false"
Write-Host "  • Get token: https://github.com/settings/tokens" -ForegroundColor Gray

