# Lead Management System - Deployment Guide

This guide will help you deploy the Lead Management System to production.

## Backend Deployment

### Option 1: Render (Recommended)

1. **Create a Render account** at [render.com](https://render.com)

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Select the `backend` folder as the root directory
   - Use the following settings:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Node Version**: 18.x

3. **Set Environment Variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lead_management
   JWT_SECRET=your_super_secure_jwt_secret_here
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

4. **Deploy**: Click "Create Web Service"

### Option 2: Railway

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Create a new project** and connect your GitHub repository

3. **Add MongoDB service**:
   - Add a MongoDB database service
   - Copy the connection string

4. **Deploy the backend**:
   - Select the backend folder
   - Set environment variables (same as Render)
   - Deploy

### Option 3: Heroku

1. **Create a Heroku account** and install Heroku CLI

2. **Create a new app**:
   ```bash
   heroku create your-app-name
   ```

3. **Add MongoDB**:
   ```bash
   heroku addons:create mongolab:sandbox
   ```

4. **Set environment variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_super_secure_jwt_secret_here
   heroku config:set JWT_EXPIRE=7d
   heroku config:set FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

## Frontend Deployment

### Vercel (Recommended)

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Import your GitHub repository**

3. **Configure the project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Set Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

5. **Deploy**: Click "Deploy"

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create a MongoDB Atlas account** at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)

2. **Create a new cluster** (free tier available)

3. **Create a database user** with read/write permissions

4. **Whitelist your IP addresses** (0.0.0.0/0 for all IPs in development)

5. **Get the connection string** and use it as `MONGODB_URI`

## Post-Deployment Steps

1. **Update CORS settings** in your backend to allow your frontend domain

2. **Seed the database** with test data:
   ```bash
   # Connect to your deployed backend and run:
   npm run seed
   ```

3. **Test the application**:
   - Visit your frontend URL
   - Register a new account or use test credentials
   - Verify that leads are displayed correctly

## Test Credentials

After seeding the database:
- **Email**: test@example.com
- **Password**: password123

## Environment Variables Summary

### Backend
- `NODE_ENV`: production
- `PORT`: 5000 (or let the platform assign)
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string
- `JWT_EXPIRE`: 7d
- `FRONTEND_URL`: Your deployed frontend URL

### Frontend
- `VITE_API_URL`: Your deployed backend URL

## Troubleshooting

### Common Issues

1. **CORS errors**: Make sure `FRONTEND_URL` is set correctly in your backend
2. **Database connection**: Verify your MongoDB URI and network access
3. **Build failures**: Check that all dependencies are in `package.json`
4. **Authentication issues**: Ensure JWT_SECRET is set and consistent

### Health Check

Your backend should respond to: `GET /api/health`

Expected response:
```json
{
  "success": true,
  "message": "Lead Management System API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Security Notes

- Use strong, unique JWT secrets
- Enable HTTPS in production
- Regularly update dependencies
- Monitor your application logs
- Use environment variables for all sensitive data
