# HRMS Lite Deployment Guide

Follow these steps to deploy your HRMS Lite application to the cloud.

## Step 1: Backend (Render)

1.  **Sign Up/Login**: Create an account at [Render.com](https://render.com).
2.  **Create New Web Service**: Click **New +** and select **Web Service**.
3.  **Connect Repo**: Connect your GitHub repository `Suryakant2010067/ms-lite`.
4.  **Configure Service**:
    - **Name**: `hrms-backend`
    - **Environment**: `Python`
    - **Root Directory**: `backend`
    - **Build Command**: `pip install -r requirements.txt`
    - **Start Command**: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app`
> [!IMPORTANT]
> **Ensure you replace the default Start Command** in Render settings with the one above. The error `No module named 'your_application'` happens if you leave the default placeholder!
5.  **Deploy**: Click **Create Web Service**.
6.  **Copy URL**: Once deployed, copy the service URL (e.g., `https://hrms-backend.onrender.com`).

> [!WARNING]
> Render's free tier has ephemeral storage. Since this app uses SQLite, your database will be reset on every restart. For long-term use, consider using Render's free PostgreSQL service (30 days) and updating `database.py`.

---

## Step 2: Frontend (Vercel)

1.  **Sign Up/Login**: Create an account at [Vercel.com](https://vercel.com).
2.  **Add New Project**: Click **Add New** and select **Project**.
3.  **Import Repo**: Import `Suryakant2010067/ms-lite`.
4.  **Configure Project**:
    - **Framework Preset**: `Vite`
    - **Root Directory**: `frontend`
5.  **Environment Variables**:
    - Click **Environment Variables**.
    - **Key**: `VITE_API_BASE_URL`
    - **Value**: `https://hrms-backend.onrender.com/api` (Use your Render URL + `/api`).
6.  **Deploy**: Click **Deploy**.

---

## Step 3: Verify

Open your Vercel deployment URL. The app should now be communicating with your live Render backend!
