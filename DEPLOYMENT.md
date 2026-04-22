# Render Deployment Guide for Eventra

## Prerequisites
- MongoDB Atlas account (free tier available)
- Gmail account with App Password enabled
- Render account (free tier available)

## Environment Variables Setup

Before deploying, gather these environment variables:

### 1. **MONGODB_URI**
   - Create a MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
   - Get the connection string from Atlas
   - Format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/eventra?retryWrites=true&w=majority`

### 2. **JWT_SECRET**
   - Generate a strong random string (min 32 characters)
   - Use: `openssl rand -base64 32` or similar

### 3. **EMAIL_USER** & **EMAIL_PASS**
   - Use your Gmail address
   - Enable 2FA on your Gmail account
   - Generate an App Password: https://myaccount.google.com/apppasswords
   - Use the 16-character password as `EMAIL_PASS`

## Deployment Steps

### Option 1: Deploy from Git (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   - Name: `eventra-app` (or your preferred name)
   - Runtime: Node
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Plan: Free (or Starter for better reliability)

4. **Add Environment Variables**
   - In Render dashboard, go to the service
   - Click "Environment"
   - Add these variables:
     - `NODE_ENV`: `production`
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret
     - `EMAIL_USER`: Your Gmail address
     - `EMAIL_PASS`: Your Gmail App Password
     - `PORT`: `5000` (optional, defaults to 5000)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build and deployment to complete
   - Your app will be available at `https://<your-service-name>.onrender.com`

### Option 2: Deploy using render.yaml

1. **Push with render.yaml**
   ```bash
   git add .
   git commit -m "Add render.yaml configuration"
   git push origin main
   ```

2. **Create service from repo**
   - Go to Render dashboard
   - Click "New +" → "Web Service"
   - Select your repository
   - Render will automatically detect render.yaml
   - Configure environment variables as in Option 1

## Post-Deployment

### 1. **Test the Application**
   - Visit `https://<your-service-name>.onrender.com`
   - Test login/registration
   - Test booking functionality

### 2. **Monitor Logs**
   - In Render dashboard, click "Logs"
   - Check for any errors or warnings

### 3. **Initial Database Setup**
   - Seed the database with sample events:
   ```bash
   # Run seed script (if needed)
   node server/seed.js
   ```
   - Or create events through the admin dashboard

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Ensure `npm install` completes successfully
- Check logs in Render dashboard

### Application Won't Start
- Verify `MONGODB_URI` is correct
- Check that all required environment variables are set
- Look for errors in the Render logs

### Email Not Sending
- Verify `EMAIL_USER` and `EMAIL_PASS` are correct
- Ensure Gmail App Password is properly generated
- Check server logs for email errors

### Frontend Not Loading
- Make sure client build was successful
- Verify `NODE_ENV=production` is set
- Check if dist folder was created

## Performance Optimization

- Use Render's Pro plan for better performance on production
- Consider using MongoDB Atlas M0 tier (free) for development
- Enable Render's auto-scaling if needed

## Custom Domain (Optional)

1. In Render dashboard, go to "Settings"
2. Click "Add Custom Domain"
3. Follow DNS configuration instructions from your domain provider

## Database Backups

- MongoDB Atlas automatically creates backups
- Download backups from Atlas dashboard as needed

## Updating Your App

Simply push changes to GitHub:
```bash
git add .
git commit -m "Your message"
git push origin main
```

Render will automatically deploy the latest version!
