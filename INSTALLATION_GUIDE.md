# 🚀 GitHub Copilot Dashboard - Installation Guide

**Version**: 2.0.11  
**Last Updated**: January 31, 2026

---

## Quick Start (30 Seconds)

### For Windows Users:

```bash
# 1. Download and extract release
git clone https://github.com/ahsancloudcode/github-copilot-dashboard-release.git
cd github-copilot-dashboard-release
Expand-Archive -Path .output.zip -DestinationPath . -Force

# 2. Create .env file with your credentials
# Copy this to a new file called .env.local:
# NUXT_SESSION_PASSWORD=your-32-char-password-here-minimum-length
# NUXT_PUBLIC_IS_DATA_MOCKED=false
# NUXT_PUBLIC_GITHUB_ORG=your-organization-name
# NUXT_GITHUB_TOKEN=ghp_your_github_token_here
# NUXT_PUBLIC_SCOPE=organization

# 3. Run dashboard
.\start-dashboard.bat

# 4. Open browser
# http://localhost:3000
```

---

## What You Get

This is a **standalone, pre-built release** that includes:

- ✅ **Pre-built Nuxt 3 Server** (`.output` folder)
- ✅ **Windows Batch Launcher** (`start-dashboard.bat`)
- ✅ **PowerShell Launcher** (`start-dashboard.ps1`)
- ✅ **No compilation needed** - Just run and use
- ✅ **GitHub OAuth Integration** - See real organization data
- ✅ **Local Copilot Integration** - View your IDE prompts/responses

**No need to:**
- ❌ Clone the main repository
- ❌ Install npm packages
- ❌ Run `npm build`
- ❌ Have Node.js installed (included via .output)

---

## Prerequisites

1. **Node.js 20+** (if you want to run custom builds)
   - Download from: https://nodejs.org
   - For this release: Not required! (.output is pre-built)

2. **GitHub Personal Access Token** (to see real data)
   - Get from: https://github.com/settings/tokens
   - Scopes needed:
     - `copilot` - GitHub Copilot
     - `manage_billing:copilot`
     - `read:enterprise`
     - `read:org`

3. **Windows OR PowerShell** (for running scripts)
   - Windows 10+ or Windows Server 2016+
   - Or Linux/Mac with Node.js (manual setup)

---

## Installation Steps

### Step 1: Download Release

```bash
# Clone the release repository
git clone https://github.com/ahsancloudcode/github-copilot-dashboard-release.git
cd github-copilot-dashboard-release
```

### Step 2: Extract Pre-built Server

```powershell
# Extract the .output.zip file (contains pre-built Nuxt server)
Expand-Archive -Path .output.zip -DestinationPath . -Force
```

**What is .output?**
- Pre-compiled Nuxt 3 server application
- Already built and optimized
- ~500MB compressed, ~2GB uncompressed
- Ready to run with Node.js

### Step 3: Create Configuration File

Create a file named **`.env.local`** in the root directory:

```bash
# REQUIRED: Session encryption key (minimum 32 characters)
NUXT_SESSION_PASSWORD=copilot-dashboard-session-key-auto-generated-at-startup-2026

# REQUIRED: GitHub organization name
NUXT_PUBLIC_GITHUB_ORG=your-organization-name

# REQUIRED: Use mock data or real data (false = real data)
NUXT_PUBLIC_IS_DATA_MOCKED=false

# REQUIRED: Scope type
NUXT_PUBLIC_SCOPE=organization

# REQUIRED: Your GitHub Personal Access Token
# Get from: https://github.com/settings/tokens
NUXT_GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuv

# OPTIONAL: For enterprise scope
# NUXT_PUBLIC_GITHUB_ENT=your-enterprise-name

# OPTIONAL: For team scope
# NUXT_PUBLIC_GITHUB_TEAM=your-team-name

# OPTIONAL: Enable OAuth (requires GitHub App setup)
# NUXT_PUBLIC_USING_GITHUB_AUTH=false
```

### Step 4: Run Dashboard

**Windows (Batch File):**
```bash
.\start-dashboard.bat
```

**PowerShell:**
```bash
.\start-dashboard.ps1
```

**What happens:**
1. ✅ Checks for Node.js
2. ✅ Validates .output folder
3. ✅ Auto-generates session password (if not set)
4. ✅ Loads .env.local configuration
5. ✅ Starts Nuxt server
6. ✅ Opens http://localhost:3000 in browser

### Step 5: Access Dashboard

Open your browser and go to:
```
http://localhost:3000
```

You should see:
- ✅ GitHub Copilot metrics for your organization
- ✅ Usage statistics and trends
- ✅ Chat metrics and analytics
- ✅ Language breakdown
- ✅ Seat analysis
- ✅ Your local Copilot prompts (if configured)

---

## Getting GitHub Token

### For Organization Access:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `copilot-dashboard`
4. Select these **Scopes**:
   - ✅ `copilot` - GitHub Copilot
   - ✅ `manage_billing:copilot`
   - ✅ `read:enterprise`
   - ✅ `read:org`
