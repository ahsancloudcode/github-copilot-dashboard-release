# 🎯 GitHub Copilot Dashboard - Complete Release Setup Guide

**Version**: 2.0.11  
**Release Type**: Standalone (Pre-built, No Compilation Needed)  
**Last Updated**: January 31, 2026

---

## 📋 Table of Contents

1. [What You Get](#what-you-get)
2. [System Requirements](#system-requirements)
3. [Installation (5 minutes)](#installation-5-minutes)
4. [Configuration](#configuration)
5. [Running Dashboard](#running-dashboard)
6. [Using Real GitHub Data](#using-real-github-data)
7. [Viewing Local Copilot Data](#viewing-local-copilot-data)
8. [Troubleshooting](#troubleshooting)

---

## What You Get

This is a **production-ready release package** with:

✅ **Pre-built Nuxt Server** (`.output` folder)
- No `npm install` needed
- No `npm build` needed
- Ready to run with `node`

✅ **Windows Launchers**
- `start-dashboard.bat` - Batch file launcher
- `start-dashboard.ps1` - PowerShell launcher

✅ **Configuration System**
- `.env.local` - Your credentials (git-ignored)
- `.env.local.example` - Configuration template

✅ **Documentation**
- Installation guide
- GitHub token setup
- Troubleshooting tips

✅ **Local IDE Integration**
- Detect Visual Studio Code
- Detect Cursor, VS Insider
- View Copilot prompts/responses

---

## System Requirements

### Minimum Requirements:
- **Windows 10+** or Windows Server 2016+
- **Node.js 20+** (for running pre-built server)
  - Download: https://nodejs.org/
- **Git** (for cloning repository)
  - Download: https://git-scm.com/

### Optional:
- **GitHub Personal Access Token** (to view real org data)
  - Create: https://github.com/settings/tokens

---

## Installation (5 minutes)

### Step 1: Clone the Release Repository

```bash
# Clone
git clone https://github.com/ahsancloudcode/github-copilot-dashboard-release.git

# Navigate to folder
cd github-copilot-dashboard-release
```

### Step 2: Extract Pre-built Server

The release includes a pre-compiled `.output.zip` file containing the production-ready Nuxt server:

```powershell
# Windows PowerShell
Expand-Archive -Path .output.zip -DestinationPath . -Force

# Verify extraction
ls .output\server\
# Should show: index.mjs (and other files)
```

✅ This creates `.output` folder with:
- `.output/server/` - Node.js server
- `.output/public/` - Frontend assets
- Size: ~2GB uncompressed

### Step 3: Create Configuration File

Create a new file named **`.env.local`** in the root directory:

```bash
NUXT_SESSION_PASSWORD=copilot-dashboard-session-key-auto-generated-at-startup-2026
NUXT_PUBLIC_GITHUB_ORG=your-organization-name
NUXT_PUBLIC_IS_DATA_MOCKED=true
NUXT_PUBLIC_SCOPE=organization
```

**For Real GitHub Data**, see [Using Real GitHub Data](#using-real-github-data) below.

---

## Configuration

### `.env.local` Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NUXT_SESSION_PASSWORD` | ✅ Yes | Encryption key (min 32 chars) | `copilot-dashboard-...` |
| `NUXT_PUBLIC_GITHUB_ORG` | ✅ Yes | GitHub organization name | `my-company` |
| `NUXT_PUBLIC_SCOPE` | ✅ Yes | Metrics scope | `organization` |
| `NUXT_PUBLIC_IS_DATA_MOCKED` | ✅ Yes | Use mock data? | `true` or `false` |
| `NUXT_GITHUB_TOKEN` | ⚠️ If real data | Personal Access Token | `ghp_1234...` |
| `NUXT_PUBLIC_GITHUB_ENT` | ⚠️ If enterprise | Enterprise name | `my-enterprise` |
| `NUXT_PUBLIC_GITHUB_TEAM` | ❌ Optional | Team name | `my-team` |

### Full Example Configuration

**For Testing (Mock Data - No Token Needed):**
```env
NUXT_SESSION_PASSWORD=copilot-dashboard-session-key-auto-generated-at-startup-2026
NUXT_PUBLIC_GITHUB_ORG=mocked-org
NUXT_PUBLIC_IS_DATA_MOCKED=true
NUXT_PUBLIC_SCOPE=organization
```

**For Real GitHub Data:**
```env
NUXT_SESSION_PASSWORD=copilot-dashboard-session-key-auto-generated-at-startup-2026
NUXT_PUBLIC_GITHUB_ORG=your-organization-name
NUXT_GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuv
NUXT_PUBLIC_IS_DATA_MOCKED=false
NUXT_PUBLIC_SCOPE=organization
```

**For Enterprise:**
```env
NUXT_SESSION_PASSWORD=copilot-dashboard-session-key-auto-generated-at-startup-2026
NUXT_PUBLIC_GITHUB_ENT=your-enterprise-name
NUXT_GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuv
NUXT_PUBLIC_IS_DATA_MOCKED=false
NUXT_PUBLIC_SCOPE=enterprise
```

---

## Running Dashboard

### Method 1: Batch File (Windows - Easiest)

```bash
.\start-dashboard.bat
```

**What it does:**
1. ✅ Checks Node.js is installed
2. ✅ Validates `.output` folder exists
3. ✅ Auto-generates session password (if not set)
4. ✅ Loads `.env.local` configuration
5. ✅ Starts Nuxt server on port 3000
6. ✅ Opens browser to http://localhost:3000

### Method 2: PowerShell

```bash
.\start-dashboard.ps1
```

### Method 3: Manual Start

```bash
# Navigate to output folder
cd .output/server

# Start server (requires Node.js)
node index.mjs
```

---

## Using Real GitHub Data

### Step 1: Create GitHub Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name: `copilot-dashboard`
4. **Select these scopes:**
   - ✅ `copilot`
   - ✅ `manage_billing:copilot`
   - ✅ `read:org`
   - ✅ `read:enterprise`
5. Click **"Generate token"**
6. **Copy the token** (only shown once!)

### Step 2: Add Token to `.env.local`

```env
NUXT_SESSION_PASSWORD=copilot-dashboard-session-key-auto-generated-at-startup-2026
NUXT_PUBLIC_GITHUB_ORG=your-organization-name
NUXT_GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuv
NUXT_PUBLIC_IS_DATA_MOCKED=false
NUXT_PUBLIC_SCOPE=organization
```

### Step 3: Restart Dashboard

```bash
# Kill existing process
taskkill /F /IM node.exe

# Wait
Start-Sleep -Seconds 2

# Run again
.\start-dashboard.bat
```

### Step 4: View Organization Metrics

Dashboard now shows:
- 📈 **Metrics** - Real Copilot usage from your org
- 👥 **Seats** - Team member activity
- 💬 **Chat Metrics** - Chat usage stats
- 📊 **Trends** - Usage patterns over time

---

## Viewing Local Copilot Data

Dashboard can display your local Copilot prompts and responses from:

✅ **Visual Studio Code**
- Location: `%APPDATA%\Code\User\workspaceStorage\`

✅ **VS Code Insider**
- Location: `%APPDATA%\Code - Insiders\User\workspaceStorage\`

✅ **Cursor**
- Location: `%APPDATA%\Cursor\User\workspaceStorage\`

✅ **Other IDEs**
- GitHub CLI
- Visual Studio
- JetBrains IDEs
- MySQL Workbench

### How It Works:

1. Dashboard scans your local IDE folders
2. Finds Copilot chat session files
3. Displays prompts and responses (local only, no cloud upload)

### Privacy:

🔒 **All local data stays on your computer**
- Not uploaded to cloud
- Not shared with GitHub
- Only used for local display

---

## Dashboard Features

### 📊 Metrics Dashboard
- Total Copilot usage
- Acceptance rates
- Language breakdown
- Time-based trends

### 👥 Seats Analysis
- Active team members
- Usage per seat
- Activity trends
- Engagement metrics

### 💬 Chat Metrics
- Copilot Chat sessions
- Message counts
- Response times
- Usage patterns

### 📅 Advanced Filtering
- Date range selection
- Exclude holidays
- Custom time periods
- Export capabilities

### 📁 Local Prompts
- IDE detection
- Chat history
- Prompt/response view
- Local-only display

---

## Troubleshooting

### Issue: "Password string too short"

**Cause**: `NUXT_SESSION_PASSWORD` is less than 32 characters

**Solution**:
```env
# Set a proper 32+ character password
NUXT_SESSION_PASSWORD=copilot-dashboard-session-key-auto-generated-at-startup-2026
```

Or leave empty to auto-generate:
```env
# Auto-generates on startup
NUXT_SESSION_PASSWORD=
```

---

### Issue: "Cannot find .output folder"

**Cause**: `.output.zip` not extracted

**Solution**:
```powershell
Expand-Archive -Path .output.zip -DestinationPath . -Force
```

Or use Windows Explorer:
1. Right-click `.output.zip`
2. Select "Extract All..."
3. Extract to current folder

---

### Issue: "Node.js not found"

**Cause**: Node.js not installed or not in PATH

**Solution**:
1. Download Node.js 20+: https://nodejs.org/
2. Install (default settings)
3. Restart terminal
4. Run `start-dashboard.bat` again

**Verify installation**:
```bash
node --version  # Should show v20.x.x or higher
```

---

### Issue: "Port 3000 already in use"

**Cause**: Another application using port 3000

**Solution**:
```powershell
# Kill Node.js processes
taskkill /F /IM node.exe

# Wait 2 seconds
Start-Sleep -Seconds 2

# Run dashboard again
.\start-dashboard.bat
```

Or use different port:
```batch
set PORT=3001
node .output\server\index.mjs
```

Then access: `http://localhost:3001`

---

### Issue: "GitHub token invalid or expired"

**Cause**: Token is invalid, expired, or lacks scopes

**Solution**:
1. Go to: https://github.com/settings/tokens
2. Check token exists and hasn't expired
3. Verify scopes include: copilot, manage_billing:copilot, read:org
4. If expired, delete and create new one
5. Update `.env.local` with new token
6. Restart dashboard

---

### Issue: "Using mock data instead of real data"

**Cause**: Real data not configured

**Solution**:
1. Verify `NUXT_PUBLIC_IS_DATA_MOCKED=false` in `.env.local`
2. Verify `NUXT_GITHUB_TOKEN` is set with valid token
3. Verify `NUXT_PUBLIC_GITHUB_ORG` is your actual organization
4. Restart dashboard: `taskkill /F /IM node.exe && start-dashboard.bat`

---

### Issue: "Organization not found"

**Cause**: Wrong organization name or no access

**Solution**:
1. Check `NUXT_PUBLIC_GITHUB_ORG` is correct
   - Go to: https://github.com/orgs/
   - Find your org name exactly as shown
2. Verify token has `read:org` scope
3. Verify you have access to the organization
4. Try with different account if needed

---

## File Structure

```
github-copilot-dashboard-release/
│
├── 📦 .output/                    # Pre-built Nuxt server
│   ├── server/                    # Node.js server executable
│   │   └── index.mjs             # Main server file
│   └── public/                    # Frontend assets
│
├── 📦 .output.zip                 # Compressed pre-built files
│
├── 🚀 start-dashboard.bat         # Windows launcher (batch)
├── 🚀 start-dashboard.ps1         # PowerShell launcher
│
├── ⚙️ .env.local                  # Your configuration (git-ignored)
├── ⚙️ .env.local.example          # Configuration template
│
├── 📖 README.md                   # Project overview
├── 📖 QUICK_START.md              # 5-minute setup
├── 📖 INSTALLATION_GUIDE.md       # Detailed guide (this file)
├── 📖 GITHUB_SETUP.md             # Token creation guide
│
└── 📋 package.json                # Project metadata
```

---

## Advanced Usage

### Running on Different Port

Edit `start-dashboard.bat`:
```batch
set PORT=3001
```

Then access: `http://localhost:3001`

### Using Environment Variables

```powershell
# Set variables before running
$env:NUXT_GITHUB_TOKEN = "ghp_..."
$env:NUXT_PUBLIC_GITHUB_ORG = "my-org"

# Run dashboard
.\start-dashboard.bat
```

### Docker Deployment

See [README.md](README.md) for Docker instructions.

---

## Security Notes

### Keep These Secret:
- ❌ Never commit `.env.local` to git
- ❌ Never share `NUXT_GITHUB_TOKEN`
- ❌ Never share `NUXT_SESSION_PASSWORD`
- ❌ Never paste tokens in chat/email

### File Protection:
```bash
# .env.local is already in .gitignore
# This prevents accidental commits
```

### Token Rotation:
- ✅ Rotate tokens monthly
- ✅ Set expiration dates (90 days)
- ✅ Use minimal required scopes
- ✅ Revoke old tokens

---

## What's Next?

1. ✅ Clone repository
2. ✅ Extract `.output.zip`
3. ✅ Create `.env.local` with your credentials
4. ✅ Run `start-dashboard.bat`
5. ✅ Visit http://localhost:3000
6. ✅ View your GitHub Copilot metrics!

---

## Support

- 📖 **Documentation**: See README.md
- 🐛 **Issues**: https://github.com/ahsancloudcode/github-copilot-dashboard-release/issues
- 💬 **Questions**: Create an issue on GitHub
- 📧 **Email**: See GitHub profile

---

## Version Info

- **Release Version**: 2.0.11
- **Nuxt Version**: 3.x
- **Node.js Requirement**: 20+
- **Status**: Production Ready ✅

---

**Happy Monitoring! 🎉**

Last updated: January 31, 2026
