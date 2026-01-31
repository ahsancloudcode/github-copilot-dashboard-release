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

### Step 3: Generate Configuration (Auto)
**Best Method - Automatic Setup:**

**Windows:**
```powershell
# PowerShell (Recommended)
.\setup.ps1

# OR Command Prompt
setup.bat
```

**Linux/Mac:**
```bash
# Coming soon - For now, use manual method below
```

**What this does:**
- ✅ Generates secure random password
- ✅ Creates .env-copy automatically
- ✅ Ready to run!

---

### Alternative: Manual Configuration
```bash
# Copy template
cp .env-copy.example .env-copy

# Edit and add password (REQUIRED - must be 32+ characters)
# Change this: NUXT_SESSION_PASSWORD=
# To:         NUXT_SESSION_PASSWORD=YourRandomPasswordHere123456789
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Run Dashboard
```bash
npm run dev
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
