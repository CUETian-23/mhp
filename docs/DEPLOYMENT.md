# Deployment Guide

This guide provides step-by-step instructions for deploying the Mental Health Platform to various environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Deployment](#local-development-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment (AWS)](#cloud-deployment-aws)
5. [Cloud Deployment (Heroku)](#cloud-deployment-heroku)
6. [Cloud Deployment (Vercel + Render)](#cloud-deployment-vercel--render)
7. [Production Checklist](#production-checklist)
8. [Environment Variables](#environment-variables)
9. [Database Setup](#database-setup)
10. [Security Configuration](#security-configuration)

## Prerequisites

Before deploying, ensure you have:

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Redis (v6 or higher)
- Git
- Domain name (for production)
- SSL certificate (for production)

## Local Development Deployment

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd mental-health-platform
```

### Step 2: Install Dependencies

```bash
npm run install:all
```

### Step 3: Set Up Environment Variables

Create `.env` files:

**Server `.env`**:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mental-health-platform
REDIS_URI=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
WEBAUTHN_RP_ID=localhost
WEBAUTHN_ORIGIN=http://localhost:3000
```

**Client `.env`**:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Start MongoDB and Redis

**Using Docker**:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
docker run -d -p 6379:6379 --name redis redis:latest
```

**Or install locally**:
- MongoDB: https://www.mongodb.com/try/download/community
- Redis: https://redis.io/download

### Step 5: Run the Application

```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Docker Deployment

### Step 1: Create Dockerfile for Server

Create `server/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
```

### Step 2: Create Dockerfile for Client

Create `client/Dockerfile`:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Step 3: Create nginx.conf

Create `client/nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://server:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 4: Create docker-compose.yml

Create `docker/docker-compose.yml`:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:latest
    container_name: redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  server:
    build:
      context: ../server
      dockerfile: Dockerfile
    container_name: server
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/mental-health-platform?authSource=admin
      - REDIS_URI=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRE=7d
      - WEBAUTHN_RP_ID=${DOMAIN}
      - WEBAUTHN_ORIGIN=https://${DOMAIN}
    depends_on:
      - mongodb
      - redis

  client:
    build:
      context: ../client
      dockerfile: Dockerfile
    container_name: client
    restart: unless-stopped
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=https://${DOMAIN}/api
    depends_on:
      - server

volumes:
  mongodb_data:
  redis_data:
```

### Step 5: Build and Run

```bash
cd docker
docker-compose up -d --build
```

## Cloud Deployment (AWS)

### Step 1: Set Up AWS Resources

**EC2 Instance**:
1. Launch an EC2 instance (Ubuntu 20.04 LTS)
2. Configure security groups to allow ports 80, 443, 22
3. Allocate an Elastic IP and associate it

**MongoDB Atlas**:
1. Create a free MongoDB Atlas account
2. Create a cluster
3. Whitelist your EC2 IP
4. Get connection string

**ElastiCache (Redis)**:
1. Create an ElastiCache Redis cluster
2. Configure security group
3. Get endpoint

### Step 2: Configure EC2 Instance

SSH into your EC2 instance:
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

Install dependencies:
```bash
sudo apt update
sudo apt install -y git nginx nodejs npm
sudo npm install -g pm2
```

### Step 3: Clone and Setup

```bash
git clone <your-repository-url>
cd mental-health-platform
npm run install:all
```

### Step 4: Configure Environment

Create `.env` files with production values:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mental-health-platform
REDIS_URI=redis://your-elasticache-endpoint:6379
JWT_SECRET=your-production-secret
JWT_EXPIRE=7d
WEBAUTHN_RP_ID=your-domain.com
WEBAUTHN_ORIGIN=https://your-domain.com
```

### Step 5: Build Client

```bash
cd client
npm run build
```

### Step 6: Configure Nginx

Create `/etc/nginx/sites-available/mental-health`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/ssl/certs/your-domain.crt;
    ssl_certificate_key /etc/ssl/private/your-domain.key;

    # Client
    location / {
        root /home/ubuntu/mental-health-platform/client/build;
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/mental-health /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Start Server with PM2

```bash
cd server
pm2 start index.js --name mental-health-server
pm2 save
pm2 startup
```

### Step 8: Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Cloud Deployment (Heroku)

### Step 1: Install Heroku CLI

```bash
npm install -g heroku
heroku login
```

### Step 2: Create Heroku Apps

```bash
heroku create mental-health-server
heroku create mental-health-client
```

### Step 3: Add Buildpacks

```bash
heroku buildpacks:set heroku/nodejs -a mental-health-server
heroku buildpacks:set mars/create-react-app -a mental-health-client
```

### Step 4: Add Add-ons

```bash
heroku addons:create mongolab:sandbox -a mental-health-server
heroku addons:create heroku-redis:hobby-dev -a mental-health-server
```

### Step 5: Configure Environment Variables

```bash
heroku config:set NODE_ENV=production -a mental-health-server
heroku config:set JWT_SECRET=your-secret -a mental-health-server
heroku config:set WEBAUTHN_RP_ID=your-app.herokuapp.com -a mental-health-server
heroku config:set WEBAUTHN_ORIGIN=https://your-app.herokuapp.com -a mental-health-server
heroku config:set REACT_APP_API_URL=https://mental-health-server.herokuapp.com/api -a mental-health-client
```

### Step 6: Deploy Server

```bash
git remote add heroku https://git.heroku.com/mental-health-server.git
git subtree push --prefix server heroku main
```

### Step 7: Deploy Client

```bash
git remote add heroku-client https://git.heroku.com/mental-health-client.git
git subtree push --prefix client heroku-client main
```

## Cloud Deployment (Vercel + Render)

### Step 1: Deploy Backend on Render

1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. Add environment variables
6. Deploy

### Step 2: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your repository
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Environment Variables**: `REACT_APP_API_URL`
4. Deploy

### Step 3: Configure Custom Domain

1. Add custom domain in Vercel
2. Update WebAuthn RP_ID and ORIGIN to match custom domain

## Production Checklist

Before going to production, ensure:

- [ ] Change all default passwords and secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Enable rate limiting
- [ ] Configure WebAuthn for production domain
- [ ] Test all authentication flows
- [ ] Test crisis escalation flows
- [ ] Set up analytics
- [ ] Configure CDN for static assets
- [ ] Enable compression
- [ ] Set up health checks
- [ ] Configure auto-scaling
- [ ] Review and update security headers
- [ ] Test API endpoints
- [ ] Verify database connections
- [ ] Test Redis caching
- [ ] Configure proper logging levels
- [ ] Set up alerting for critical errors

## Environment Variables

### Server Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/mental-health-platform
REDIS_URI=redis://redis-endpoint:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d

# WebAuthn
WEBAUTHN_RP_ID=your-domain.com
WEBAUTHN_ORIGIN=https://your-domain.com
```

### Client Environment Variables

```env
# API Configuration
REACT_APP_API_URL=https://your-domain.com/api
```

## Database Setup

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for cloud deployment)
5. Get connection string
6. Update `MONGODB_URI` in environment variables

### Redis Setup

**For local development**:
```bash
docker run -d -p 6379:6379 redis:latest
```

**For production (ElastiCache)**:
1. Go to AWS ElastiCache
2. Create Redis cluster
3. Configure security group
4. Get endpoint

**For production (Redis Cloud)**:
1. Create account at [Redis Cloud](https://redis.com/try-free)
2. Create database
3. Get connection string

## Security Configuration

### SSL/TLS Configuration

**Using Let's Encrypt**:
```bash
sudo certbot --nginx -d your-domain.com
```

**Manual SSL**:
1. Purchase SSL certificate
2. Upload certificate files
3. Configure nginx with SSL paths

### Security Headers

Add to nginx configuration:
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### WebAuthn Production Configuration

1. Ensure HTTPS is enabled
2. Update `WEBAUTHN_RP_ID` to your production domain
3. Update `WEBAUTHN_ORIGIN` to your production URL
4. Test with production domain

### Firewall Configuration

**AWS Security Groups**:
- Allow HTTP (80) from 0.0.0.0/0
- Allow HTTPS (443) from 0.0.0.0/0
- Allow SSH (22) from your IP only
- Allow internal traffic (5000) from server only

## Monitoring and Logging

### PM2 Monitoring

```bash
pm2 monit
pm2 logs mental-health-server
```

### Application Monitoring

Consider using:
- **Sentry**: Error tracking
- **Datadog**: APM and monitoring
- **New Relic**: Performance monitoring
- **LogRocket**: Frontend monitoring

### Log Rotation

Configure log rotation for PM2:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Backup Strategy

### MongoDB Backup

**Automated Backup**:
- Enable MongoDB Atlas automated backups
- Configure retention period (30 days recommended)

**Manual Backup**:
```bash
mongodump --uri="mongodb://user:pass@host:port/db" --out=/backup/path
```

### Redis Backup

Redis is typically ephemeral, but you can:
- Enable Redis persistence (RDB/AOF)
- Use Redis Cloud with built-in backups

## Troubleshooting

### Common Issues

**Server won't start**:
- Check environment variables
- Verify database connections
- Check port availability

**WebAuthn not working**:
- Ensure HTTPS is enabled
- Verify RP_ID matches domain
- Check browser compatibility

**Database connection errors**:
- Verify connection string
- Check IP whitelist
- Ensure database is running

### Health Check

```bash
curl https://your-domain.com/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Scaling

### Horizontal Scaling

**Load Balancer**:
- Use AWS ALB or nginx load balancer
- Configure health checks
- Set up sticky sessions for WebAuthn

**Database Scaling**:
- Use MongoDB Atlas with sharding
- Implement read replicas
- Use Redis cluster for caching

### Vertical Scaling

- Increase EC2 instance size
- Add more RAM for Redis
- Optimize database queries

## Support

For deployment issues:
- Check logs: `pm2 logs`
- Review error tracking dashboard
- Consult documentation
- Open GitHub issue
