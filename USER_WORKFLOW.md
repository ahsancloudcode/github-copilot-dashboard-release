# User Workflow: Extension + Dashboard

## آپ کے پاس کیا ہے؟

### 1️⃣ **VS Code Extension** (Installed from Marketplace)
📍 [github-copilot-prompts](https://marketplace.visualstudio.com/items?itemName=ahsansaeed.github-copilot-prompts)

**یہ کیا کرتا ہے:**
- آپ کے تمام Copilot prompts automatically collect کرتا ہے
- انہیں save کرتا ہے: `~/.asaeed/copilotprompts/` folder میں
- VS Code sidebar میں "Copilot Prompts" tab میں display کرتا ہے
- Background میں 24/7 prompts track کرتا ہے

### 2️⃣ **Dashboard** (Cloned from GitHub)
📍 [github-copilot-dashboard-release](https://github.com/ahsancloudcode/github-copilot-dashboard-release)

**یہ کیا کرتا ہے:**
- Extension کی طرف سے saved prompts کو read کرتا ہے
- Beautiful web interface میں show کرتا ہے
- Analytics, charts, filtering دیتا ہے
- Local machine پر چلتا ہے (no cloud sync, آپ کا data private ہے)

---

## Complete Setup (5 منٹ میں)

### ✅ Step 1: Extension Install کریں (پہلے سے ہو چکا ہے)
```
VS Code → Extensions → Search "GitHub Copilot Prompts"
Install (by ahsansaeed)
```

### ✅ Step 2: Dashboard Setup کریں

اپنی computer میں جہاں dashboard clone کیا ہے وہاں جائیں:

```powershell
# Dashboard folder میں جائیں
cd C:\Users\YourUsername\github-copilot-dashboard-release

# Configuration file بنائیں
cp .env-copy.example .env-copy

# Dependencies install کریں (یہ خود ہی اگلے step کریں گے)
npm install

# Dashboard شروع کریں
npm run dev
```

**Output کچھ یوں ہوگا:**
```
✔ Vite client built in 72ms
✔ Vite server built in 2169ms
✔ Nuxt Nitro server built in 3621ms

➜ Local:    http://localhost:3001/
```

### ✅ Step 3: Browser میں Dashboard کھولیں

```
http://localhost:3001/
```

---

## Data Flow (کیسے کام کرتا ہے؟)

```
┌─────────────────────┐
│   VS Code          │
│  (آپ code لکھ رہے ہیں)  │
│                     │
│  Copilot prompts   │
└──────────┬──────────┘
           │
           │ Auto-saves
           ↓
┌──────────────────────────────────────┐
│  ~/.asaeed/copilotprompts/          │
│  (Local folder - extension کی طرف سے) │
│                                      │
│  ├─ prompts.json                     │
│  ├─ 2024-01-15.json                 │
│  └─ 2024-01-16.json                 │
└──────────┬──────────────────────────┘
           │
           │ Dashboard reads
           ↓
┌──────────────────────────────────────┐
│   Dashboard (localhost:3001)        │
│                                      │
│  ✨ Beautiful UI with:              │
│   - Chat History                    │
│   - Language Breakdown              │
│   - Search & Filter                 │
│   - Export to PDF                   │
│   - Statistics & Charts             │
└──────────────────────────────────────┘
```

---

## Dashboard میں کیا دیکھوں گے؟

### 📊 Main Dashboard Page
```
http://localhost:3001/orgs/mocked-org?mock=true
```

Tabs:
- **Chat History** - سب prompts اور responses
- **Language Breakdown** - کس language میں کتنی coding کی
- **Seat Analysis** - Usage patterns
- **Chat Metrics** - Copilot stats

### 📝 Local Prompts Tab
```
http://localhost:3001/
→ "Local Prompts" button
```
- Extension سے auto-collect prompts
- Your prompts دیکھیں
- Export کریں PDF میں

---

## Configuration (Optional)

اگر GitHub metrics بھی دیکھنا ہو تو `.env-copy` میں یہ add کریں:

```env
# GitHub Personal Access Token (Optional)
# GitHub account → Settings → Developer settings → Personal access tokens → Generate
NUXT_GITHUB_TOKEN=ghp_your_token_here

# Organization scope
NUXT_PUBLIC_SCOPE=organization
NUXT_PUBLIC_GITHUB_ORG=your-org-name
```

**بغیر Token کے بھی کام کرے گا** - صرف آپ کا local data (extension سے) دیکھے گا۔

---

## Troubleshooting

### ❌ Dashboard نہیں کھل رہا؟

```powershell
# Check کریں کہ npm install ہوا ہے
npm list

# اگر error ہو تو دوبارہ install کریں
rm -r node_modules
npm install

# دوبارہ شروع کریں
npm run dev
```

### ❌ Prompts dashboard میں نہیں آ رہے؟

```powershell
# Extension کے folder check کریں
# Windows:
dir %USERPROFILE%\.asaeed\copilotprompts

# Check کریں کہ files موجود ہیں
# اگر empty ہے تو:
# 1. VS Code میں extension reload کریں (Ctrl+Shift+P → Reload)
# 2. کوئی Copilot prompt try کریں
# 3. Wait کریں 2-3 سیکنڈ
```

### ❌ Port 3001 busy ہے؟

```powershell
# دوسرا port use کریں
npm run dev -- --port 3002

# یا پہلے والا process kill کریں
Get-Process node | Stop-Process
npm run dev
```

---

## Quick Command Reference

```powershell
# Setup
npm install

# شروع کریں
npm run dev

# Health check (سب ٹھیک ہے یا نہیں)
curl http://localhost:3001/api/health

# بند کریں
Ctrl + C
```

---

## Data Privacy ✅

- ✅ تمام data آپ کی local machine پر ہے
- ✅ کوئی cloud sync نہیں
- ✅ کوئی بھی server نہیں
- ✅ صرف locally accessible

---

## Next Steps

1. **Extension → Copilot prompts collect کریں**
   - کچھ code write کریں
   - Copilot سے queries کریں
   
2. **Dashboard → Data دیکھیں**
   - localhost:3001 کھولیں
   - "Local Prompts" tab میں اپنے prompts دیکھیں
   - Export کریں PDF میں

3. **Explore Features**
   - Charts اور stats دیکھیں
   - Search اور filter کریں
   - Export functionality استعمال کریں

---

## Support

اگر کوئی issue ہو تو:
- GitHub Issue: https://github.com/ahsancloudcode/github-copilot-dashboard-release/issues

Happy coding! 🚀
