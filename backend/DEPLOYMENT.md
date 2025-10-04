# HappyTails Backend - Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Firebase Configuration](#firebase-configuration)
5. [Gemini AI Configuration](#gemini-ai-configuration)
6. [Deployment Options](#deployment-options)
7. [Production Checklist](#production-checklist)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Node.js**: v18.x or higher
- **MongoDB**: v6.0 or higher
- **npm**: v9.x or higher
- **Memory**: Minimum 2GB RAM
- **Storage**: Minimum 10GB available space

### Required Accounts

- Firebase project (for authentication)
- Google Cloud account (for Gemini AI)
- MongoDB Atlas account (for cloud database) OR local MongoDB installation

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/happytails.git
cd happytails/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure all required variables (see sections below).

## Database Setup

### Option A: MongoDB Atlas (Cloud - Recommended for Production)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free account or sign in

2. **Create Cluster**
   - Click "Build a Cluster"
   - Choose your cloud provider and region
   - Select cluster tier (M0 free tier for development)
   - Create cluster

3. **Set Up Database Access**
   - Navigate to "Database Access"
   - Add new database user
   - Set username and password (save these!)
   - Grant "Read and write to any database" role

4. **Configure Network Access**
   - Navigate to "Network Access"
   - Add IP Address
   - For development: "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Whitelist your server's IP address

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with your database name (e.g., `happytails`)

6. **Update .env**
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/happytails?retryWrites=true&w=majority
   ```

### Option B: Local MongoDB

1. **Install MongoDB**
   - [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Install and start MongoDB service

2. **Create Database**
   ```bash
   mongosh
   use happytails
   db.createCollection("users")
   ```

3. **Update .env**
   ```bash
   MONGODB_URI=mongodb://localhost:27017/happytails
   ```

## Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "HappyTails")
4. Disable Google Analytics (optional)
5. Create project

### 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get Started"
3. Enable authentication providers you want to support:
   - Email/Password
   - Google
   - Facebook
   - etc.

### 3. Generate Service Account Key

1. Go to Project Settings (gear icon) > Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. Save it securely (DO NOT commit to git!)

### 4. Configure Environment Variables

From the downloaded JSON file, extract:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour..Private..Key..Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

**Important**: Keep the `\n` characters in the private key string.

### 5. Configure Firebase in Frontend

Update your frontend configuration to use the same Firebase project. Get config from:
- Firebase Console > Project Settings > General > Your apps > Web app > Config

## Gemini AI Configuration

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Select or create a Google Cloud project
5. Copy the API key

### 2. Update .env

```bash
GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Test Gemini Integration

```bash
npm run dev
```

Make a test request to `/api/symptom-checker/analyze`

## Deployment Options

### Option 1: PM2 (Recommended for VPS/EC2)

#### Install PM2

```bash
npm install -g pm2
```

#### Start Application

```bash
# Development
pm2 start ecosystem.config.js

# Production
pm2 start ecosystem.config.js --env production
```

#### PM2 Commands

```bash
# View logs
pm2 logs happytails-api

# Monitor
pm2 monit

# Stop
pm2 stop happytails-api

# Restart
pm2 restart happytails-api

# Delete
pm2 delete happytails-api

# Save process list
pm2 save

# Setup startup script
pm2 startup
```

### Option 2: Docker

#### Build Image

```bash
docker build -t happytails-backend .
```

#### Run Container

```bash
docker run -d \
  --name happytails-api \
  -p 5000:5000 \
  --env-file .env \
  happytails-backend
```

#### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 3: Cloud Platforms

#### Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create happytails-backend`
4. Set environment variables: `heroku config:set MONGODB_URI=...`
5. Deploy: `git push heroku main`

#### AWS EC2

1. Launch EC2 instance (Ubuntu 22.04 recommended)
2. SSH into instance
3. Install Node.js and MongoDB
4. Clone repository
5. Configure environment variables
6. Use PM2 to run application
7. Configure Nginx as reverse proxy (optional)

#### DigitalOcean

1. Create Droplet (Node.js one-click app)
2. SSH into droplet
3. Clone repository
4. Configure environment variables
5. Use PM2 to run application

#### Render/Railway/Fly.io

Follow platform-specific Node.js deployment guides.

## Production Checklist

### Security

- [ ] Set `NODE_ENV=production`
- [ ] Use strong, unique passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS with specific origins
- [ ] Set `TRUST_PROXY=true` if behind reverse proxy
- [ ] Rotate API keys regularly
- [ ] Review and update rate limits
- [ ] Enable MongoDB authentication
- [ ] Keep dependencies updated (`npm audit`)
- [ ] Implement firewall rules

### Performance

- [ ] Use MongoDB indexes
- [ ] Enable compression (gzip)
- [ ] Use CDN for static assets
- [ ] Implement caching (Redis)
- [ ] Monitor memory usage
- [ ] Use PM2 cluster mode
- [ ] Optimize database queries
- [ ] Implement request timeouts

### Monitoring

- [ ] Set up error tracking (Sentry, Rollbar)
- [ ] Configure log aggregation (LogDNA, Papertrail)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Monitor server metrics (CPU, RAM, disk)
- [ ] Set up alerts for critical errors
- [ ] Monitor API response times
- [ ] Track database performance

### Backup

- [ ] Enable MongoDB Atlas automatic backups
- [ ] Back up environment variables securely
- [ ] Document recovery procedures
- [ ] Test backup restoration
- [ ] Store backups in multiple locations

### Documentation

- [ ] Update API documentation
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document environment variables
- [ ] Update README with production info

## Monitoring and Maintenance

### Health Checks

The API provides health check endpoints:

```bash
# Basic health check
GET http://your-domain.com/

# Detailed health check
GET http://your-domain.com/api/health
```

Response includes:
- Uptime
- Memory usage
- Environment
- API version

### Logs

Logs are stored in the `logs/` directory:
- `combined.log`: All logs
- `error.log`: Error logs only
- `warn.log`: Warning logs
- `exceptions.log`: Uncaught exceptions
- `rejections.log`: Unhandled promise rejections

### Log Rotation

Logs are automatically rotated when they reach 5MB.

### Monitoring Tools

Recommended tools:
- **PM2 Plus**: Process monitoring
- **New Relic**: Application performance
- **Datadog**: Infrastructure monitoring
- **Sentry**: Error tracking
- **LogDNA**: Log management

## Troubleshooting

### Common Issues

#### MongoDB Connection Failed

```bash
# Check MongoDB is running
sudo systemctl status mongod

# Check connection string in .env
# Verify IP whitelist in MongoDB Atlas
# Check firewall rules
```

#### Firebase Authentication Error

```bash
# Verify FIREBASE_PRIVATE_KEY format (keep \n characters)
# Check Firebase project ID
# Verify service account has proper permissions
```

#### Gemini API Not Working

```bash
# Verify API key is valid
# Check API quota limits
# Verify billing is enabled in Google Cloud
```

#### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process or change PORT in .env
```

#### High Memory Usage

```bash
# Check for memory leaks
pm2 monit

# Increase max memory in ecosystem.config.js
# Restart application
pm2 restart happytails-api
```

### Debug Mode

Enable debug logging:

```bash
LOG_LEVEL=debug npm run dev
```

### Support

For deployment issues:
- Check logs: `pm2 logs` or `docker logs`
- Review error messages
- Consult API documentation
- Check GitHub issues
- Contact team

## Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/happytails/backend
            git pull origin main
            npm install
            pm2 restart happytails-api
```

## Performance Optimization

### Enable Compression

Install compression middleware:

```bash
npm install compression
```

Add to `server.js`:

```javascript
const compression = require('compression');
app.use(compression());
```

### Database Indexing

Ensure indexes are created on frequently queried fields (already implemented in models).

### Caching

Consider implementing Redis for caching:

```bash
npm install redis
```

## Scaling

### Horizontal Scaling

Use PM2 cluster mode:

```bash
pm2 start ecosystem.config.js -i max
```

### Load Balancing

Use Nginx as a reverse proxy and load balancer:

```nginx
upstream happytails {
    server localhost:5000;
    server localhost:5001;
    server localhost:5002;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://happytails;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Final Notes

- Always test in a staging environment first
- Keep backups of production data
- Monitor application performance
- Stay updated with security patches
- Document any custom configurations
- Have a rollback plan

For questions or issues, refer to:
- API Documentation: `http://your-domain.com/api-docs`
- Main README: `../README.md`
- Testing Guide: `./TESTING.md`

---

**Last Updated**: October 2025
**Version**: 1.0.0
