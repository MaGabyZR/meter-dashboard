# Deployment Guide

## Deploy to Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications, offering zero-configuration deployment.

### Option 1: Deploy via Vercel CLI (Fastest)

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from the project root:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **meter-dashboard** (or your preferred name)
   - Directory? **./** (press Enter)
   - Override settings? **N**

5. For production deployment:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard (Easiest)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "Add New Project"

4. Import your Git repository

5. Vercel will auto-detect Next.js and configure everything automatically

6. Click "Deploy"

Your app will be live at: `https://your-project-name.vercel.app`

### Option 3: Deploy via GitHub Integration

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/meter-dashboard.git
   git push -u origin main
   ```

2. Connect your GitHub account to Vercel at [vercel.com/new](https://vercel.com/new)

3. Select your repository and click "Import"

4. Vercel will automatically:
   - Detect Next.js configuration
   - Install dependencies
   - Run the build
   - Deploy to production

5. Every push to `main` will trigger automatic deployments

## Environment Variables

This project doesn't require any environment variables for basic functionality. All data is included in the repository.

## Build Configuration

Vercel automatically detects the following from `package.json`:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

No additional configuration needed!

## Post-Deployment

After deployment, you'll receive:
- **Production URL**: `https://your-project-name.vercel.app`
- **Preview URLs**: Automatic preview deployments for each branch/PR
- **Analytics**: Built-in performance monitoring
- **Automatic HTTPS**: SSL certificates included

## Troubleshooting

### Build Fails
- Check that all tests pass locally: `npm test`
- Verify build succeeds locally: `npm run build`
- Review build logs in Vercel dashboard

### TypeScript Errors
- Ensure `tsconfig.json` is properly configured
- Run `npm run build` locally to catch type errors

### Missing Dependencies
- Verify `package.json` includes all dependencies
- Run `npm install` to ensure lock file is up to date

## Alternative Deployment Platforms

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### AWS Amplify
1. Connect your Git repository
2. Amplify auto-detects Next.js
3. Deploy with one click

### Docker (Self-Hosted)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t meter-dashboard .
docker run -p 3000:3000 meter-dashboard
```
