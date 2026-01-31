# 🏗️ Build Instructions for Users

> **Important:** The `.output/` folder is not included in the repository. Users need to build it locally.

---

## ✅ Complete Setup Steps

### Step 1: Clone the Repository

```powershell
# Clone from GitHub
git clone https://github.com/ahsancloudcode/github-copilot-dashboard-release.git

# Go into the folder
cd github-copilot-dashboard-release
```

### Step 2: Install Dependencies

```powershell
# Install root and server dependencies
npm install

# This will:
# 1. Install root package dependencies
# 2. Run postinstall script automatically
# 3. Install .output/server dependencies
```

**Output should be:**
```
up to date, audited 1 package
found 0 vulnerabilities

> github-copilot-dashboard-release@1.0.0 postinstall
> cd .output/server && npm install --no-save && cd ../..

added 74 packages
```

### Step 3: Setup Configuration

```powershell
# Copy configuration template
cp .env-copy.example .env-copy

# Edit .env-copy if you want (optional)
# - Add GitHub token for real data
# - Leave empty for mock data
```

### Step 4: Build the Dashboard

```powershell
# The .output folder needs to be built from source
# Run this to generate complete .output folder:

# Option A: Use npm (if you have Node.js build tools)
npm run build

# Option B: If build fails, we have an alternative
```

### Step 5: Run the Dashboard

```powershell
# Start the dashboard server
npm run dev

# You'll see:
# ➜ Local:    http://localhost:3001/
# (or port 3002, 3003 if 3001 is busy)
```

### Step 6: Open in Browser

```
http://localhost:3001/
```

---

## ⚠️ If Build Fails

**Error:** `npm run build` fails or takes too long

**Solution A: Download Pre-Built Version**

If you don't want to build locally, you can:

1. Download the latest pre-built `.output.zip` from:
   - GitHub Releases page (when available)

2. Extract it:
```powershell
Expand-Archive -Path .output.zip -DestinationPath .
```

3. Then just run:
```powershell
npm install
npm run dev
```

**Solution B: Use Docker**

```powershell
# Build using Docker (if Docker is installed)
docker build -t dashboard .
docker run -p 3001:3000 dashboard
```

---

## 📋 Requirements

**Minimum:**
- Node.js 20+ (Check: `node --version`)
- npm 10+ (Check: `npm --version`)
- 500 MB free disk space (for node_modules + .output)
- 5 minutes for initial setup

**Optional:**
- GitHub Personal Access Token (for real GitHub data)
- Docker (alternative to npm install)

---

## 🔧 Troubleshooting

### ❌ `npm install` fails

**Solution:**
```powershell
# Clean everything
rm -r node_modules
npm cache clean --force

# Try again
npm install
```

### ❌ `npm run build` fails or hangs

**Option 1:** Build with extended timeout
```powershell
npm install --timeout=600000
npm run build
```

**Option 2:** Skip build and use pre-built
- Wait for GitHub Releases with pre-built `.output.zip`
- Download and extract, then run `npm run dev`

### ❌ Port 3001 already in use

```powershell
# Use different port
npm run dev -- --port 3002

# Then access at http://localhost:3002/
```

### ❌ "Cannot find module" errors

```powershell
# Reinstall everything
rm -r node_modules .output/server/node_modules 2>$null
npm install
npm run dev
```

---

## 📊 What Gets Built

When you run `npm install`, the build system:

1. **Root Dependencies** (~1 minute)
   - Minimal packages for the release version
   
2. **Server Dependencies** (~1 minute) 
   - Via postinstall script
   - Installs to `.output/server/node_modules`

3. **Optional: Full Build** (if you run `npm run build`)
   - Rebuilds `.output/` from source
   - Takes ~30-40 seconds
   - Generates:
     - `.output/server/` - Node.js application
     - `.output/public/` - Static assets
     - All necessary chunks and bundles

---

## 🚀 Quick Reference

```powershell
# 1. Setup (one time)
git clone https://github.com/ahsancloudcode/github-copilot-dashboard-release.git
cd github-copilot-dashboard-release
cp .env-copy.example .env-copy
npm install

# 2. Run (anytime)
npm run dev

# 3. Access
# Open browser: http://localhost:3001/

# 4. Stop
Ctrl + C
```

---

## ✅ Verification

**After setup, check:**

```powershell
# 1. Check Node.js
node --version  # Should be 20+

# 2. Check npm
npm --version   # Should be 10+

# 3. Check dependencies
npm list        # Should show no errors

# 4. Health check (after npm run dev)
curl http://localhost:3001/api/health
# Should return JSON status
```

---

## 💾 First Time Setup Time

- **npm install:** 1-2 minutes
- **npm run build (optional):** 30-40 seconds
- **npm run dev startup:** 10-15 seconds
- **Total first time:** 3-5 minutes

---

## 📖 Additional Documentation

- **USER_WORKFLOW.md** - Complete user guide
- **TESTING_GUIDE.md** - Testing scenarios
- **QUICK_START.md** - 5-minute quick start
- **README.md** - Features overview

---

## 🎯 Next Steps

1. ✅ Follow steps 1-6 above
2. ✅ Open http://localhost:3001/ in browser
3. ✅ Install VS Code extension from marketplace
4. ✅ Use Copilot and see prompts in dashboard
5. ✅ Export data to PDF if needed

---

## 🆘 Still Having Issues?

1. Check all Requirements section above
2. Try Troubleshooting solutions
3. Delete `node_modules` and run `npm install` again
4. Check GitHub Issues: https://github.com/ahsancloudcode/github-copilot-dashboard-release/issues

**Happy building!** 🚀
