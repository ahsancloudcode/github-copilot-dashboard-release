# GitHub Copilot Prompts Dashboard - Public Release

> **View and manage all your GitHub Copilot prompts in one place** 📊

This is the **ready-to-run version** of the GitHub Copilot Prompts Dashboard.

---

## 🚀 Quick Start (5 minutes)

### ⚠️ Important: Build Required (First Time Only)

The `.output/` folder is **not included** in the repository. You need to build it locally:

### Step 1: Clone this Repository
```bash
git clone https://github.com/ahsancloudcode/github-copilot-dashboard-release.git
cd github-copilot-dashboard-release
```

### Step 2: Install Dependencies
```bash
# This will install both root and server dependencies
# Takes ~2 minutes on first install
npm install
```

The postinstall script will automatically:
- Install `.output/server` dependencies
- Prepare everything for running

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
