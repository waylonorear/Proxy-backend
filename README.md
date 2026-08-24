# Proxy Backend

A lightweight HTTP proxy server built with Node.js and Express. This server forwards requests to configured backend services while handling CORS, logging, and error management.

## Features

- 🔄 HTTP request proxying
- 🌐 CORS support
- 📝 Request/response logging
- ⚙️ Environment-based configuration
- 🚀 Multiple proxy endpoints
- ❤️ Health check endpoint
- 🛡️ Error handling

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
git clone https://github.com/waylonorear/Proxy-backend.git
cd Proxy-backend
npm install
```

### Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and set your target URLs:
```env
PORT=3000
TARGET_URL=https://your-api.com
TARGET_V1=https://your-api.com/v1
TARGET_V2=https://your-api.com/v2
```

### Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and timestamp.

**Example:**
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-08-24T13:30:00.000Z"
}
```

### Generic Proxy
```
ALL /api/*
```
Forwards all requests to the `TARGET_URL` configured in `.env`

**Example:**
```bash
curl http://localhost:3000/api/users/123
# Proxies to: https://your-api.com/users/123
```

### Versioned Proxy (v1)
```
ALL /proxy/v1/*
```
Forwards requests to the `TARGET_V1` URL

**Example:**
```bash
curl http://localhost:3000/proxy/v1/data
# Proxies to: https://your-api.com/v1/data
```

### Versioned Proxy (v2)
```
ALL /proxy/v2/*
```
Forwards requests to the `TARGET_V2` URL

**Example:**
```bash
curl http://localhost:3000/proxy/v2/data
# Proxies to: https://your-api.com/v2/data
```

## Request Examples

### GET Request
```bash
curl http://localhost:3000/api/users
```

### POST Request
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}'
```

### With Custom Headers
```bash
curl -H "Authorization: Bearer token123" \
  http://localhost:3000/api/protected
```

## How It Works

1. Client sends a request to the proxy server
2. Server reads the target URL from environment variables
3. Request is forwarded to the target backend
4. Response is sent back to the client
5. All requests and errors are logged

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `TARGET_URL` | Generic proxy target | - |
| `TARGET_V1` | Version 1 API target | - |
| `TARGET_V2` | Version 2 API target | - |
| `NODE_ENV` | Environment mode | `development` |

## Error Handling

The server handles various error scenarios:

- **Missing target configuration** - Returns 404 with configuration error
- **Proxy errors** - Returns 500 with error details
- **Invalid endpoints** - Returns 404 with usage information

## Logging

Request logging is handled by Morgan middleware. All requests are logged with:
- HTTP method
- URL path
- Status code
- Response time
- Request size

## Development

To add new proxy routes, modify `server.js`:

```javascript
app.all('/custom/:id', (req, res) => {
  const targetUrl = 'https://your-backend.com';
  proxy.web(req, res, { target: targetUrl, prependPath: false });
});
```

## Deployment

### Docker (Optional)
Create a `Dockerfile` for containerized deployment:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production
Set environment variables securely:
```bash
export TARGET_URL=https://prod-api.example.com
export PORT=8080
npm start
```

## License

ISC

## Contributing

Feel free to submit issues and pull requests!
