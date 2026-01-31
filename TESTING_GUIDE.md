# 🚀 Complete Testing Guide - Extension + Dashboard

> **Latest Build:** Published to GitHub on Jan 31, 2026

---

## 📋 Quick Summary

You now have:
1. **VS Code Extension** - Auto-collects your Copilot prompts
   - 📍 Marketplace: https://marketplace.visualstudio.com/items?itemName=ahsansaeed.github-copilot-prompts
   
2. **Dashboard** - Beautiful web interface to view prompts
   - 📍 GitHub Release: https://github.com/ahsancloudcode/github-copilot-dashboard-release

---

## 🎯 Step-by-Step Testing (5 Minutes)

### Step 1️⃣: Install Extension from Marketplace

**In VS Code:**
```
Ctrl + Shift + X  (Extensions panel)
```

Search: `GitHub Copilot Prompts`

Click **Install** (by ahsansaeed)

✅ Extension will appear in sidebar as **"Copilot Prompts"** tab

---

### Step 2️⃣: Clone Dashboard from GitHub

**In Terminal/PowerShell:**

```powershell
# Go to your projects folder
cd C:\Users\YourUsername\Documents

# Clone the dashboard
git clone https://github.com/ahsancloudcode/github-copilot-dashboard-release.git

# Go into dashboard folder
cd github-copilot-dashboard-release
```

---

### Step 3️⃣: Setup Dashboard Configuration

**Create config file:**

```powershell
# Copy example config
cp .env-copy.example .env-copy
```

**Open `.env-copy` and optionally add GitHub token:**
- Leave empty to use mock data (testing)
- Or add your GitHub Personal Access Token (optional)

---

### Step 4️⃣: Install Dependencies & Run

```powershell
# Install dependencies (takes ~1 minute)
npm install

# Start dashboard (takes ~10 seconds)
npm run dev
```

**You'll see:**
```
✔ Vite client built
✔ Vite server built  
✔ Nuxt Nitro server built

➜ Local:    http://localhost:3001/
```

---

### Step 5️⃣: Open Dashboard in Browser

```
http://localhost:3001/
```

🎉 Dashboard is now running!

---

## 📊 What You'll See

### Main Tabs:
1. **Chat History** - All your Copilot interactions
2. **Language Breakdown** - Code distribution by language
3. **Seat Analysis** - Usage patterns (if GitHub token added)
4. **Chat Metrics** - Statistics and charts

### Local Prompts:
Click the **"Local Prompts"** button to see prompts collected from your VS Code extension:
- Real-time tracking
- Search & filter
- Export to PDF

---

## 🔌 How It Works

```
┌──────────────────┐
│   VS Code        │
│  (Your Editor)   │
│                  │
│  Extension →     │ Auto-saves prompts
│  Collects        │
└────────┬─────────┘
         │
         ↓ Saves to
┌────────────────────────┐
│ ~/.asaeed/copilotprompts │
│ (Local folder on your PC) │
└────────┬─────────────────┘
         │
         ↓ Dashboard reads
┌────────────────────────┐
│ http://localhost:3001  │
│ (Beautiful Interface)  │
└────────────────────────┘
```

**Key Point:** Everything stays local. No cloud upload. Your data is private.

---

## ⚙️ Configuration Options

### Minimal Setup (Testing):
No config needed - just run `npm run dev`

### With GitHub Data:
Edit `.env-copy`:

```env
NUXT_SESSION_PASSWORD=your-secret-password-32-chars-or-more

# Optional: Add GitHub token to see metrics
NUXT_GITHUB_TOKEN=ghp_your_personal_access_token_here

# Optional: Organization to fetch data from
NUXT_PUBLIC_SCOPE=organization
NUXT_PUBLIC_GITHUB_ORG=your-org-name
```

**To generate GitHub token:**
1. GitHub → Settings → Developer settings → Personal access tokens
2. Create new token with scopes: `copilot`, `manage_billing:copilot`, `read:org`
3. Copy token to `.env-copy`

