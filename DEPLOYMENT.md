# Deployment Guide

Complete guide for deploying the Proxy Backend in different environments.

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Linux Server Deployment](#linux-server-deployment)
4. [Cloud Deployment](#cloud-deployment)
5. [Production Checklist](#production-checklist)

---

## Local Development

### Quick Start (Fastest)

```bash
# Clone and setup
git clone https://github.com/waylonorear/Proxy-backend.git
cd Proxy-backend
bash quickstart.sh
```

The quickstart script will:
- ✓ Check Node.js installation
- ✓ Install dependencies
- ✓ Create .env file
- ✓ Show next steps

### Manual Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit configuration
nano .env

# Run in development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

### Testing Locally

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test proxy with jq (pretty print)
bash test.sh

# Test specific endpoint
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}'
```

---

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f proxy

# Restart service
docker-compose restart proxy
```

### Using Docker CLI

```bash
# Build image
docker build -t proxy-backend:latest .

# Run container
docker run -d \
  --name proxy-backend \
  -p 3000:3000 \
  -e TARGET_URL=https://api.example.com \
  -e TARGET_V1=https://api.example.com/v1 \
  -e TARGET_V2=https://api.example.com/v2 \
  proxy-backend:latest

# View logs
docker logs -f proxy-backend

# Stop container
docker stop proxy-backend

# Remove container
docker rm proxy-backend
```

### Docker Environment Variables

```bash
# Run with multiple environment variables
docker run -d \
  --name proxy-backend \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e TARGET_URL=https://your-api.com \
  -e TARGET_V1=https://your-api.com/v1 \
  -e TARGET_V2=https://your-api.com/v2 \
  proxy-backend:latest
```

---

## Linux Server Deployment

### Prerequisites
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Setup Application

```bash
# Create application directory
sudo mkdir -p /opt/proxy-backend
cd /opt/proxy-backend

# Clone repository
sudo git clone https://github.com/waylonorear/Proxy-backend.git .

# Set permissions
sudo chown -R $USER:$USER /opt/proxy-backend

# Install dependencies
npm install --production

# Setup environment
cp .env.example .env
nano .env  # Edit with your URLs
```

### Using systemd (Auto-start on boot)

```bash
# Create systemd service file
sudo nano /etc/systemd/system/proxy-backend.service
```

Paste this content:

```ini
[Unit]
Description=Proxy Backend Server
After=network.target

[Service]
Type=simple
User=nobody
WorkingDirectory=/opt/proxy-backend
ExecStart=/usr/bin/node /opt/proxy-backend/server.js
Restart=on-failure
RestartSec=10

Environment="NODE_ENV=production"
Environment="PORT=3000"
Environment="TARGET_URL=https://api.example.com"
Environment="TARGET_V1=https://api.example.com/v1"
Environment="TARGET_V2=https://api.example.com/v2"

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable on boot
sudo systemctl enable proxy-backend

# Start service
sudo systemctl start proxy-backend

# Check status
sudo systemctl status proxy-backend

# View logs
sudo journalctl -u proxy-backend -f
```

### Using PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start server.js --name "proxy-backend"

# Save PM2 config
pm2 save

# Setup startup on reboot
pm2 startup

# View logs
pm2 logs proxy-backend

# Monitor
pm2 monit
```

### Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/proxy-backend
```

Paste this content:

```nginx
upstream proxy_backend {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://proxy_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and start:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/proxy-backend /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

### Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (already enabled by default)
sudo systemctl status certbot.timer
```

---

## Cloud Deployment

### AWS EC2

1. **Launch EC2 Instance**
   - Ubuntu 20.04 LTS
   - t3.micro or larger
   - Security group: Allow port 80, 443, 3000

2. **Connect and Deploy**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   
   # Follow Linux Server Deployment steps above
   ```

3. **Setup Elastic IP** (for static IP)
4. **Configure Route 53** (for domain)
5. **Setup CloudWatch** (for monitoring)

### Heroku

```bash
# Install Heroku CLI
curl https://cli.heroku.com/install.sh | sh

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set TARGET_URL=https://api.example.com
heroku config:set TARGET_V1=https://api.example.com/v1
heroku config:set TARGET_V2=https://api.example.com/v2

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### DigitalOcean App Platform

1. Connect GitHub repository
2. Set build command: `npm install`
3. Set run command: `npm start`
4. Add environment variables in dashboard
5. Deploy

### Docker Hub / Container Registry

```bash
# Build image
docker build -t your-username/proxy-backend:latest .

# Login to Docker Hub
docker login

# Push image
docker push your-username/proxy-backend:latest

# Run from registry
docker run -d \
  -p 3000:3000 \
  -e TARGET_URL=https://api.example.com \
  your-username/proxy-backend:latest
```

---

## Production Checklist

### Security
- [ ] Use HTTPS/SSL certificates
- [ ] Set `NODE_ENV=production`
- [ ] Use strong authentication for backend APIs
- [ ] Enable CORS only for trusted domains
- [ ] Implement rate limiting
- [ ] Use secrets management (not .env in production)
- [ ] Regular security audits
- [ ] Keep dependencies updated

### Performance
- [ ] Use Nginx/reverse proxy
- [ ] Enable caching headers
- [ ] Monitor response times
- [ ] Setup load balancing
- [ ] Use CDN for static content
- [ ] Monitor memory and CPU usage

### Monitoring & Logging
- [ ] Setup log aggregation (ELK, Datadog)
- [ ] Monitor error rates
- [ ] Setup health check monitoring
- [ ] Create alerts for critical issues
- [ ] Track performance metrics
- [ ] Setup uptime monitoring

### Deployment
- [ ] Automated backups
- [ ] Database backups (if applicable)
- [ ] Disaster recovery plan
- [ ] Rollback strategy
- [ ] Blue-green deployment
- [ ] Zero-downtime deployments

### Configuration
```bash
# Production .env template
PORT=3000
NODE_ENV=production
TARGET_URL=https://prod-api.example.com
TARGET_V1=https://prod-api.example.com/v1
TARGET_V2=https://prod-api.example.com/v2

# Logging
LOG_LEVEL=info
LOG_DIR=/var/log/proxy-backend
```

### Performance Tuning

```bash
# Increase file descriptors (for high traffic)
ulimit -n 65536

# Tune Node.js
node --max-old-space-size=4096 server.js

# Use cluster mode with PM2
pm2 start server.js -i max --name "proxy-backend"
```

---

## Troubleshooting

### Server won't start
```bash
# Check if port is in use
lsof -i :3000

# Check logs
npm run dev  # Run in foreground to see errors

# Verify Node.js
node --version
npm --version
```

### High memory usage
```bash
# Check memory
free -h

# Monitor with PM2
pm2 monit

# Restart service
systemctl restart proxy-backend
```

### SSL certificate issues
```bash
# Renew certificate
sudo certbot renew

# Check certificate expiry
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
```

### Backend connection fails
- Verify TARGET_URL is correct
- Check firewall rules
- Verify backend service is running
- Check network connectivity: `curl https://your-target-url`

---

## Support

For issues and questions:
- 📚 See [README.md](README.md)
- 🐛 Open an issue on GitHub
- 💬 Check documentation

---

**Last Updated:** 2026-08-24
**Version:** 1.0.0
