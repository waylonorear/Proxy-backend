#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Testing Proxy Backend...${NC}"
echo ""

# Test health endpoint
echo -e "${BLUE}Testing health endpoint...${NC}"
curl -s http://localhost:3000/health | jq . || echo "Health check failed"
echo ""

# Test 404 endpoint
echo -e "${BLUE}Testing 404 endpoint...${NC}"
curl -s http://localhost:3000/notfound | jq . || echo "404 test completed"
echo ""

# Test API endpoint (will fail without proper TARGET_URL)
echo -e "${BLUE}Testing API proxy endpoint...${NC}"
curl -s http://localhost:3000/api/test | jq . || echo "API proxy test completed (expected to fail if TARGET_URL not set)"
echo ""

echo -e "${GREEN}✅ Testing complete!${NC}"
