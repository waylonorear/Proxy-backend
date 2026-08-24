#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}   Proxy Backend - Quick Start Guide${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

# Step 1: Check Node.js
echo -e "${BLUE}Step 1: Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js is not installed${NC}"
  echo "Visit: https://nodejs.org/"
  exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"
echo -e "${GREEN}✓ npm $(npm -v)${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${BLUE}Step 2: Installing dependencies...${NC}"
if [ ! -d "node_modules" ]; then
  npm install
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
  fi
  echo -e "${GREEN}✓ Dependencies installed${NC}"
else
  echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi
echo ""

# Step 3: Setup .env file
echo -e "${BLUE}Step 3: Setting up .env file...${NC}"
if [ ! -f .env ]; then
  cp .env.example .env
  echo -e "${GREEN}✓ .env file created${NC}"
  echo -e "${YELLOW}⚠️  Edit .env with your target URLs${NC}"
else
  echo -e "${GREEN}✓ .env file already exists${NC}"
fi
echo ""

# Step 4: Show next steps
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo ""
echo "1. ${BLUE}Edit your configuration:${NC}"
echo "   nano .env"
echo ""
echo "2. ${BLUE}Run in development mode (with auto-reload):${NC}"
echo "   npm run dev"
echo ""
echo "3. ${BLUE}Or run in production mode:${NC}"
echo "   npm start"
echo ""
echo "4. ${BLUE}Or run with Docker:${NC}"
echo "   docker-compose up --build"
echo ""
echo -e "${YELLOW}🧪 Testing:${NC}"
echo "   curl http://localhost:3000/health"
echo ""
echo -e "${YELLOW}📚 Documentation:${NC}"
echo "   See README.md for detailed information"
echo ""
