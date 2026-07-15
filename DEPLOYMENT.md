# Production Deployment Guide

This document outlines the steps required to deploy the portfolio application with a React/Vite frontend on **Vercel** and a Django backend with MySQL on **Railway**.

---

## Architecture Overview

* **Frontend**: React/Vite app deployed on Vercel.
* **Backend**: Django REST Framework app deployed on Railway.
* **Database**: MySQL database service hosted on Railway.
* **API Calls**: The frontend can connect to the backend in two ways:
  1. **Direct CORS Request**: By configuring `VITE_API_BASE_URL` on Vercel, the frontend directly calls the Railway domain.
  2. **Vercel Proxy Rewrite**: By configuring Vercel's Edge Router via `vercel.json` rewrites, Vercel proxies relative `/api/...` and `/media/...` requests to the Railway backend domain.

---

## 1. Railway Backend Deployment

### Setup MySQL Service on Railway
1. Log in to [Railway](https://railway.app/).
2. Click **New Project** -> **Provision MySQL**.
3. Railway will provision a MySQL service and automatically define environment variables like `MYSQL_URL`, `MYSQLDATABASE`, `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, and `MYSQLPASSWORD`.

### Deploy Django Service
1. Click **New Service** -> **GitHub Repo** and select this repository.
2. Under the service settings, set the **Root Directory** to `backend`.
3. Set the **Start Command** to:
   ```bash
   gunicorn core.wsgi:application --bind 0.0.0.0:$PORT
   ```
4. Generate a public domain under the **Networking** section of the service settings (e.g., `https://your-backend-railway-domain.up.railway.app`).

### Backend Environment Variables
Add the following variables to your Railway Django service under **Variables**:

| Variable Name | Description | Example Value |
|---|---|---|
| `SECRET_KEY` | Production security key | `your-secret-random-string` |
| `DEBUG` | Disable debug mode | `False` |
| `ALLOWED_HOSTS` | Hosts allowed to connect (comma-separated) | `your-backend-railway-domain.up.railway.app,localhost` |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend domains (comma-separated) | `https://your-vercel-app.vercel.app` |
| `CSRF_TRUSTED_ORIGINS` | Trusted frontend domains (comma-separated) | `https://your-vercel-app.vercel.app` |
| `SESSION_COOKIE_SECURE` | Enable secure session cookies | `True` |
| `CSRF_COOKIE_SECURE` | Enable secure CSRF cookies | `True` |
| `SIMPLE_JWT_COOKIE_SECURE` | Enable secure JWT cookies | `True` |
| `MYSQL_URL` | MySQL connection string | `${{MySQL.MYSQL_URL}}` (Use Railway's reference syntax) |
| `EMAIL_HOST` | SMTP server host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USE_TLS` | Enable TLS security | `True` |
| `EMAIL_HOST_USER` | SMTP sender email | `your-email@gmail.com` |
| `EMAIL_HOST_PASSWORD` | SMTP app password | `your-app-password` |
| `DEFAULT_FROM_EMAIL` | Sender address for emails | `your-email@gmail.com` |
| `OWNER_EMAIL` | Address receiving contact notifications | `your-email@gmail.com` |

---

## 2. Vercel Frontend Deployment

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New Project** -> **Import** from your GitHub repository.
3. In the project setup, set the **Root Directory** to `frontend`.
4. Leave the **Build and Development Settings** as default (Vercel automatically detects Vite).
5. Add the following **Environment Variables**:
   * `VITE_API_BASE_URL`: `https://your-backend-railway-domain.up.railway.app` (Your public Railway domain).
6. Click **Deploy**.

### Optional: Vercel Proxy configuration
If you prefer not to use `VITE_API_BASE_URL` directly and route everything via Vercel's edge router proxy:
1. Open [frontend/vercel.json](file:///d:/Portfolio/Portfolio-V1/frontend/vercel.json) in your editor.
2. Edit the `destination` property under the `/api/:path*` and `/media/:path*` routes to point to your Railway domain:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://your-backend-railway-domain.up.railway.app/api/:path*"
       }
     ]
   }
   ```
3. Commit and push the changes.

---

## 3. Post-Deployment Commands

After deploying the services, run the following commands to initialize the production database.

### Running Commands on Railway
You can run commands using the **Railway CLI** locally, or by using the **Railway Dashboard Terminal/Builder** (in the service deployment overview, select the deployment -> click **Command Line** / **Shell** tab):

1. **Apply Database Migrations**:
   ```bash
   python manage.py migrate
   ```
2. **Seed Initial Portfolio Catalog**:
   ```bash
   python manage.py loaddata initial_projects
   ```
   *Note: This command should only be run once during initial setup to avoid overwriting production edits.*
3. **Create Admin Superuser**:
   ```bash
   python manage.py createsuperuser
   ```

---

## 4. Media Uploads & Ephemeral Filesystem

> [!WARNING]
> Railway’s container filesystem is **ephemeral**. Any files uploaded directly to the local `media/` directory (e.g. project images uploaded through the admin page) will be **wiped out** whenever the Railway container restarts or redeploys.
>
> **Recommended Production Enhancement**: Integrate `django-storages` with Amazon S3 or Cloudinary to handle persistent user media files in production.

---

## 5. Post-Deployment Testing Checklist

1. **Home Page load**: Open your Vercel deployment URL -> verify the projects, biography, skills, and diagnostics load correctly.
2. **Secure Admin Login**: Navigate to `/admin` -> log in with your superuser credentials -> verify access is granted.
3. **Data Persistency**: Go to **System Profile** -> edit your initials logo or landing tagline -> click save -> refresh and verify the changes update on the home page.
4. **Email Transmission**: Fill out the contact form on the home page -> verify the message email is received by `OWNER_EMAIL`.
