# Netlify Deployment Guide

This guide explains how to deploy your full-stack URL shortener app to Netlify with a separate backend.

## Overview

Your application is split into two parts:
1. **Frontend** (React) → Deploy to **Netlify**
2. **Backend** (Express API) → Deploy to **Render, Railway, Heroku, or similar**

## Step 1: Deploy Backend

Choose one of these platforms for your backend:

### Option A: Deploy to Render (Recommended - Free tier available)
1. Push your code to GitHub (already done!)
2. Go to [https://render.com](https://render.com)
3. Click "New+" → "Web Service"
4. Select your GitHub repository
5. Configure:
   - Name: `rest-express-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm run start`
6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy your deployed URL (e.g., `https://rest-express-api.onrender.com`)

### Option B: Deploy to Railway
1. Go to [https://railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repository
5. Set these environment variables:
   - `NODE_ENV`: `production`
6. Railway will auto-detect and deploy

### Option C: Deploy to Heroku
1. Install Heroku CLI
2. Run: `heroku create your-app-name`
3. Run: `git push heroku main`
4. Copy your deployed URL (e.g., `https://your-app-name.herokuapp.com`)

## Step 2: Update Frontend Configuration

After deploying your backend, update Netlify's configuration:

1. Edit `netlify.toml`
2. Find this line:
   ```
   to = "YOUR_BACKEND_URL/api/:splat"
   ```
3. Replace `YOUR_BACKEND_URL` with your actual backend URL
   - Example: `https://rest-express-api.onrender.com`

## Step 3: Deploy Frontend to Netlify

### Method 1: Connect GitHub (Easiest)
1. Go to [https://netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and select your repository
4. Netlify will auto-detect the build settings from `netlify.toml`
5. Click "Deploy site"

### Method 2: Manual Deployment
1. Build your frontend: `npm run build`
2. Drag and drop the `dist/public` folder to Netlify
3. Set environment variables in Netlify dashboard:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.com`

## Step 4: Verify Deployment

1. Visit your Netlify URL (e.g., `https://your-site.netlify.app`)
2. Try creating a short link
3. Verify links are stored and working

## Troubleshooting

### "Failed to fetch" errors
- Check if your backend is running
- Verify the API URL in `netlify.toml` is correct
- Check CORS is enabled on backend (it's already configured)

### Links not persisting
- Backend is using in-memory storage by default
- Data will be lost on restart
- To persist data, connect a database to your backend

### Environment Variables Not Working
1. In Netlify Dashboard: Site Settings → Build & Deploy → Environment
2. Add `VITE_API_URL` environment variable
3. Redeploy the site

## Database Setup (Optional)

To persist your short links, you can connect PostgreSQL:

1. Create a PostgreSQL database (e.g., at ElephantSQL or Railway)
2. Set `DATABASE_URL` environment variable on your backend
3. Update `server/storage.ts` to use database instead of in-memory storage

## Environment Variables Reference

For your **Backend** deployment platform:
- `NODE_ENV`: `production`
- `DATABASE_URL`: (optional) Your database connection string

For your **Frontend** on Netlify:
- `VITE_API_URL`: Your backend URL (e.g., `https://rest-express-api.onrender.com`)

## Next Steps

- Customize your domain (Netlify allows custom domains)
- Set up HTTPS (Netlify does this automatically)
- Monitor analytics in Netlify dashboard
- Add database for data persistence
