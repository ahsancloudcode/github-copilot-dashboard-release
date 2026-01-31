# 🎯 GitHub Copilot Dashboard - Standalone Release

**Your Professional GitHub Copilot Metrics Viewer**

[![GitHub Release](https://img.shields.io/github/v/release/ahsancloudcode/github-copilot-dashboard-release)](https://github.com/ahsancloudcode/github-copilot-dashboard-release/releases)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.txt)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-brightgreen.svg)]()

---

## 🚀 Quick Start (3 Steps)

```bash
# 1. Clone release
git clone https://github.com/ahsancloudcode/github-copilot-dashboard-release.git
cd github-copilot-dashboard-release

# 2. Extract server & add your credentials
Expand-Archive -Path .output.zip -DestinationPath . -Force
# Create .env.local with your GitHub token (see guide below)

# 3. Run dashboard
.\start-dashboard.bat
# Opens http://localhost:3000 automatically
```

---

## 📊 What You Can See

### GitHub Copilot Metrics
- 📈 **Overall Usage** - Total Copilot usage in your organization
- 👥 **Seats Analysis** - Which team members use Copilot and how often
- 💬 **Chat Metrics** - GitHub Copilot Chat usage and engagement
- 📅 **Time Trends** - Usage patterns and trends over time
- 🗣️ **Language Breakdown** - Which programming languages use Copilot
- 📝 **Detailed Analytics** - Acceptance rates, suggestions per user, etc.

### Local Copilot History
- 💭 **IDE Integration** - View your local Copilot prompts and responses
- 🔍 **Chat History** - See all your Copilot chat sessions
- 🛠️ **IDE Support** - Works with VS Code, Cursor, GitHub CLI, and more
- 🔒 **Privacy First** - All local data stays on your computer

---

## ✅ What You Get

### Pre-built & Ready to Run
- ✅ **No Compilation** - Pre-built Nuxt server included
- ✅ **No npm Install** - All dependencies packaged
- ✅ **One-Click Startup** - Batch file launcher
- ✅ **Auto Configuration** - Session password auto-generated

### Professional Features
- ✅ **Real GitHub Data** - See your actual organization metrics
- ✅ **Mock Data Mode** - Test without credentials
- ✅ **Multiple Scopes** - Organization, Enterprise, Teams
- ✅ **Date Filtering** - Analyze trends over time
- ✅ **Local IDE Sync** - View your copilot history

### Complete Documentation
- ✅ **Setup Guide** - Step-by-step installation
- ✅ **Token Guide** - GitHub token creation walkthrough
- ✅ **Troubleshooting** - Solutions for common issues
- ✅ **Examples** - Configuration examples for all scenarios

---

## 📋 Requirements

### System
- Windows 10+, macOS, or Linux
- Node.js 20+ ([Download](https://nodejs.org/))
- ~2GB free disk space (for extracted .output)

### GitHub
- GitHub organization (or enterprise/team)
- Personal Access Token with these scopes:
  - `copilot`
  - `manage_billing:copilot`
  - `read:org`
  - `read:enterprise` (if applicable)

---

## 🔐 Getting Your GitHub Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name: `copilot-dashboard`
4. Select the scopes listed above
5. Click **"Generate token"**
6. Copy the token (only shown once!)
7. Paste into `.env.local` file

**Detailed guide**: See [GITHUB_SETUP.md](GITHUB_SETUP.md)

---

## 📖 Full Documentation

| Guide | Purpose |
|-------|---------|
| [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md) | Comprehensive installation guide with all options |
| [QUICK_START.md](QUICK_START.md) | 5-minute quick start for experienced users |
| [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) | Detailed step-by-step setup instructions |
| [GITHUB_SETUP.md](GITHUB_SETUP.md) | GitHub token creation and configuration |
| [RELEASE_NOTES_v2.0.11.md](RELEASE_NOTES_v2.0.11.md) | Version details and what's included |

---

## 🎯 Use Cases

### 👔 Engineering Managers
Monitor team Copilot adoption and usage patterns across your organization.

### 👨‍💻 Individual Contributors
See your own Copilot chat history and usage statistics.

### 🏢 Enterprise Administrators
Track Copilot usage across multiple organizations and teams.

### 📊 Data Analysts
Export metrics and analyze Copilot adoption trends.

---

## 🌟 Features

- 📱 **Responsive Design** - Works on desktop and mobile
- 🌙 **Dark Mode** - Easy on the eyes
- 📤 **Export Data** - Download metrics as CSV
- 🔄 **Real-time** - Updated metrics from GitHub
- 🔒 **Secure** - Your credentials stay local
- ⚡ **Fast** - Optimized for performance
- 🌍 **Multi-language** - IDE support worldwide
- 📈 **Professional Charts** - Beautiful data visualization

---

## 🛠️ Configuration

### Minimal Setup
```env
NUXT_SESSION_PASSWORD=copilot-dashboard-session-key-auto-generated-at-startup-2026
NUXT_PUBLIC_GITHUB_ORG=your-organization-name
NUXT_GITHUB_TOKEN=ghp_your_token_here
NUXT_PUBLIC_IS_DATA_MOCKED=false
NUXT_PUBLIC_SCOPE=organization
```

### Testing (No Token Needed)
```env
NUXT_SESSION_PASSWORD=copilot-dashboard-session-key-auto-generated-at-startup-2026
NUXT_PUBLIC_GITHUB_ORG=demo-org
NUXT_PUBLIC_IS_DATA_MOCKED=true
NUXT_PUBLIC_SCOPE=organization
```

### Enterprise Setup
```env
NUXT_SESSION_PASSWORD=copilot-dashboard-session-key-auto-generated-at-startup-2026
NUXT_PUBLIC_GITHUB_ENT=your-enterprise-name
NUXT_GITHUB_TOKEN=ghp_your_token_here
NUXT_PUBLIC_IS_DATA_MOCKED=false
NUXT_PUBLIC_SCOPE=enterprise
```

**Full configuration guide**: See [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)

---

## ❓ Troubleshooting

### Common Issues

**"Password too short"**
```
✅ Solution: Password must be 32+ characters
✅ Or leave empty to auto-generate
```

**"Port 3000 already in use"**
```
✅ Solution: taskkill /F /IM node.exe
✅ Then run start-dashboard.bat again
```

**"Cannot find .output folder"**
```
✅ Solution: Expand-Archive -Path .output.zip -DestinationPath . -Force
```

**"Invalid GitHub token"**
```
✅ Solution: Check at https://github.com/settings/tokens
✅ Verify token hasn't expired
✅ Confirm scopes are correct
```

**See [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md) for more troubleshooting**

---

## 📦 What's Included

```
github-copilot-dashboard-release/
├── .output/                      # Pre-built Nuxt server
├── .output.zip                   # Compressed server (for distribution)
├── start-dashboard.bat           # Windows launcher
├── start-dashboard.ps1           # PowerShell launcher
├── .env.local.example           # Configuration template
├── README.md                     # This file
├── COMPLETE_SETUP_GUIDE.md      # Full installation guide
├── INSTALLATION_GUIDE.md         # Step-by-step guide
├── QUICK_START.md               # 5-minute setup
├── GITHUB_SETUP.md              # Token setup guide
├── RELEASE_NOTES_v2.0.11.md     # Version info
└── package.json                 # Project metadata
```

---

## 🔄 Version Information

- **Current Version**: 2.0.11
- **Release Date**: January 31, 2026
- **Status**: Production Ready ✅
- **Node.js Required**: 20+
- **Framework**: Nuxt 3
- **License**: MIT

---

## 📞 Support & Community

### Documentation
- 📖 [Complete Setup Guide](COMPLETE_SETUP_GUIDE.md)
- 🚀 [Quick Start](QUICK_START.md)
- 🔐 [GitHub Token Setup](GITHUB_SETUP.md)

### Issues & Feedback
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/ahsancloudcode/github-copilot-dashboard-release/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/ahsancloudcode/github-copilot-dashboard-release/discussions)
- 📧 **Contact**: See GitHub profile

---

## 🔐 Security

### Your Data is Safe
- ✅ Credentials stored locally in `.env.local` (git-ignored)
- ✅ GitHub token never exposed in logs
- ✅ Session encrypted with 32+ character password
- ✅ Local copilot data stays on your computer
- ✅ No data uploaded or shared

### Best Practices
- 🔄 Rotate tokens every 90 days
- 🔒 Use minimal required scopes
- ❌ Never commit `.env.local` to git
- 🚫 Never share tokens or passwords

---

## 📄 License

MIT License - See [LICENSE.txt](LICENSE.txt)

---

## 🎉 Getting Started

**Ready to monitor your Copilot metrics?**

1. Clone this repository
2. Extract the `.output.zip` file
3. Create `.env.local` with your GitHub token
4. Run `start-dashboard.bat`
5. Visit http://localhost:3000

**Need help?** See [QUICK_START.md](QUICK_START.md) or [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)

---

## 👨‍💼 About This Project

GitHub Copilot Dashboard is a professional metrics viewer that helps organizations understand and monitor their GitHub Copilot usage. Built with modern web technologies, it provides real-time insights into your team's AI-assisted development.

**Features**:
- Real GitHub API integration
- Beautiful, responsive UI
- Local IDE copilot history
- Time-based analytics
- Multi-scope support (org, enterprise, team)
- Export capabilities

---

## 🙏 Credits

Built with:
- ⚡ **Nuxt 3** - Vue.js framework
- 📊 **Chart.js** - Data visualization
- 🎨 **Vuetify** - Material Design
- 🔵 **GitHub API** - Data source

---

**Happy Monitoring! 🚀**

Last updated: January 31, 2026

---

### Quick Links

- 🌐 [GitHub Repository](https://github.com/ahsancloudcode/github-copilot-dashboard-release)
- 📝 [Documentation](COMPLETE_SETUP_GUIDE.md)
- 🔧 [GitHub Token Guide](GITHUB_SETUP.md)
- 📦 [Releases](https://github.com/ahsancloudcode/github-copilot-dashboard-release/releases)
