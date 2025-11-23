# GitHub Setup Instructions for TinyLink

## Quick Setup (Copy & Paste in Terminal)

Run these commands in your project root directory:

```bash
# Initialize git repository
git init

# Add your name and email (optional if already configured)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Create .gitignore file
cat > .gitignore << 'EOF'
node_modules/
dist/
build/
.env
.env.local
.vscode/
.idea/
*.log
.DS_Store
.replit
.cache/
EOF

# Add all files to git
git add .

# Create initial commit
git commit -m "Initial commit: TinyLink URL shortener MVP

- Complete URL shortening service with dashboard
- Dashboard with create, delete, and link management  
- Stats page with detailed analytics per link
- Health check endpoint
- API endpoints with proper error handling and status codes
- Responsive UI with Tailwind CSS
- In-memory storage with click tracking"

# Add remote repository
git remote add origin https://github.com/vasanthgondrala-7/tiny-link.git

# Push to GitHub (creates main branch)
git branch -M main
git push -u origin main
```

## That's it! 🎉

Your code is now on GitHub at: https://github.com/vasanthgondrala-7/tiny-link

## Next: Deploy to Netlify

1. Go to https://netlify.com
2. Sign in or create a free account
3. Click "Add new site" → "Import an existing project"
4. Select GitHub and choose `tiny-link` repository
5. Use these settings:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
   - Node version: 18
6. Click "Deploy site"

Your app will be live at a netlify.app domain automatically! 🚀
