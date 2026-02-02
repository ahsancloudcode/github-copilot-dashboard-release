# GitHub Copilot Metrics Viewer - Setup Guide

## ⚡ Quick Start (1 Minute - With Demo Data)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run
```bash
npm run dev
```

### Step 3: View Dashboard
Open: http://localhost:3000

✅ **You'll see demo metrics immediately!** No configuration needed.

---

## 🔄 Switch to Real GitHub Data (Optional)

### Step 1: Get GitHub Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select these scopes:
   - `copilot`
   - `manage_billing:copilot`
   - `read:enterprise`
   - `read:org`
4. Click "Generate token"
5. Copy the token

### Step 2: Update .env

Edit `.env` file and update:

```env
# Your GitHub organization name
NUXT_PUBLIC_GITHUB_ORG=your-organization-name

# Your GitHub token
NUXT_GITHUB_TOKEN=ghp_your_token_here

# Switch from demo to real data
NUXT_PUBLIC_IS_DATA_MOCKED=false
```

### Step 3: Restart Dev Server

```bash
# Stop current dev server (Ctrl+C)
# Then restart:
npm run dev
```

Open: http://localhost:3000

✅ **Now you'll see YOUR actual GitHub Copilot metrics!**

---

## 📋 .env Configuration Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NUXT_PUBLIC_IS_DATA_MOCKED` | Use demo data (true) or real data (false) | `true` or `false` |
| `NUXT_PUBLIC_GITHUB_ORG` | Your GitHub organization | `my-company` |
| `NUXT_GITHUB_TOKEN` | Your GitHub personal access token | `ghp_xxxx...` |
| `NUXT_PUBLIC_SCOPE` | 'organization' or 'enterprise' | `organization` |

---

## ✨ What You'll See

### With Demo Data (Default)
- ✅ Sample metrics
- ✅ Demo seat allocation
- ✅ Example chat statistics
- ✅ All features working
- ✅ **No GitHub account needed**

### With Real GitHub Data
- ✅ Your actual metrics
- ✅ Real seat allocation
- ✅ Real team data
- ✅ Accurate statistics
- ✅ **Requires GitHub token**

---

## 🆘 Troubleshooting

**Q: Nothing shows on the page?**  
A: Check if you added a valid GitHub token and `NUXT_GITHUB_TOKEN` is in .env

**Q: "No Authentication provided" error?**  
A: Either:
- Keep `NUXT_PUBLIC_IS_DATA_MOCKED=true` for demo, OR
- Add valid `NUXT_GITHUB_TOKEN` if using real data

**Q: Port 3000 already in use?**  
A: Run with different port:
```bash
PORT=3001 npm run dev
```

**Q: Changed .env but still showing old data?**  
A: Restart the dev server (Ctrl+C and `npm run dev` again)

---

## 📝 Summary

1. **First Time:** Just run `npm install && npm run dev` - see demo data
2. **Later:** Add your GitHub token to see real metrics
3. **Switch Anytime:** Change `NUXT_PUBLIC_IS_DATA_MOCKED` in .env

---

That's it! Enjoy your Copilot Metrics Viewer! 🎉
