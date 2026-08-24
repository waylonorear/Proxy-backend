# 🚀 Complete Guide: Running Proxy Backend + Test API

This guide shows you how to run everything without using the terminal.

---

## **What You'll Have Running**

1. **Test API Server** (Port 3001) - Fake backend with sample data
2. **Proxy Backend Server** (Port 3000) - Routes requests to the Test API

```
Your Browser
    ↓
Proxy (Port 3000)
    ↓
Test API (Port 3001)
```

---

## **Step 1: Download the Project**

### Using GitHub Web Interface:
1. Go to: https://github.com/waylonorear/Proxy-backend
2. Click **Code** (green button)
3. Click **Download ZIP**
4. Extract the ZIP file to your computer

Example: `C:\Users\YourName\Desktop\Proxy-backend` (Windows)  
Or: `/Users/YourName/Desktop/Proxy-backend` (Mac)

---

## **Step 2: Install Node.js (One-Time Setup)**

### Windows:
1. Go to: https://nodejs.org
2. Download the **LTS version** (Long Term Support)
3. Run the installer
4. Click **Next** through all steps
5. Check "Add to PATH" before installing
6. Click **Install**

### Mac:
1. Go to: https://nodejs.org
2. Download the **LTS version**
3. Run the installer
4. Follow all prompts

### Verify Installation:
Open a terminal/command prompt and type:
```
node --version
npm --version
```

If you see version numbers, you're good! ✅

---

## **Step 3: Install Dependencies**

Open a terminal/command prompt and navigate to your project:

**Windows Command Prompt:**
```
cd C:\Users\YourName\Desktop\Proxy-backend
npm install
```

**Mac Terminal:**
```
cd /Users/YourName/Desktop/Proxy-backend
npm install
```

Wait for this to finish (1-2 minutes). You'll see lots of text.

---

## **Step 4: Start the Test API**

In your terminal, run:
```
node test-api.js
```

You should see:
```
🧪 Test API running on http://localhost:3001

📚 Available endpoints:
  GET  /health           - Health check
  GET  /users            - Get all users
  GET  /users/:id        - Get single user
  POST /users            - Create user
  ...
```

✅ **Test API is running!** Keep this terminal open.

---

## **Step 5: Start the Proxy Backend (New Terminal)**

Open a **NEW** terminal/command prompt and navigate to your project again:

**Windows:**
```
cd C:\Users\YourName\Desktop\Proxy-backend
npm run dev
```

**Mac:**
```
cd /Users/YourName/Desktop/Proxy-backend
npm run dev
```

You should see:
```
Proxy server running on http://localhost:3000
Available endpoints:
  GET /health - Health check
  ALL /proxy/v1/* - Proxy to TARGET_V1 URL
  ALL /proxy/v2/* - Proxy to TARGET_V2 URL
  ALL /api/* - Proxy to TARGET_URL
```

✅ **Proxy Backend is running!**

---

## **Step 6: Test Everything**

Now you have **2 terminals running**:
- **Terminal 1:** Test API (Port 3001)
- **Terminal 2:** Proxy Backend (Port 3000)

Open a **THIRD terminal** to test:

```bash
# Test Proxy Health
curl http://localhost:3000/health

# Get all users (through proxy)
curl http://localhost:3000/api/users

# Get single user
curl http://localhost:3000/api/users/1

# Create a new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com","role":"admin"}'

# Get all posts
curl http://localhost:3000/api/posts

# Like a post
curl -X POST http://localhost:3000/api/posts/1/like

# Get all products
curl http://localhost:3000/api/products

# Search
curl http://localhost:3000/api/search/john
```

---

## **Using Web Browser (Easier)**

Instead of terminal commands, use your web browser:

### Test API Directly (No Proxy):
- Health: http://localhost:3001/health
- Users: http://localhost:3001/users
- Posts: http://localhost:3001/posts
- Products: http://localhost:3001/products

### Through Proxy:
- Health: http://localhost:3000/health
- Users: http://localhost:3000/api/users
- Posts: http://localhost:3000/api/posts
- Products: http://localhost:3000/api/products

Just copy and paste these URLs into your browser!

---

## **Stopping Everything**

When you want to stop:

**In each terminal running a server, press:**
```
Ctrl + C
```

Both servers will stop.

---

## **Troubleshooting**

### "Port already in use" Error

**Problem:** You already have something running on port 3000 or 3001.

**Solution:** Change the port in the terminal command:

For Test API:
```
TEST_API_PORT=3003 node test-api.js
```

For Proxy Backend:
```
PORT=3002 npm run dev
```

Then update your .env file to match:
```
TARGET_URL=http://localhost:3003
```

---

### "Node command not found"

**Problem:** Node.js isn't installed or not in PATH.

**Solution:** 
1. Download Node.js again: https://nodejs.org
2. Make sure to check "Add to PATH"
3. Restart your terminal

---

### "npm install taking too long"

This is normal! It can take 2-5 minutes depending on internet speed. Just wait. ✅

---

## **Next Steps**

### Make API Requests Programmatically

Create a file called `test-requests.js`:

```javascript
// Test a user creation
fetch('http://localhost:3000/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin'
  })
})
.then(r => r.json())
.then(data => console.log('User created:', data));
```

Then run:
```
node test-requests.js
```

---

## **System Requirements**

- **RAM:** 512 MB minimum
- **Disk Space:** 500 MB
- **Internet:** Only needed for setup

---

## **Files You Have Now**

| File | Purpose |
|------|---------|
| `server.js` | Proxy Backend server |
| `test-api.js` | Test API server |
| `package.json` | Dependencies list |
| `.env` | Configuration |
| `README.md` | Main documentation |
| `DEPLOYMENT.md` | Deployment guide |

---

## **Example Workflow**

### Day 1: Setup
```
1. Download project
2. npm install
3. node test-api.js (Terminal 1)
4. npm run dev (Terminal 2)
5. Test with browser or curl
```

### Day 2: Development
```
1. Open 2 terminals
2. Start both servers
3. Make changes to test-api.js (adds new endpoints)
4. Restart servers to see changes
5. Test through proxy
```

### Day 3: Production
```
1. Connect to real backend API
2. Update .env file
3. Deploy to cloud (Heroku, AWS, etc.)
```

---

## **Common API Testing Examples**

### Get All Users
```
http://localhost:3000/api/users
```
Returns: List of all users

### Get Single User
```
http://localhost:3000/api/users/1
```
Returns: User with ID 1

### Search
```
http://localhost:3000/api/search/john
```
Returns: All users, posts, and products matching "john"

### Health Check
```
http://localhost:3000/health
```
Returns: Server status

---

## **Summary**

✅ You can now:
- Run a complete proxy + API system locally
- Test request routing
- Practice API development
- Build real features on top of this

**Happy coding!** 🎉

---

**Questions?** Check README.md or DEPLOYMENT.md for more info.

**Last Updated:** 2026-08-24
