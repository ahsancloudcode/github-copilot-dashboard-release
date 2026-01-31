#!/usr/bin/env pwsh
# GitHub Copilot Prompts Dashboard - Setup Script
# Generates .env-copy with secure random password

Write-Host "🔧 Setting up GitHub Copilot Dashboard..." -ForegroundColor Cyan
Write-Host ""

# Generate random password (32+ characters)
$randomPassword = -join ((1..40) | ForEach-Object { [char]((Get-Random -InputObject (33..126)) ) })

# Create .env-copy
$envContent = @"
# GitHub Copilot Prompts Dashboard - Configuration
# Auto-generated: $(Get-Date)

# Session Password (Auto-generated - Required)
NUXT_SESSION_PASSWORD=$randomPassword

# GitHub API Token (Optional)
# Get from: https://github.com/settings/tokens
# Scopes: copilot, manage_billing:copilot, read:org, read:enterprise
NUXT_GITHUB_TOKEN=

# Organization Name (Optional)
NUXT_PUBLIC_GITHUB_ORG=

# Data Source (Optional - set to 'true' for demo mode)
NUXT_PUBLIC_IS_DATA_MOCKED=false
"@

# Write to file
$envContent | Set-Content -Path ".env-copy" -Encoding UTF8

Write-Host "✅ .env-copy created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Session Password: $randomPassword" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "  1. (Optional) Edit .env-copy to add GitHub token"
Write-Host "  2. Run: npm install"
Write-Host "  3. Run: npm run dev"
Write-Host "  4. Open: http://localhost:3001/"
Write-Host ""
Write-Host "ℹ️  For GitHub token, visit: https://github.com/settings/tokens" -ForegroundColor Gray
