# Quick Start: Deploy Eventra on Render

## 5-Minute Setup

### Step 1: Prepare Your Repository
```bash
# Make sure everything is committed and pushed to GitHub
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Set Up External Services

**MongoDB Atlas:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account → Create organization
3. Create cluster (M0 free tier)
4. Click "Connect" → Copy connection string
5. Replace `<password>` with your password

**Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Select Mail & App password
3. Copy the 16-character password

**JWT Secret:**
Generate a random string:
```bash
openssl rand -base64 32
# Copy the output
```

### Step 3: Deploy on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Select your GitHub repository
4. Fill in:
   - **Name:** `eventra` (or any name)
   - **Runtime:** Node
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free (or Starter)

### Step 4: Add Environment Variables

In Render dashboard, click **"Environment"** and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your MongoDB connection string from Step 2 |
| `JWT_SECRET` | Your generated JWT secret from Step 2 |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASS` | Your Gmail App Password from Step 2 |

### Step 5: Deploy

Click **"Deploy"** and wait (2-5 minutes).

Your app will be live at: `https://<your-service-name>.onrender.com` ✅

### Step 6: Test

1. Open your Render URL in browser
2. Register a new account
3. Try creating/booking an event
4. Check email for verification code

## Troubleshooting

**Build fails?** Check Render logs (Logs tab in dashboard)

**App won't start?** Verify all environment variables are correct

**Email not working?** Check that:
- Email user is your Gmail
- Email pass is from App Passwords (16 chars, no spaces)

For detailed guide, see [DEPLOYMENT.md](./DEPLOYMENT.md)
