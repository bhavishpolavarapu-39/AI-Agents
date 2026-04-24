# Quick Vercel Deployment (5 Minutes)

## The Easiest Way: GitHub Integration

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Sign in with GitHub (or create free account)

### Step 2: Click "Add New Project"
```
[Dashboard] → [Add New...] → [Project]
```

### Step 3: Import Your Repository
1. Click **"Import Git Repository"**
2. Paste your repo URL:
   ```
   https://github.com/bhavishpolavarapu-39/AI-Agents
   ```
3. Click **"Continue"**

### Step 4: Configure Your Product

**For SENTINEL (Example):**
- **Project Name**: `sentinel-os` (or any name you like)
- **Framework**: Should auto-detect **Next.js** ✓
- **Root Directory**: Click and select `sentinel/frontend`

**For Other Products:**
- `lumina/frontend` → LUMINA
- `vitae/frontend` → VITAE
- `lexis/frontend` → LEXIS
- `nexus/frontend` → NEXUS
- `athena/frontend` → ATHENA
- `orbit/frontend` → ORBIT
- `halo/frontend` → HALO
- `canvas/frontend` → CANVAS
- `apex/frontend` → APEX
- `terra/frontend` → TERRA
- `compass/frontend` → COMPASS

### Step 5: Add Environment Variables (Important!)

Under **"Environment Variables"** section, add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` |

*Note: Change to your backend URL when you deploy it*

Example if backend deployed:
```
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

### Step 6: Click "Deploy" and Wait!
- **Build time**: 2-5 minutes
- **Automatic**: Framework detection, dependencies, build

### Step 7: Your URL is Ready! 🎉
```
https://sentinel-os.vercel.app
https://lumina-research.vercel.app
https://vitae-health.vercel.app
(etc.)
```

---

## That's It! ✓

Your product is now live and automatically updates when you push to GitHub.

### Auto-Updates Explained:
```
You push code to GitHub
    ↓
Vercel detects changes
    ↓
Automatic build starts
    ↓
Your site updates in 2-5 mins
```

---

## Troubleshooting

### ❌ Build Failed?
Check Vercel Dashboard → Project → Deployments → Latest Build
Click build to see error logs

**Common fixes:**
- Missing dependencies: `npm install framer-motion recharts`
- TypeScript errors: Check `app/page.tsx` syntax
- Wrong root directory: Make sure you selected `sentinel/frontend`

### ❌ Can't reach API?
Update environment variable:
```
Vercel Dashboard → Settings → Environment Variables
Change NEXT_PUBLIC_API_URL to your backend URL
```

### ❌ Components not loading?
Check browser console (F12) for errors
Verify API is running and accessible

---

## Next: Deploy Your Backend

You've deployed the frontend! Now deploy the backend:

### Quick Backend Deployment Options:
1. **Railway.app** (easiest for Python)
   - Sign up: https://railway.app
   - Import your GitHub repo
   - Select `sentinel/backend`
   - Connect PostgreSQL + Redis
   - Deploy!

2. **PythonAnywhere**
   - Upload FastAPI code
   - Configure Python
   - Done!

3. **AWS/GCP/Azure**
   - More complex but enterprise-grade

Once backend is deployed:
1. Get backend URL (e.g., `https://sentinel-api.railway.app`)
2. Update Vercel environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://sentinel-api.railway.app
   ```
3. Vercel auto-redeploys

---

## Commands (If Using Vercel CLI Instead)

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to product
cd /tmp/AI-Agents/sentinel/frontend

# Deploy
vercel --prod

# Done!
```

---

## Your Product URLs After Deployment

| Product | URL |
|---------|-----|
| SENTINEL | `https://sentinel-os.vercel.app` |
| LUMINA | `https://lumina-research.vercel.app` |
| VITAE | `https://vitae-health.vercel.app` |
| LEXIS | `https://lexis-law.vercel.app` |
| NEXUS | `https://nexus-supply.vercel.app` |
| ATHENA | `https://athena-learning.vercel.app` |
| ORBIT | `https://orbit-projects.vercel.app` |
| HALO | `https://halo-home.vercel.app` |
| CANVAS | `https://canvas-marketing.vercel.app` |
| APEX | `https://apex-portfolio.vercel.app` |
| TERRA | `https://terra-carbon.vercel.app` |
| COMPASS | `https://compass-experience.vercel.app` |

---

**Start now: https://vercel.com/dashboard**
