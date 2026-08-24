#!/bin/bash

echo "🚀 Setting up Proxy Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js first."
  echo "Visit: https://nodejs.org/"
  exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo "✓ npm version: $(npm -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
  echo "❌ Failed to install dependencies"
  exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo ""
  echo "📝 Creating .env file from .env.example..."
  cp .env.example .env
  echo "✓ .env file created. Please edit it with your target URLs."
else
  echo "✓ .env file already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your target URLs"
echo "2. Run: npm start (for production)"
echo "3. Or run: npm run dev (for development with auto-reload)"
echo ""
echo "Server will run on http://localhost:3000"
