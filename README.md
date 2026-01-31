# GitHub Copilot Prompts Dashboard - Public Release

> **View and manage all your GitHub Copilot prompts in one place** 📊

This is the **ready-to-run version** of the GitHub Copilot Prompts Dashboard.

---

## 🚀 Quick Start (5 minutes)

### Step 1: Clone & Extract
```bash
git clone https://github.com/ahsancloudcode/github-copilot-dashboard-release.git
cd github-copilot-dashboard-release

# Extract pre-built application (Windows)
Expand-Archive -Path .output.zip -DestinationPath . -Force

# OR Extract (Linux/Mac)
unzip -o .output.zip
```

### Step 2: Generate Configuration ⭐ **IMPORTANT**

**Windows - Auto Setup (Recommended):**
```powershell
.\setup.ps1
```

**Manual Setup (All platforms):**
```bash
cp .env-copy.example .env-copy

# ⚠️ MUST EDIT: Open .env-copy and set a password
# Change: NUXT_SESSION_PASSWORD=
# To:     NUXT_SESSION_PASSWORD=YourRandomPassword123456789
```

### Step 3: Install & Run
```bash
npm install
npm run dev
```

**Dashboard opens at:** http://localhost:3001

### Step 3: Setup Your Configuration (Optional)
```bash
# Create your local configuration file
cp .env-copy.example .env-copy
```

**Edit `.env-copy` to add (optional):**
- `NUXT_GITHUB_TOKEN` - Get from https://github.com/settings/tokens
- `NUXT_PUBLIC_GITHUB_ORG` - Your GitHub organization name

### Step 4: Run the Dashboard
```bash
npm run dev
```

**Dashboard opens at:** http://localhost:3001

---

## 📖 Detailed Setup

**For complete build instructions and troubleshooting, see:**
- [BUILD_INSTRUCTIONS.md](./BUILD_INSTRUCTIONS.md) - Detailed setup guide
- [QUICK_START.md](./QUICK_START.md) - 5-minute quick reference  
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing scenarios
- [USER_WORKFLOW.md](./USER_WORKFLOW.md) - Complete workflow

---

## 📋 What You Get

### Features:
✅ View your collected Copilot prompts (from VS Code extension)  
✅ Search & filter through all conversations  
✅ View GitHub Copilot metrics (if GitHub token provided)  
✅ Statistics & analytics  
✅ Export data to PDF  
✅ Real-time updates  
✅ Completely private (runs locally)  

### Prerequisites:
- Node.js 20+ ([Download](https://nodejs.org/))
- Git
- GitHub account (optional, for metrics)

---

## 📖 Full Documentation

| Guide | Description |
|-------|-------------|
| [QUICK_START.md](./QUICK_START.md) | 30-second quick reference |
| [GITHUB_SETUP.md](./GITHUB_SETUP.md) | How to create public repo on GitHub |

---

## ⚙️ Configuration

### Required
- `NUXT_SESSION_PASSWORD` - Random 32+ character string for security

### Optional
- `NUXT_GITHUB_TOKEN` - GitHub Personal Access Token
  - Get it: https://github.com/settings/tokens
  - Scopes needed: `repo`, `read:org`, `read:enterprise`, `manage_billing:copilot`
- `NUXT_PUBLIC_SCOPE` - `organization` (default) or `enterprise`
- `NUXT_PUBLIC_GITHUB_ORG` - Your organization name
- `NUXT_PUBLIC_IS_DATA_MOCKED` - `false` (default) for real data, `true` for demo

See `.env.example` for detailed comments.

---

## 🔒 Security

✅ **No credentials in this repository** - `.env-copy` is ignored by git  
✅ **Configuration is local only** - Your credentials never leave your machine  
✅ **Open source** - You can review the source code anytime  
✅ **No data collection** - Everything stays on your computer  

**⚠️ Important:**
- Never commit your `.env-copy` file
- Keep your GitHub token private
- `.env-copy` is already in `.gitignore` for protection

---

## 📦 Pre-Built & Ready

This folder contains a **pre-compiled, production-ready** dashboard. No build step needed!

```
.output/
├── server/        (Node.js server)
├── public/        (Static files)
└── package.json   (Dependencies)
```

Just `npm install` → `npm run dev` → Done! ✅

---

## 🎯 Next Steps

1. **Fill in `.env-copy`** with your credentials
2. **Run `npm install`** (first time only)
3. **Run `npm run dev`** to start the dashboard
4. **Open http://localhost:3000** in your browser
5. **Click "Local Prompts"** tab to see your collected prompts

---

## 🤝 Related

- **VS Code Extension:** [GitHub Copilot Prompts](https://marketplace.visualstudio.com/items?itemName=ahsansaeed.github-copilot-prompts)
  - Auto-collects your Copilot prompts daily
  - Saves to: `~/.asaeed/copilotprompts/`
  - Supported IDEs: VS Code, Cursor, JetBrains, SSMS, MySQL Workbench

---

## 🆘 Troubleshooting

### 500 Server Error / API errors
```
Error: [GET] "/api/seats?scope=organization": 500 Server Error
```

**Solution:**
1. Make sure `NUXT_PUBLIC_IS_DATA_MOCKED=true` in `.env-copy` (default)
2. Dashboard should work fine with mock/demo data
3. Only set to `false` if you have a valid GitHub token:
   ```env
   NUXT_PUBLIC_IS_DATA_MOCKED=false
   NUXT_GITHUB_TOKEN=ghp_your_valid_token
   NUXT_PUBLIC_GITHUB_ORG=your_org_name
   ```

### Dashboard shows "Loading..."
```bash
# Clear cache and restart
npm run build && npm run dev
```

### npm install fails
```bash
# Clear node_modules and try again
rm -r node_modules
npm install
```

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm run dev
```

---

## 📄 License

See LICENSE file in this repository.

---

## 👤 Author

**Ahsan Saeed**  
- GitHub: [@ahsancloudcode](https://github.com/ahsancloudcode)

---

**Ready to get started?** 👉 [See QUICK_START.md](./QUICK_START.md)

Happy coding! 🚀
