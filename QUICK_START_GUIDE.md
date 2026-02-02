# GitHub Copilot Metrics Viewer - Final Release v2.2.0

## 🚀 Quick Start (30 seconds)

```bash
# 1. Extract this folder
# 2. Run in terminal:
npm install

# 3. Start the application
npm run dev

# 4. Open browser
http://localhost:3000
```

✅ **That's it!** You'll see the demo metrics dashboard with mock data.

---

## 📋 What's Included

- ✅ **Complete Production Build** (.output folder)
- ✅ **Pre-configured .env** with safe defaults
- ✅ **Mock Data Mode** enabled (no GitHub token needed)
- ✅ **All Dependencies** listed in package.json
- ✅ **Setup Guide** (SETUP_FOR_RELEASE.md)

---

## 🔧 Configuration

### Default Setup (Mock Data - No GitHub Token)

Works immediately after `npm install` and `npm run dev`.

**Features:**
- ✅ View demo Copilot metrics
- ✅ Explore dashboard with sample data
- ✅ Test all features without GitHub

### Real GitHub Data (Optional)

To see your actual GitHub Copilot metrics:

1. **Get GitHub Token:**
   - Go to https://github.com/settings/tokens
   - Generate new token (classic)
   - Select scopes:
     - `copilot`
     - `manage_billing:copilot`
     - `read:enterprise`
     - `read:org`
   - Copy the token

2. **Update .env file:**
   ```env
   NUXT_PUBLIC_IS_DATA_MOCKED=false
   NUXT_PUBLIC_GITHUB_ORG=your-organization
   NUXT_GITHUB_TOKEN=ghp_your_token_here
   ```

3. **Restart:**
   ```bash
   npm run dev
   ```

---

## 📚 Documentation

- **SETUP_FOR_RELEASE.md** - Detailed configuration guide
- **.env** - Current configuration (customize as needed)
- **package.json** - Project dependencies and metadata

---

## 🐛 Troubleshooting

### "Port 3000 already in use"
```bash
PORT=3001 npm run dev
```

### "npm: command not found"
- Install Node.js from https://nodejs.org/
- Ensure npm is in PATH
- Restart terminal

### "Error fetching seats data"
- Likely using real data mode without valid token
- Set `NUXT_PUBLIC_IS_DATA_MOCKED=true` in .env
- Or add valid `NUXT_GITHUB_TOKEN`

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 Production Deployment

For production use:

```bash
# Build for production
npm run build

# Start production server (requires NUXT_SESSION_PASSWORD)
export NUXT_SESSION_PASSWORD="your_secure_32_char_password"
export NUXT_GITHUB_TOKEN="your_token" # if not using mock data
node .output/server/index.mjs
```

**or with Docker:**

```bash
docker build -t copilot-metrics .
docker run -p 3000:3000 \
  -e NUXT_SESSION_PASSWORD="your_password" \
  -e NUXT_GITHUB_TOKEN="your_token" \
  copilot-metrics
```

---

## 🔐 Security Notes

⚠️ **Important:**
- ✅ Never commit `.env` files with real credentials
- ✅ Use strong passwords for NUXT_SESSION_PASSWORD (32+ chars)
- ✅ Rotate GitHub tokens regularly
- ✅ Use environment variables in production
- ❌ Don't hardcode secrets in code

---

## 🎯 Features

### Dashboard Views
- 📊 **Metrics Tab** - Copilot usage statistics
- 👥 **Seat Analysis** - User seat allocation
- 💬 **Chat Metrics** - Chat interactions data
- 🗣️ **Copilot Chat** - Real-time chat data
- ⌨️ **Editors** - IDE/editor usage breakdown
- 🌍 **Languages** - Programming language stats

### Filtering
- 📅 Date range filtering
- 🏢 Organization/Enterprise selection
- 👥 Team filtering (where applicable)
- 🔧 Export capabilities

---

## 📞 Support

1. **Check SETUP_FOR_RELEASE.md** for detailed guides
2. **Review troubleshooting section** above
3. **Verify .env configuration** matches your needs
4. **Ensure Node.js 20+ installed** (`node --version`)

---

## 📝 Release Notes

**Version:** 2.2.0  
**Date:** February 2, 2026

### What's New
- ✅ Clean release configuration
- ✅ Simplified setup process
- ✅ Mock data enabled by default
- ✅ Comprehensive documentation
- ✅ Production-ready build

### Improvements
- Better error handling
- Improved session security
- Enhanced documentation
- Cleaner configuration templates

---

## 📋 File Structure

```
.
├── .output/                 # Production build
│   ├── server/             # Node.js server
│   └── public/             # Static files
├── .env                    # Configuration (update this!)
├── package.json            # Dependencies
├── node_modules/           # Installed packages
├── SETUP_FOR_RELEASE.md   # Detailed guide
└── README.md              # This file
```

---

## ✅ Next Steps

1. ✅ Extract this folder
2. ✅ Run `npm install`
3. ✅ Run `npm run dev`
4. ✅ Open http://localhost:3000
5. ✅ Explore the dashboard!

**Optional (for real data):**
6. Generate GitHub token
7. Update .env with token and org name
8. Set `NUXT_PUBLIC_IS_DATA_MOCKED=false`
9. Restart `npm run dev`

---

**Happy coding! 🎉**

For more help, see SETUP_FOR_RELEASE.md
