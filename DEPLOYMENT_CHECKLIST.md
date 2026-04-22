# Eventra - Deployment Checklist

## Pre-Deployment Checklist

- [ ] All environment variables defined in `.env.example`
- [ ] MongoDB Atlas account created and connection string ready
- [ ] Gmail App Password generated for email functionality
- [ ] JWT_SECRET generated (use `openssl rand -base64 32`)
- [ ] GitHub repository created and initial push completed
- [ ] Render account created at https://render.com
- [ ] `.env` file is in `.gitignore` (never commit secrets)
- [ ] Node.js version specified in `.nvmrc` (18.17.0)
- [ ] `render.yaml` configuration file created
- [ ] All necessary dependencies listed in `package.json` files

## Build Configuration

- [x] Root `package.json` has correct build command: `npm run build`
- [x] Root `package.json` has correct start command: `npm start`
- [x] Client build output goes to `client/dist`
- [x] Server serves static files from `client/dist` in production
- [x] Server has `NODE_ENV` check for production build serving

## Environment Configuration

- [x] CORS properly configured for production
- [x] Axios client configured to use `/api` in production
- [x] Server listens on `process.env.PORT` (defaults to 5000)
- [x] MongoDB uses `process.env.MONGODB_URI`
- [x] JWT uses `process.env.JWT_SECRET`
- [x] Email uses `process.env.EMAIL_USER` and `process.env.EMAIL_PASS`

## Render-Specific Setup

- [ ] Create web service on Render dashboard
- [ ] Add all environment variables on Render
- [ ] Set `NODE_ENV` to `production`
- [ ] Set appropriate build and start commands
- [ ] Monitor initial deployment logs
- [ ] Test all functionality after deployment

## Post-Deployment Tasks

- [ ] Verify application loads at Render URL
- [ ] Test authentication flow
- [ ] Test event booking flow
- [ ] Test email notifications
- [ ] Check browser console for errors
- [ ] Check Render logs for server errors
- [ ] Test on mobile devices
- [ ] Set up custom domain (if applicable)

## Ongoing Maintenance

- [ ] Set up automated monitoring
- [ ] Configure error logging/tracking
- [ ] Schedule regular database backups
- [ ] Monitor application performance
- [ ] Keep dependencies updated

## Deployment Command

On Render, the build process will run:
```bash
npm run build
```

And the start process will run:
```bash
npm start
```

These are automatically detected from `package.json` at the root level.

## Important Notes

1. **First deployment may be slower** - Render caches dependencies for faster subsequent builds
2. **Free tier limitations** - Free services spin down after 15 minutes of inactivity
3. **Scaling** - Upgrade to paid plan for production with better performance
4. **Database** - Use MongoDB Atlas M0 tier (free) for development/testing

## Troubleshooting URLs

- Render Logs: Dashboard → Your Service → Logs tab
- MongoDB Atlas: https://cloud.mongodb.com
- Gmail App Passwords: https://myaccount.google.com/apppasswords
- Render Documentation: https://render.com/docs

## Support & Resources

- Render Docs: https://render.com/docs
- Express.js: https://expressjs.com
- React/Vite: https://vitejs.dev
- MongoDB: https://docs.mongodb.com
