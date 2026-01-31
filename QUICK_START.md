# 🚀 Quick Start - 5 Minutes

## Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/ahsancloudcode/github-copilot-dashboard-release.git
cd github-copilot-dashboard-release
```

### Step 2: Extract Pre-built Application
```powershell
# Windows PowerShell - Extract the pre-built .output folder
Expand-Archive -Path .output.zip -DestinationPath . -Force
```

**OR Linux/Mac:**
```bash
unzip -o .output.zip
```

### Step 3: Setup Configuration
```bash
# Copy the configuration template
cp .env-copy.example .env-copy

# Edit .env-copy with your values (open in any editor)
# Only required: NUXT_SESSION_PASSWORD
```

**Required Fields:**
- `NUXT_SESSION_PASSWORD` - Any random string (32+ characters)

**Optional Fields:**
- `NUXT_GITHUB_TOKEN` - GitHub token (leave empty to skip)
- `NUXT_PUBLIC_GITHUB_ORG` - Your organization name

### Step 4: Run Dashboard
```bash
npm install    # First time only (1 minute - installs dependencies)
npm run dev    # Starts dashboard (10 seconds)
```

**Dashboard opens at:** http://localhost:3001

---

## What to Expect

✅ Dashboard loads instantly  
✅ Click "Local Prompts" tab to see your collected prompts  
✅ Everything runs locally (private)  
✅ No external data transmission  

---

## Need Help?

```bash
# Check if dashboard is running
curl http://localhost:3000/api/health

# If port 3000 is busy
PORT=3001 npm run dev
```

That's it! Happy coding! 🎉
