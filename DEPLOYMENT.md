# HappyTails - Complete Deployment Guide

This guide covers deploying both the backend API and frontend application to production.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Post-Deployment](#post-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Overview

### Architecture

```
Frontend (Vite/React)          Backend (Node.js/Express)
      ↓                               ↓
  Vercel/Netlify              Railway/Render/AWS
      ↓                               ↓
  Firebase Auth  ←───────────→  MongoDB Atlas
                                      ↓
                               Gemini AI API
```

### Recommended Platforms

- **Frontend**: Vercel, Netlify, or Cloudflare Pages
- **Backend**: Railway, Render, Heroku, or AWS
- **Database**: MongoDB Atlas (cloud)
- **Auth**: Firebase Authentication
- **AI**: Google Gemini API

---

## Prerequisites

### Required Accounts

1. **GitHub Account** - Code repository
2. **MongoDB Atlas** - Database (free tier available)
3. **Firebase Project** - Authentication (free tier available)
4. **Google Cloud** - Gemini AI API key
5. **Vercel/Netlify** - Frontend hosting (free tier available)
6. **Railway/Render** - Backend hosting (free tier available)

### Local Setup Complete

Ensure your app runs locally before deploying:
- [ ] Backend runs on `http://localhost:5000`
- [ ] Frontend runs on `http://localhost:8080`
- [ ] MongoDB connected
- [ ] Firebase authentication works
- [ ] All features tested (see `E2E_TESTING_GUIDE.md`)

---

## Backend Deployment

### Step 1: Setup MongoDB Atlas

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Create a new cluster (free M0 tier)

2. **Configure Database**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string:
     ```
     mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/happytails?retryWrites=true&w=majority
     ```

3. **Setup Database User**
   - Go to "Database Access"
   - Add new database user
   - Save username and password

4. **Configure Network Access**
   - Go to "Network Access"
   - Add IP Address
   - For development: Allow access from anywhere (0.0.0.0/0)
   - For production: Add your server's IP

### Step 2: Setup Firebase (Production)

1. **Create Production Firebase Project**
   - Go to https://console.firebase.google.com
   - Create new project or use existing
   - Enable Authentication → Email/Password

2. **Generate Service Account**
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Download JSON file
   - Extract these values for environment variables:
     - `project_id`
     - `private_key`
     - `client_email`

3. **Add Web App**
   - Project Settings → General
   - Add web app
   - Copy the config values for frontend

### Step 3: Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Create new API key or use existing
3. Copy the API key for backend environment variables

### Step 4: Deploy to Railway (Recommended)

#### Option A: Deploy via GitHub

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Connect to Railway**
   - Go to https://railway.app
   - Sign up/Login with GitHub
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your HappyTails repository
   - Select the `backend` folder (if monorepo)

3. **Configure Environment Variables**
   
   In Railway dashboard → Variables, add:
   
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/happytails
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Key\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
   GEMINI_API_KEY=your-gemini-key
   JWT_SECRET=your-strong-random-secret
   JWT_EXPIRE=7d
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Deploy**
   - Railway will auto-deploy
   - Wait for deployment to complete
   - Note your backend URL: `https://your-app.railway.app`

#### Option B: Deploy to Render

1. **Create Account** at https://render.com
2. **New Web Service**
   - Connect your GitHub repo
   - Name: `happytails-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start` or `node server.js`

3. **Add Environment Variables** (same as Railway)

4. **Deploy** - Render will auto-deploy

### Step 5: Verify Backend Deployment

Test your deployed backend:

```bash
# Health check
curl https://your-backend.railway.app/api/test/public

# Should return: { message: "Public route - no authentication required" }

# Test with authentication
curl https://your-backend.railway.app/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Frontend Deployment

### Step 1: Update Frontend Configuration

1. **Create `.env.production`** in `frontend/` folder:
   ```env
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   VITE_FIREBASE_API_KEY=your-prod-firebase-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   VITE_ENV=production
   ```

2. **Test Production Build Locally**
   ```bash
   cd frontend
   npm run build
   npm run preview
   ```
   - Should run without errors
   - Test on `http://localhost:4173`

### Step 2: Deploy to Vercel (Recommended)

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard**
   - Go to https://vercel.com
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your HappyTails repository
   - Configure:
     - Framework Preset: Vite
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Add Environment Variables**
   
   In Vercel → Project Settings → Environment Variables, add all variables from `.env.production`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be at: `https://your-app.vercel.app`

#### Alternative: Deploy to Netlify

1. Go to https://netlify.com
2. "Add new site" → "Import from Git"
3. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. Add environment variables in Site Settings
5. Deploy

### Step 3: Update Backend CORS

After frontend is deployed, update backend environment variables:

```env
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com
```

Redeploy backend or restart service.

### Step 4: Verify Frontend Deployment

1. Visit your deployed frontend URL
2. Test critical features:
   - [ ] Homepage loads
   - [ ] Can register new user
   - [ ] Can login
   - [ ] Can add pet
   - [ ] Can book appointment
   - [ ] Admin dashboard (if admin user)

---

## Post-Deployment

### 1. Setup Custom Domain (Optional)

#### For Frontend (Vercel)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate

#### For Backend (Railway)
1. Go to Settings → Domains
2. Add custom domain
3. Configure DNS records
4. Update frontend `VITE_API_BASE_URL`

### 2. Setup Monitoring

#### Backend Monitoring
- Enable Railway/Render logs
- Setup error tracking (Sentry, LogRocket)
- Monitor MongoDB Atlas metrics

#### Frontend Monitoring
- Vercel Analytics (built-in)
- Google Analytics
- Error tracking (Sentry)

### 3. Setup Backups

#### MongoDB Atlas
- Go to Cluster → Backup
- Enable Cloud Backup (Continuous Backup)
- Set retention policy

### 4. Security Checklist

- [ ] All environment variables set correctly
- [ ] CORS only allows your domain
- [ ] MongoDB IP whitelist configured
- [ ] Firebase security rules set
- [ ] Rate limiting enabled
- [ ] HTTPS enabled (automatic on Vercel/Railway)
- [ ] No secrets in code repository
- [ ] JWT_SECRET is strong and unique

### 5. Performance Optimization

#### Backend
- Enable compression middleware (already included)
- Monitor response times
- Optimize database queries
- Add database indexes if needed

#### Frontend
- Images optimized
- Code splitting (handled by Vite)
- Enable CDN caching
- Monitor bundle size

---

## Maintenance

### Regular Tasks

**Weekly:**
- Check error logs
- Monitor API response times
- Review MongoDB usage

**Monthly:**
- Review and update dependencies
- Check security advisories
- Monitor costs

**Quarterly:**
- Rotate secrets (JWT_SECRET, API keys)
- Review and update documentation
- Performance audit

### Updating the Application

#### Backend Updates
```bash
# Local
git pull origin main
cd backend
npm install
npm test

# Deploy
git push origin main
# Railway/Render will auto-deploy
```

#### Frontend Updates
```bash
# Local
git pull origin main
cd frontend
npm install
npm run build

# Deploy
git push origin main
# Vercel will auto-deploy
```

---

## Troubleshooting

### Backend Issues

#### "MongoDB connection failed"
- Check MONGODB_URI format
- Verify database user credentials
- Check IP whitelist in MongoDB Atlas
- Test connection string locally

#### "Firebase initialization failed"
- Verify FIREBASE_PRIVATE_KEY has proper newlines (\n)
- Check service account permissions
- Ensure project_id is correct

#### "CORS errors"
- Verify frontend URL in ALLOWED_ORIGINS
- Check for typos (http vs https)
- Restart backend service after changes

#### "Rate limit exceeded"
- Check RATE_LIMIT_MAX_REQUESTS setting
- Consider increasing limits for production
- Monitor for abuse

### Frontend Issues

#### "API calls failing"
- Verify VITE_API_BASE_URL is correct
- Check backend CORS configuration
- Verify backend is running
- Check browser console for errors

#### "Firebase authentication not working"
- Verify Firebase config variables
- Check Firebase console for errors
- Ensure production app is registered

#### "Build failing"
- Check for TypeScript errors: `npm run type-check`
- Verify all dependencies installed
- Check build logs for specific errors

### Common Errors

#### 502 Bad Gateway
- Backend service crashed
- Check backend logs
- Verify environment variables
- Restart service

#### 404 Not Found
- Incorrect API endpoint
- Frontend routing issue
- Check API documentation

#### 401 Unauthorized
- JWT token expired or invalid
- Clear localStorage and login again
- Verify JWT_SECRET is consistent

---

## Rollback Procedure

If deployment fails or causes issues:

### Backend Rollback (Railway/Render)
1. Go to Deployments
2. Find previous working deployment
3. Click "Redeploy" or "Rollback"

### Frontend Rollback (Vercel)
1. Go to Deployments
2. Find previous deployment
3. Click menu → "Promote to Production"

### Git Rollback
```bash
# Rollback to previous commit
git revert HEAD
git push origin main

# Or rollback to specific commit
git reset --hard <commit-hash>
git push -f origin main
```

---

## Support Resources

- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Firebase Docs**: https://firebase.google.com/docs
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev/guide

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing locally
- [ ] Environment variables documented
- [ ] Database backups configured
- [ ] Error tracking setup
- [ ] Monitoring configured

### Deployment
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] CORS configured correctly
- [ ] Custom domains configured (if applicable)
- [ ] SSL certificates active

### Post-Deployment
- [ ] All features tested in production
- [ ] Error logs reviewed
- [ ] Performance metrics checked
- [ ] Team notified of deployment
- [ ] Documentation updated

---

## Success! 🎉

Your HappyTails application is now live in production!

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.railway.app
- **Database**: MongoDB Atlas
- **Status**: Production Ready

Next steps:
1. Monitor logs for first 24 hours
2. Gather user feedback
3. Plan next features
4. Celebrate your deployment! 🚀
