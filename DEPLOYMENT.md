# Deployment Guide: Vercel (Frontend) + PythonAnywhere (Backend)

This guide walks you through deploying the AutoMeals application with the frontend on Vercel and the backend on PythonAnywhere.

## Prerequisites

- GitHub account
- Vercel account (free tier: https://vercel.com)
- PythonAnywhere account (free tier: https://www.pythonanywhere.com)
- Your code pushed to a GitHub repository

---

## Part 1: Deploy Backend to PythonAnywhere

### Step 1: Create PythonAnywhere Account
1. Go to https://www.pythonanywhere.com and sign up for a free account
2. Verify your email address

### Step 2: Upload Your Backend Code
1. Open a new Bash console in PythonAnywhere
2. Clone your repository:
   ```bash
   cd ~
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME/backend
   ```
   
   Or upload files manually via the Files tab in the PythonAnywhere dashboard.

### Step 3: Set Up Python Environment
1. In the PythonAnywhere dashboard, go to the **Web** tab
2. Click **Create a new web app**
3. Choose a domain name (e.g., `yourusername.pythonanywhere.com`)
4. Select **Manual configuration** (not Flask)
5. Select Python version 3.13 (or the version you're using)

### Step 4: Install Dependencies
1. Open a Bash console
2. Navigate to your backend directory:
   ```bash
   cd ~/YOUR_REPO_NAME/backend
   ```
3. Create a virtual environment (if not already created):
   ```bash
   python3.13 -m venv venv
   source venv/bin/activate
   ```
4. Install dependencies:
   ```bash
   pip install --user fastapi uvicorn sqlmodel asgiref
   ```
   
   Or if using a requirements file:
   ```bash
   pip install --user -r requirements.txt
   ```

### Step 5: Configure WSGI File
1. In the PythonAnywhere dashboard, go to the **Web** tab
2. Click on your web app
3. Click on **WSGI configuration file** link
4. Replace the contents with the contents of `backend/wsgi.py` from your repository, or use:
   ```python
   import sys
   import os
   
   # Add the backend directory to the Python path
   backend_dir = os.path.expanduser('~/YOUR_REPO_NAME/backend')
   sys.path.insert(0, backend_dir)
   
   from asgiref.wsgi import WsgiToAsgi
   from app.main import app
   
   # Wrap the ASGI app with WSGI adapter for PythonAnywhere
   application = WsgiToAsgi(app)
   ```
5. Replace `YOUR_REPO_NAME` with your actual repository name
6. Save the file

### Step 6: Configure Static Files and Virtualenv
In the **Web** tab, under your web app settings:

1. **Virtualenv**: Set to `~/YOUR_REPO_NAME/backend/venv` (or leave blank if using system packages)
2. **Working directory**: Set to `~/YOUR_REPO_NAME/backend`

### Step 7: Set Environment Variables
1. In the **Web** tab, find **Environment variables**
2. Add:
   - Key: `ALLOWED_ORIGINS`
   - Value: `https://your-vercel-app.vercel.app,http://localhost:5173`
   (Replace `your-vercel-app` with your actual Vercel domain - you'll update this after deploying to Vercel)

### Step 8: Initialize Database
1. Open a Bash console
2. Navigate to your backend directory and activate venv:
   ```bash
   cd ~/YOUR_REPO_NAME/backend
   source venv/bin/activate
   ```
3. Run Python to initialize the database:
   ```bash
   python -c "from app.db import initialise_db; initialise_db()"
   ```
   This creates the SQLite database file.

### Step 9: Reload Your Web App
1. Go to the **Web** tab
2. Click the green **Reload** button for your web app

### Step 10: Test Your Backend
Visit `https://yourusername.pythonanywhere.com/recipes` in your browser. You should see JSON data or an error message (which is fine - the endpoint exists).

**Important**: Note your backend URL - it will be something like `https://yourusername.pythonanywhere.com`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Connect Your Repository
1. Go to https://vercel.com and sign in
2. Click **Add New Project**
3. Import your GitHub repository
4. Select the repository containing your code

### Step 2: Configure Build Settings
Vercel should auto-detect Vite, but verify these settings:

- **Framework Preset**: Vite (or leave as auto-detect)
- **Root Directory**: `frontend` (important!)
- **Build Command**: `yarn build` (or `npm run build`)
- **Output Directory**: `dist`
- **Install Command**: `yarn install` (or `npm install`)

### Step 3: Add Environment Variable
Before deploying, add an environment variable:

1. In the Vercel project settings, go to **Environment Variables**
2. Add a new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://yourusername.pythonanywhere.com`
   (Replace with your actual PythonAnywhere backend URL)

### Step 4: Deploy
1. Click **Deploy**
2. Wait for the build to complete
3. Note your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

### Step 5: Update Backend CORS
Now that you have your Vercel URL:

1. Go back to PythonAnywhere
2. In the **Web** tab, update the `ALLOWED_ORIGINS` environment variable:
   - Value: `https://your-vercel-app.vercel.app,http://localhost:5173`
3. Click **Reload** on your web app

---

## Part 3: Verify Deployment

1. Visit your Vercel frontend URL
2. The app should load and fetch recipes from your PythonAnywhere backend
3. Test the meal planning features

---

## Troubleshooting

### Frontend can't connect to backend
- Check that `VITE_API_URL` is set correctly in Vercel
- Verify your PythonAnywhere backend is accessible (visit the `/recipes` endpoint directly)
- Check browser console for CORS errors
- Make sure `ALLOWED_ORIGINS` in PythonAnywhere includes your Vercel URL

### Backend not working on PythonAnywhere
- Check the **Error log** in the PythonAnywhere Web tab
- Verify all dependencies are installed
- Make sure the WSGI file path is correct
- Check that the database file exists and is initialized

### Database issues
- The SQLite database file should be in `~/YOUR_REPO_NAME/backend/database.db`
- If the database gets reset, re-run the initialization command from Step 8 of Part 1

---

## Free Tier Limitations

### PythonAnywhere Free Tier:
- Your app sleeps after 3 months of inactivity
- Limited CPU and disk space
- Web app accessible at `yourusername.pythonanywhere.com`

### Vercel Free Tier:
- Unlimited deployments
- Global CDN
- Automatic HTTPS

---

## Updating Your Deployment

### To update the backend:
1. Push changes to GitHub
2. In PythonAnywhere, pull the latest code:
   ```bash
   cd ~/YOUR_REPO_NAME
   git pull
   ```
3. Reload your web app in the PythonAnywhere dashboard

### To update the frontend:
1. Push changes to GitHub
2. Vercel will automatically redeploy (if auto-deploy is enabled)
3. Or manually trigger a deployment in the Vercel dashboard

---

## Alternative: Use PythonAnywhere's Free MySQL Instead of SQLite

If you want a more robust database, PythonAnywhere provides a free MySQL database:

1. In PythonAnywhere dashboard, go to **Databases** tab
2. Create a new MySQL database
3. Update `backend/app/db.py` to use MySQL instead of SQLite:
   ```python
   DATABASE_URL = "mysql+pymysql://USERNAME:PASSWORD@USERNAME.mysql.pythonanywhere-services.com/USERNAME$DATABASE_NAME"
   ```
4. Install `pymysql`: `pip install --user pymysql`
5. Update SQLModel to work with MySQL

---

## Need Help?

- PythonAnywhere Docs: https://help.pythonanywhere.com
- Vercel Docs: https://vercel.com/docs
- FastAPI Deployment: https://fastapi.tiangolo.com/deployment/

