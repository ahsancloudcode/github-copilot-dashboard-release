# GitHub Copilot Dashboard - Release

> 📊 Professional GitHub Copilot metrics and analytics viewer  
> 🚀 Run locally with zero configuration  
> 📁 View your Copilot usage across your organization

---

## 🎯 What is This?

GitHub Copilot Dashboard is a beautiful web application that shows your GitHub Copilot usage metrics and analytics. See:

- 📈 **Metrics Dashboard** - Overall Copilot usage, acceptance rates, language breakdown
- 👥 **Seats Analysis** - Which team members use Copilot, their activity levels
- 💬 **Chat Metrics** - GitHub Copilot Chat usage and performance data
- 📅 **Time-based Analysis** - Usage trends over time with detailed filtering

**Works with:**
- ✅ GitHub Organizations
- ✅ GitHub Enterprises  
- ✅ Teams within Organizations
- ✅ Mock Data (no credentials needed)

---

## ⚡ Quick Start (2 Minutes)

### Option 1: Run with Batch File (Easiest - Windows)

```batch
1. Download and extract this folder
2. Double-click: start-dashboard.bat
3. Dashboard opens in your browser at http://localhost:3000
4. Done! (Uses sample data by default)
```

### Option 2: Run with PowerShell

```powershell
1. Download and extract this folder
2. Right-click start-dashboard.ps1 → Run with PowerShell
3. Dashboard opens at http://localhost:3000
4. Done!
```

### Option 3: Manual Command Line

```bash
# Navigate to this folder
cd path/to/dashboard

# Start the dashboard
node .output/server/index.mjs
```


---

## 🔑 Using Your Real GitHub Data (Optional)

By default, the dashboard shows sample data. To see YOUR organization's actual Copilot metrics:

### Step 1: Get GitHub Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name like `"copilot-metrics"`
4. Select these scopes:
   - ✅ `copilot`
   - ✅ `manage_billing:copilot`
   - ✅ `manage_billing:enterprise`
   - ✅ `read:enterprise`
   - ✅ `read:org`
5. Click **"Generate token"**
6. Copy the entire token (starts with `ghp_`)

### Step 2: Add Token to .env.local

1. Open `.env.local.example` file
2. Rename it to `.env.local`
3. Find this line:
   ```
   # NUXT_GITHUB_TOKEN=your_token_here
   ```
4. Remove the `#` and add your token:
   ```
   NUXT_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
   ```
5. Save the file

### Step 3: Restart Dashboard

1. Close the dashboard (if running)
2. Double-click `start-dashboard.bat` again
3. Dashboard now shows YOUR real Copilot data!

---

## 📁 Files Explained

```
.
├── .output/                    ← Pre-built production server
│   └── server/
│       └── index.mjs           ← Dashboard server (ready to run)
│
├── start-dashboard.bat         ← ⭐ Click this (Windows batch)
├── start-dashboard.ps1         ← Alternative (PowerShell script)
│
├── .env.local.example          ← Configuration template
│                                 (Rename to .env.local to customize)
│
├── README.md                   ← This file
└── QUICK_START.md              ← Quick reference guide
```

---

## 🎯 3 Ways to Use Dashboard

### 1️⃣ **VS Code Extension** (Recommended)

Install the VS Code Extension - dashboard runs automatically inside VS Code!

**Search "GitHub Copilot Prompts" in VS Code extensions**
**Click Install**
**Dashboard available in VS Code**

**Benefits:**
- ✅ Works with your VS Code
- ✅ Zero installation
- ✅ Updates automatically
- ✅ Built-in authentication

