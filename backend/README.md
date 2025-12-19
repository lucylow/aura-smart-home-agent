# A.U.R.A. Backend

Minimal Node.js TypeScript backend for the A.U.R.A. smart home automation system. Features a planner/executor flow with mocked Tuya integration, JWT authentication, and WebSocket device status updates.

## Quick Start

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Server runs on `http://localhost:3000` by default.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | Secret for JWT signing | `devsecret` |
| `NODE_ENV` | Environment mode | `development` |
| `TUYA_CLIENT_ID` | Tuya API client ID (placeholder) | `placeholder` |
| `TUYA_CLIENT_SECRET` | Tuya API secret (placeholder) | `placeholder` |

## API Endpoints

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Login (get JWT token)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo"}'
```

### Create Plan
```bash
curl -X POST http://localhost:3000/api/plan \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"userId":"U123","goal":"goodnight"}'
```

### Execute Plan
```bash
curl -X POST http://localhost:3000/api/execute \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"userId":"U123","plan":{"name":"Goodnight Routine","steps":[{"deviceHint":"Bedroom Light","action":"turnOff","description":"Turn off the bedroom light"}],"requiresConfirmation":true}}'
```

### Execute Plan (Dry Run)
Preview execution without touching devices using `?dryRun=true` or `{ "dryRun": true }` in body:
```bash
curl -X POST "http://localhost:3000/api/execute?dryRun=true" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"userId":"U123","plan":{"name":"Test","steps":[{"deviceHint":"Bedroom Light","action":"turnOff","description":"Turn off light"}]}}'
```
Returns `simulated: true` for each step without calling TuyaService.

### Get Suggestions
```bash
curl http://localhost:3000/api/suggestions?homeId=H1
```

## WebSocket

Connect to the server using Socket.IO to receive real-time device status updates:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('device_status_update', (data) => {
  console.log('Device updated:', data.deviceId, data.status);
});
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm start` | Start production server |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm test` | Run Jest tests |
| `npm run docker:build` | Build Docker image |

## Running Tests

```bash
npm test
```

## Docker

Build and run with Docker:

```bash
npm run docker:build
docker run -p 3000:3000 -e JWT_SECRET=yoursecret aura-backend
```

Or use Docker Compose:

```bash
docker-compose up
```

## Frontend Integration

Point your frontend to `http://localhost:3000` for API calls. Set the environment variable:

```
REACT_APP_API_BASE=http://localhost:3000
```

## Mock Devices

The Tuya service stub includes 6 mock devices:
- Living Room Light (light)
- Bedroom Light (light)
- Thermostat (thermostat)
- Living Room TV (tv)
- Bedroom Blinds (blinds)
- Smart Speaker (speaker)

## Available Recipes

The planner recognizes these goals:
- `goodnight` - Turn off lights, lower thermostat, close blinds
- `movie time` - Dim lights, turn on TV, set speaker volume
- `wake up` - Open blinds, turn on lights, raise thermostat

Unrecognized goals return a `DIRECT_COMMAND` type plan.