5. Click **"Generate token"**
6. **Copy the token** (looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
7. Paste into `.env.local` as `NUXT_GITHUB_TOKEN=ghp_...`

### For Enterprise Access:

Same process, but also select:
- ✅ `manage_billing:enterprise`
- ✅ `read:enterprise`

---

## Viewing Local Copilot Data

### What You Can See:

1. **GitHub Copilot Chat History**
   - IDE: Visual Studio Code, VS Insider, Cursor, etc.
   - Chat sessions with timestamps
   - Prompts and responses
   - Status (accepted/rejected)

2. **Prompts & Responses**
   - Code suggestions
   - Explanations
   - Refactoring suggestions
   - Bug fixes

3. **Local IDE Paths** (Automatically Detected):
   - Visual Studio Code
   - VS Code Insider
   - Cursor
   - GitHub CLI
   - Visual Studio
   - JetBrains IDEs
   - MySQL Workbench

### Configuration:

The dashboard automatically detects local paths. To customize:

Edit `.env.local`:
```bash
# Custom local paths (optional)
NUXT_LOCAL_VSCODE_PATH=C:\Users\YourName\AppData\Roaming\Code\User
NUXT_LOCAL_CURSOR_PATH=C:\Users\YourName\AppData\Roaming\Cursor\User
```

---

## Troubleshooting

### Issue: "Password string too short"
**Solution**: 
- Password must be minimum 32 characters
- Or leave `NUXT_SESSION_PASSWORD` empty to auto-generate
- Or use: `copilot-dashboard-session-key-auto-generated-at-startup-2026`

### Issue: "Cannot find .output folder"
**Solution**:
- Run: `Expand-Archive -Path .output.zip -DestinationPath . -Force`
- Ensure you're in the correct directory

### Issue: "Node.js not found"
**Solution**:
- Install Node.js from: https://nodejs.org
- Or modify .output server location in batch file

### Issue: "GitHub token invalid"
**Solution**:
- Check token at: https://github.com/settings/tokens
- Regenerate if expired
- Ensure scopes are correct: copilot, manage_billing:copilot, read:org, read:enterprise

### Issue: "Address already in use (port 3000)"
**Solution**:
```powershell
# Kill existing Node process
taskkill /F /IM node.exe
# Wait 2 seconds
Start-Sleep -Seconds 2
# Run dashboard again
.\start-dashboard.bat
```

### Issue: "Using mock data instead of real data"
**Solution**:
- Ensure `NUXT_PUBLIC_IS_DATA_MOCKED=false` in `.env.local`
- Ensure `NUXT_GITHUB_TOKEN` is set with valid token
- Ensure `NUXT_PUBLIC_GITHUB_ORG` is your actual organization name
- Restart dashboard

---

## Advanced Configuration

### Running on Different Port:

Edit `start-dashboard.bat` (line ~75):

```batch
REM Start the server
set PORT=3001
node "%OUTPUT_DIR%\server\index.mjs"
```

Then access: `http://localhost:3001`

### Running Multiple Instances:

```bash
# Terminal 1
set PORT=3000
.\start-dashboard.bat

# Terminal 2
set PORT=3001
.\start-dashboard.bat

# Access both:
# http://localhost:3000
# http://localhost:3001
```

### Docker Deployment:

```bash
# Build Docker image
docker build -t copilot-dashboard .

# Run container
docker run -p 3000:3000 \
  -e NUXT_GITHUB_TOKEN=ghp_your_token \
  -e NUXT_PUBLIC_GITHUB_ORG=your-org \
  copilot-dashboard
```

---

## File Structure

```
github-copilot-dashboard-release/
├── .output/                      # Pre-built Nuxt server
│   ├── server/                   # Node.js server files
│   └── public/                   # Static assets
├── .output.zip                   # Compressed .output folder
├── start-dashboard.bat           # Windows launcher
├── start-dashboard.ps1           # PowerShell launcher
├── .env.local.example            # Configuration template
├── .env.local                    # Your configuration (git-ignored)
├── README.md                     # Project info
├── INSTALLATION_GUIDE.md         # This file
└── GITHUB_SETUP.md              # Token setup guide
```

---

## Security Notes

### Keep These Secret:
- ❌ Never commit `.env.local` to git
- ❌ Never share `NUXT_GITHUB_TOKEN`
- ❌ Never expose `NUXT_SESSION_PASSWORD`

### File is Git-Ignored:
```gitignore
.env.local          # Your credentials
.env.local.*        # Any env variants
```

### Access Control:
- Session password: 32+ character encryption key
- GitHub token: OAuth token with limited scopes
- Only you can see your copilot prompts (local paths)

---

## Support & Troubleshooting

### Check Logs:
```bash
# Batch file shows:
# - Node.js version
# - .output location
# - Configuration loaded
# - Server startup messages
```

### Health Check:
```bash
# Test if server is running:
curl http://localhost:3000/api/health

# Should return JSON with status, timestamp, version
```

### Restart Dashboard:
```bash
# Kill existing process
taskkill /F /IM node.exe

# Wait and restart
Start-Sleep -Seconds 2
.\start-dashboard.bat
```

---

## Next Steps

1. ✅ Clone release repo
2. ✅ Extract `.output.zip`
3. ✅ Create `.env.local` with your token
4. ✅ Run `start-dashboard.bat`
5. ✅ Visit http://localhost:3000
6. ✅ View your GitHub Copilot metrics!

**Questions?** Check [README.md](README.md) or [GITHUB_SETUP.md](GITHUB_SETUP.md)

---

**Happy Monitoring! 🎉**