[View Extension on Marketplace](https://marketplace.visualstudio.com/items?itemName=ahsansaeed.github-copilot-prompts)

### 2️⃣ **Run Standalone** (This Repository)

Download this folder and run the batch/PowerShell script.

**Benefits:**
- ✅ Works in any browser
- ✅ No VS Code required
- ✅ Full customization
- ✅ Works on any machine with Node.js

**Files you use:**
- `start-dashboard.bat` (double-click)
- Or `start-dashboard.ps1` (right-click → Run with PowerShell)

### 3️⃣ **Source Code** (For Developers)

For development and customization, refer to the main repository documentation.

---

## 🔐 Security & Privacy

- ✅ **Your data stays local** - Dashboard runs on your computer
- ✅ **No cloud storage** - Nothing is uploaded to our servers
- ✅ **Token is safe** - Only used for GitHub API calls
- ✅ **Mock mode available** - Test without any credentials
- ✅ **Open source** - Review the code anytime

**Environment Variables:**
- `.env.local` file is **never** uploaded to GitHub
- It's in `.gitignore` - completely private
- Only you can see it on your machine

---

## 📊 Dashboard Features

### Metrics View
- Total Copilot acceptances and rejections
- Acceptance rate percentage
- Language breakdown (Python, JavaScript, TypeScript, etc.)
- Trends over time

### Seats Analysis
- Team member usage overview
- Active users vs. inactive
- Individual acceptance rates
- Usage patterns per team member

### Chat Metrics
- GitHub Copilot Chat usage
- Chat turns per session
- Response times
- Popular use cases

### Advanced Filtering
- Filter by date range
- Filter by language
- Filter by organization/team
- Custom date pickers

---

## ⚙️ Configuration Options

All configuration goes in `.env.local` file:

```bash
# GitHub API token for real data
NUXT_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# Organization to view
NUXT_PUBLIC_GITHUB_ORG=my-organization

# Enterprise to view  
NUXT_PUBLIC_GITHUB_ENT=my-enterprise

# Team to view
NUXT_PUBLIC_GITHUB_TEAM=my-team

# Default scope (organization/enterprise/team-organization/team-enterprise)
NUXT_PUBLIC_SCOPE=organization
```

---

## 🐛 Troubleshooting

### "Node.js not found" Error

**Problem:** Message says `Node.js is not installed`

**Solution:**
1. Install Node.js: https://nodejs.org (LTS version)
2. Close this window
3. Double-click `start-dashboard.bat` again

### "Port 3000 already in use"

**Problem:** Error says "Port 3000 is already in use"

**Solution:**
1. Another app is using port 3000
2. Option A: Close the other app
3. Option B: Change port in environment (advanced)

### "Build not found" Error

**Problem:** Message says `.output directory not found`

**Solution:**
1. Make sure you extracted the full folder
2. Check that `.output/` folder exists
3. If missing, download the complete release again

### Dashboard loads but no data shows

**Problem:** Page shows "No data" or loading spinner

**Solution 1:** Check if using mock data
- Look in browser console (F12)
- Should say "Using mock data"
- This is normal!

**Solution 2:** Check your token if using real data
- Go to `.env.local` file
- Verify `NUXT_GITHUB_TOKEN` is pasted correctly (no spaces)
- Token should start with `ghp_`
- Save file and restart dashboard

---

## 🔄 Updating

### To get latest version:

1. Download the latest release from GitHub
2. Extract to new folder
3. Copy your `.env.local` file to the new folder
4. Delete old folder
5. Use the new folder

**No data is lost** - Your `.env.local` settings are preserved!

---

## 📚 More Help

- **Quick Reference:** See `QUICK_START.md`
- **Full Documentation:** See docs folder
- **Issues & Questions:** Open an issue on GitHub

---

## 📦 What's Included

This release includes:

- ✅ Pre-built production server (no npm install needed)
- ✅ Complete dashboard application
- ✅ Mock data for testing
- ✅ Configuration templates
- ✅ Setup scripts (batch and PowerShell)
- ✅ Full documentation

**Not included** (intentionally):
- ❌ Source code files (security)
- ❌ Build tools (npm, webpack, etc.)
- ❌ Configuration files (you customize via .env.local)

---

## 🚀 System Requirements

- **Operating System:** Windows 10+, macOS 10.15+, Linux
- **Node.js:** Version 18+ (download from https://nodejs.org)
- **Browser:** Chrome, Firefox, Safari, Edge (any modern browser)
- **Disk Space:** ~500 MB
- **Internet:** Only for GitHub API calls (optional for mock mode)

---

## 📝 License

MIT License - See LICENSE file

---

## 🎉 Support Multiple Ways to Use

Choose what works best for you:

| Method | Ease | Features | Best For |
|--------|------|----------|----------|
| **VS Code Extension** | ⭐⭐⭐⭐⭐ | Full dashboard in VS Code | Day-to-day usage |
| **This Folder (Standalone)** | ⭐⭐⭐⭐ | Dashboard in browser | Team server/sharing |
| **Clone Repository** | ⭐⭐⭐ | Full source code | Customization/development |

---

## ✨ Key Benefits

✅ **Zero Configuration** - Works out of box with sample data  
✅ **One Click** - Double-click `start-dashboard.bat`  
✅ **No Code Needed** - Just run it, no npm/build steps  
✅ **Fully Private** - Runs on your computer  
✅ **Optional GitHub** - Use real data or samples  
✅ **Beautiful UI** - Professional metrics dashboard  
✅ **Fast** - Instant load times  
✅ **No Updates Needed** - This version is complete  

---

**Ready to see your Copilot metrics? Double-click `start-dashboard.bat`!** 🚀

---

**Made with ❤️ for GitHub Copilot users**

**Ready to get started?** 👉 [See QUICK_START.md](./QUICK_START.md)

Happy coding! 🚀
