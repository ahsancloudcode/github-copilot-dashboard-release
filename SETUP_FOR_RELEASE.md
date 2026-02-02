# GitHub Copilot Metrics Viewer - Final Release Setup Guide

## 🚀 Quick Start (Using Mock Data - No GitHub Token Needed)

The easiest way to get started is with mock/demo data:

### Step 1: Download & Extract
1. Download the release from [github-copilot-dashboard-release](https://github.com/ahsancloudcode/github-copilot-dashboard-release)
2. Extract to your preferred location
3. Open terminal in the extracted directory

### Step 2: Install & Run
```bash
npm install
npm run dev
```

Visit: http://localhost:3000

✅ You'll see demo metrics dashboard without any GitHub credentials!

---

## 📋 Configuration Explained

### What is `NUXT_SESSION_PASSWORD`?

**Why it exists:**
- Encrypts user session data for security
- Required for production builds
- Not needed for local development with `npm run dev`

**When you need it:**
- ✅ **Production deployment** (running built `.output` directory)
- ✅ **Docker containers**
- ❌ **Local development** with `npm run dev` - uses default

**How to set it:**
```bash
# Generate a secure random password
openssl rand -base64 32
# Output: something_like_Ab1cDef2GhIjK3lMnOpQrSt4UvWxYz5+

# Or use any random string of 32+ characters
```

---

## 🔧 Configuration Options

### .env File Structure

#### 1. Data Source
```env
# Use mock data (recommended for testing/demo)
NUXT_PUBLIC_IS_DATA_MOCKED=true

# Use real GitHub data (requires token)
NUXT_PUBLIC_IS_DATA_MOCKED=false
```

#### 2. Scope Type
```env
# For organization metrics
NUXT_PUBLIC_SCOPE=organization

# For enterprise metrics
NUXT_PUBLIC_SCOPE=enterprise

# For team metrics within organization
NUXT_PUBLIC_SCOPE=team-organization
```

#### 3. Organization/Enterprise Name
```env
# When using organization scope
NUXT_PUBLIC_GITHUB_ORG=your-org-name

# When using enterprise scope
NUXT_PUBLIC_GITHUB_ENT=your-enterprise-name

# Optional: team name for team scope
NUXT_PUBLIC_GITHUB_TEAM=team-name
```

#### 4. GitHub Token (Only for Real Data)
```env
# Leave empty when using NUXT_PUBLIC_IS_DATA_MOCKED=true
# Add your token only when you need real GitHub data

NUXT_GITHUB_TOKEN=ghp_your_token_here
```

**How to create a token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes:
   - `copilot`
   - `manage_billing:copilot`
   - `read:enterprise`
   - `read:org`
4. Copy and paste the token in `.env` or `.env.release`

#### 5. Session Password (For Production)
```env
# Required for production builds
# Generate: openssl rand -base64 32
NUXT_SESSION_PASSWORD=your_secure_32_character_password_here
```

---

## 📦 Scenario 1: Local Development with Mock Data (Easiest)

```bash
# 1. Install
npm install

# 2. Run dev server
npm run dev

# 3. Open browser
http://localhost:3000
```

**No configuration needed!** It uses `.env` with safe defaults.

---

## 📊 Scenario 2: Local Development with Real GitHub Data

```bash
# 1. Update .env with your GitHub token
NUXT_GITHUB_TOKEN=ghp_your_token_here
NUXT_PUBLIC_GITHUB_ORG=your-organization
NUXT_PUBLIC_IS_DATA_MOCKED=false

# 2. Install and run
npm install
npm run dev
```

---

## 🐳 Scenario 3: Production Deployment (Docker)

```bash
# 1. Build production version
npm run build

# 2. Generate secure session password
openssl rand -base64 32
# Copy the output

# 3. Run with required environment variable
export NUXT_SESSION_PASSWORD="your_generated_password"
export NUXT_GITHUB_TOKEN="ghp_your_token" # if using real data
export NUXT_PUBLIC_GITHUB_ORG="your-org"
export NUXT_PUBLIC_IS_DATA_MOCKED="false" # set to true for demo

node .output/server/index.mjs
```

Or with Docker:
```bash
docker build -t copilot-metrics-viewer .

docker run -p 3000:3000 \
  -e NUXT_SESSION_PASSWORD="your_secure_password" \
  -e NUXT_GITHUB_TOKEN="ghp_your_token" \
  -e NUXT_PUBLIC_GITHUB_ORG="your-org" \
  -e NUXT_PUBLIC_IS_DATA_MOCKED="false" \
  copilot-metrics-viewer
```

---

## ✅ Troubleshooting

### Error: "No Authentication provided"
- **Cause:** Trying to use real GitHub data without token
- **Fix:** Either:
  - Set `NUXT_PUBLIC_IS_DATA_MOCKED=true` for mock data, OR
  - Add `NUXT_GITHUB_TOKEN` to your `.env` file

### Error: "Invalid token"
- **Cause:** GitHub token is invalid or expired
- **Fix:**
  - Generate a new token at https://github.com/settings/tokens
  - Verify token hasn't expired
  - Check token has correct scopes

### Error: "Organization/Enterprise not found"
- **Cause:** Wrong organization name or token lacks permissions
- **Fix:**
  - Verify `NUXT_PUBLIC_GITHUB_ORG` or `NUXT_PUBLIC_GITHUB_ENT` is correct
  - Ensure token has `read:org` or `read:enterprise` scope

### 500 Error on Seats page
- **Cause:** GitHub token doesn't have `manage_billing:copilot` scope
- **Fix:** Regenerate token with correct scopes

### Development server won't start
- **Cause:** Port 3000 is in use or missing dependencies
- **Fix:**
  ```bash
  # Clear cache and reinstall
  rm -rf node_modules package-lock.json
  npm install
  
  # Try different port
  PORT=3001 npm run dev
  ```

---

## 📝 Files Reference

| File | Purpose |
|------|---------|
| `.env` | Your local development configuration |
| `.env.example` | Template for new installations |
| `.env.release` | Template for production releases |
| `.nuxt/` | Build cache (auto-generated) |
| `.output/` | Production build output |

---

## 🔐 Security Best Practices

⚠️ **Important:**
- ✅ **DO** use environment variables for sensitive values in production
- ✅ **DO** regenerate tokens regularly
- ✅ **DO** use strong session passwords (32+ characters)
- ❌ **DON'T** commit `.env` files with real credentials
- ❌ **DON'T** share GitHub tokens
- ❌ **DON'T** hardcode secrets in code

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for advanced setup
3. Check [README.md](./README.md) for general information

---

**Version:** 2.0.11
**Last Updated:** February 2, 2026
