# Railway Deployment Guide for Appliance-Watch

This guide will help you deploy the Appliance-Watch application to Railway, a modern deployment platform.

## Prerequisites

- A Railway account (sign up at https://railway.app)
- A Supabase account and active project (sign up at https://supabase.com)
- Git repository with your code
- Basic knowledge of environment variables

## Important: Database Configuration

**This project uses Supabase as the database provider**, not Railway's built-in PostgreSQL. Make sure you have:
- An active Supabase project
- Your Supabase database connection string ready
- Supabase project accessible from external services (default setting)

## Project Structure

This project consists of two main parts:
- **Frontend**: React/Vite application (root directory)
- **Backend**: Express.js/TypeScript API (backend directory)

## Deployment Steps

### 1. Create Railway Account and Project

1. Sign up at https://railway.app
2. Connect your GitHub account
3. Create a new project from your GitHub repository

### 2. Configure Supabase Database

1. Make sure your Supabase project is set up and running
2. Get your Supabase database connection string from your Supabase dashboard
3. Navigate to Settings → Database in your Supabase project
4. Copy the connection string (it should look like: `postgresql://postgres:[password]@[host]:5432/postgres`)
5. Note: You'll use this DATABASE_URL for both development and production

### 3. Deploy Backend Service

1. Click "Add Service" → "GitHub Repo"
2. Select your repository
3. Set the **Root Directory** to `backend`
4. Configure environment variables:
   ```
   DATABASE_URL=<your-supabase-database-url>
   NODE_ENV=production
   PORT=3002
   FRONTEND_URL=<your-frontend-railway-url>
   CORS_ORIGINS=<your-frontend-railway-url>
   JWT_SECRET=<your-secure-jwt-secret>
   ```
5. Railway will automatically build and deploy your backend

**Note**: Since you're using Supabase, Railway won't provision a database service. Make sure your Supabase database is accessible from Railway's servers.

### 4. Deploy Frontend Service

1. Click "Add Service" → "GitHub Repo"
2. Select your repository again
3. Leave **Root Directory** empty (root of project)
4. Configure environment variables:
   ```
   VITE_API_URL=<your-backend-railway-url>/api
   ```
5. Railway will automatically build and deploy your frontend

### 5. Configure Custom Domains (Optional)

1. Go to each service settings
2. Click "Domains" tab
3. Add custom domain or use Railway-provided domain

## Environment Variables Reference

### Backend (.env)
```bash
# Database Configuration - Your Supabase Database URL
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres

# Server Configuration
NODE_ENV=production
PORT=3002

# Frontend Configuration
FRONTEND_URL=https://your-frontend-url.railway.app

# CORS origins (comma-separated)
CORS_ORIGINS=https://your-frontend-url.railway.app,https://your-domain.com

# JWT Settings
JWT_SECRET=your-secure-jwt-secret-here
```

### Frontend (.env)
```bash
# API Configuration
VITE_API_URL=https://your-backend-url.railway.app/api
```

## Build Commands

Railway will automatically detect and run these commands:

### Backend
- **Build**: `npm run build`
- **Start**: `npm run start:production`

### Frontend
- **Build**: `npm run build`
- **Start**: `npm run start:production`

## Database Setup

Since you're using **Supabase** as your database provider:

1. **No Railway database service needed** - Skip adding PostgreSQL in Railway
2. **Supabase Connection**: Use your existing Supabase database URL
3. **Automatic Schema Migration**: The backend will automatically:
   - Run TypeScript compilation (`npm run build`)
   - Push database schema to Supabase (`npm run db:migrate`)
   - Start the server (`npm run start`)
4. **Network Access**: Supabase is accessible from Railway by default
5. **Connection Pooling**: Supabase handles connection pooling automatically

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Railway automatically assigns ports. Make sure your backend uses `process.env.PORT`

3. **Database Connection Issues**: 
   - Verify `DATABASE_URL` points to your Supabase database
   - Check Supabase project status in your Supabase dashboard
   - Ensure your Supabase project allows external connections
   - Verify the connection string format: `postgresql://postgres:[password]@[host]:5432/postgres`

4. **CORS Issues**: 
   - Update `CORS_ORIGINS` with your actual Railway URLs
   - Ensure frontend URL is correct

5. **Build Failures**:
   - Check build logs in Railway dashboard
   - Verify all dependencies are in `package.json`

### Logs and Monitoring

- View logs in Railway dashboard under each service
- Use Railway CLI for advanced debugging: `railway logs`

## Production Considerations

1. **Security**: Always use strong JWT secrets in production
2. **Environment Variables**: Never commit `.env` files to version control
3. **Database Backups**: Railway provides automatic backups
4. **Monitoring**: Set up health checks and monitoring

## Railway CLI (Optional)

Install Railway CLI for advanced management:
```bash
npm install -g @railway/cli
railway login
railway link
```

## Support

- Railway Documentation: https://docs.railway.app
- Railway Community: https://discord.gg/railway
- Project Issues: Create issues in your GitHub repository

---

## Quick Deployment Checklist

- [ ] Railway account created
- [ ] GitHub repository connected
- [ ] Supabase database project active and accessible
- [ ] Backend service deployed with Supabase DATABASE_URL
- [ ] Frontend service deployed with API URL
- [ ] Database schema migrated to Supabase
- [ ] Application tested and working

Your Appliance-Watch application should now be live on Railway! 🚀