---

## 🛠️ Troubleshooting

### ❌ Extension not showing prompts?

```powershell
# Reload extension in VS Code
Ctrl + Shift + P → "Reload Window"

# Write some code and use Copilot
# Wait 2-3 seconds for auto-save
```

### ❌ Dashboard won't start?

```powershell
# Make sure you're in the dashboard folder
cd github-copilot-dashboard-release

# Clean install
rm -r node_modules
npm install

# Run again
npm run dev
```

### ❌ Port 3001 already in use?

```powershell
# Use different port
npm run dev -- --port 3002

# Then access at http://localhost:3002/
```

### ❌ "Cannot find module" errors?

```powershell
# Make sure postinstall ran
npm list date-holidays

# If missing, reinstall
npm install
```

---

## ✅ Verification Checklist

- [ ] Extension installed from marketplace
- [ ] Dashboard cloned from GitHub
- [ ] `npm install` completed without errors
- [ ] `npm run dev` shows success message
- [ ] Browser opens to http://localhost:3001/
- [ ] Can see "Local Prompts" section
- [ ] Dashboard displays without errors

---

## 📁 File Structure

After setup, you should have:

```
github-copilot-dashboard-release/
├── .output/              (Pre-built app - 11.3 MB)
├── .env-copy             (Your local config)
├── .env-copy.example     (Template - don't edit)
├── package.json
├── README.md
├── USER_WORKFLOW.md
└── node_modules/         (Dependencies)
```

---

## 🚀 Advanced Usage

### Exporting Prompts to PDF

In dashboard:
1. Go to "Local Prompts"
2. Click **Export** button
3. PDF downloads to your computer

### Searching & Filtering

- Use search bar at top
- Filter by language, date, type
- View statistics and charts

### GitHub Integration

If you add a GitHub token:
- See organization Copilot metrics
- View team usage statistics
- Check seat allocation

---

## 📞 Support

**Issues?**
1. Check troubleshooting section above
2. GitHub Issues: https://github.com/ahsancloudcode/github-copilot-dashboard-release/issues
3. Extension Issues: https://github.com/ahsancloudcode/GitHub-Copilot-Prompts-Viewer/issues

**Questions?**
- See USER_WORKFLOW.md for complete workflow
- See QUICK_START.md for quick reference
- Check README.md for features

---

## 🎓 Testing Scenarios

### Scenario 1: Local Development (No GitHub)
```
✅ Works - Just use extension + dashboard locally
```

### Scenario 2: With GitHub Organization Access
```
✅ Works - Add token, view org metrics + local prompts
```

### Scenario 3: Team/Enterprise
```
✅ Works - Configure NUXT_PUBLIC_GITHUB_ORG in .env-copy
```

---

## 📊 Build Information

**Latest Build:** January 31, 2026
- **Nuxt Version:** 3.19.0
- **Nitro Version:** 2.12.6
- **Node.js Required:** 20+
- **Total Size:** 11.3 MB
- **Dependencies Included:** ✅ Yes

**Status:** ✅ Production Ready

---

## 🔒 Privacy & Security

✅ **Completely Local**
- Extension: Saves to `~/.asaeed/copilotprompts/`
- Dashboard: Runs on localhost
- No cloud sync
- No external API calls (except optional GitHub)
- Your data never leaves your computer

✅ **Git-Protected**
- `.env-copy` never committed
- Credentials protected by `.gitignore`
- Safe to use with sensitive repos

---

## 🎉 You're All Set!

1. Install extension ✅
2. Clone dashboard ✅
3. Run `npm install` ✅
4. Run `npm run dev` ✅
5. Open http://localhost:3001/ ✅

**Happy Testing!** 🚀

---

**Have questions? Need help?**  
All documentation is in the GitHub repo. Check the README and other guides!
