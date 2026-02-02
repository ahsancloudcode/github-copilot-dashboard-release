# GitHub Copilot Metrics Viewer - Setup Guide

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure .env
Copy `.env.example` to `.env` and add your GitHub details:

```bash
cp .env.example .env
```

Edit `.env` and update:
```env
NUXT_PUBLIC_GITHUB_ORG=your-organization-name
NUXT_GITHUB_TOKEN=ghp_your_github_token_here
```

### Step 3: Run
```bash
npm run dev
```

Open: http://localhost:3000

---

## 🔑 How to Get GitHub Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select these scopes:
   - `copilot`
   - `manage_billing:copilot`
   - `read:enterprise`
   - `read:org`
4. Click "Generate token"
5. Copy and paste in `.env` as `NUXT_GITHUB_TOKEN`

---

## 📋 Configuration Options

| Variable | Description | Required |
|----------|-------------|----------|
| `NUXT_PUBLIC_GITHUB_ORG` | Your GitHub organization | Yes (if organization scope) |
| `NUXT_GITHUB_TOKEN` | Your GitHub personal access token | Yes (for real data) |
| `NUXT_PUBLIC_SCOPE` | 'organization' or 'enterprise' | No (default: organization) |
| `NUXT_SESSION_PASSWORD` | Session encryption (production only) | No (dev only) |

---

## ✨ Done!

Your dashboard is now running with your actual GitHub Copilot metrics!

---

## 🆘 Troubleshooting

**Q: Blank page showing?**  
A: Check if token is valid and `.env` has correct values

**Q: "No Authentication provided"?**  
A: Make sure `NUXT_GITHUB_TOKEN` is set in `.env`

**Q: Port 3000 already in use?**  
A: Run `PORT=3001 npm run dev`

---

For more details, see `.env.example` for all configuration options.
