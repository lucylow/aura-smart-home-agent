# A.U.R.A. Backend - Smart Home Executive AI Agent

**A.U.R.A.** (Autonomous Unified Residential Assistant) is a cloud-based smart home orchestrator that uses a multi-agent architecture to intelligently control Tuya-powered IoT devices. Built for the Tuya AI Innovators Hackathon 2025.

## Overview

The A.U.R.A. backend implements an **Orchestrator-Specialist** multi-agent pattern that translates high-level natural language goals into coordinated device actions across your smart home.

### Key Features

- **Multi-Agent Architecture**: Orchestrator coordinates specialized agents (Security, Ambiance, Energy)
- **Tuya Integration**: Native support for TuyaOpen/TuyaOS devices via Tuya Cloud APIs
- **Context-Aware**: Adapts plans based on time, weather, occupancy, and environmental conditions
- **LLM-Powered**: Natural language intent parsing and dynamic plan generation
- **Demo & Live Modes**: Mock devices for demos or real Tuya device control

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  OrchestratorAgent                      │
│  • Receives natural language goals                     │
│  • Classifies intent using LLM                         │
│  • Generates multi-step execution plans                │
│  • Applies context-based adjustments                   │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────┴────────┬────────────────┐
        │                 │                │
┌───────▼──────┐  ┌──────▼──────┐  ┌─────▼────────┐
│  Security    │  │  Ambiance   │  │   Energy     │
│  Specialist  │  │  Specialist │  │  Specialist  │
│              │  │             │  │              │
│ • Locks      │  │ • Lights    │  │ • Thermostat │
│ • Sensors    │  │ • Blinds    │  │ • Power mgmt │
│ • Alarms     │  │ • Media     │  │ • Eco modes  │
└──────┬───────┘  └──────┬──────┘  └──────┬───────┘
       │                 │                │
       └─────────────────┴────────────────┘
                         │
                ┌────────▼─────────┐
                │   TuyaService    │
                │  • Device mgmt   │
                │  • Command exec  │
                │  • Live/Demo     │
                └──────────────────┘
```

## Quick Start

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Server runs on `http://localhost:3000` by default.

## Configuration

### Environment Variables

See `.env.example` for all configuration options:

#### Operating Modes

- **Demo Mode** (`MODE=demo`, `TUYA_MOCK=true`): Uses mock devices, no real Tuya account needed
- **Live Mode** (`MODE=production`, `TUYA_MOCK=false`): Controls real Tuya devices

#### Tuya Configuration

For live mode, obtain credentials from [Tuya IoT Platform](https://iot.tuya.com/cloud/):

```env
TUYA_CLIENT_ID=your_client_id
TUYA_CLIENT_SECRET=your_client_secret
TUYA_REGION=us  # or eu, cn, in
TUYA_ACCESS_URL=https://openapi.tuyaus.com
```

#### LLM Configuration

```env
LLM_PROVIDER=rule-based  # or openai, groq, anthropic
LLM_API_KEY=your_api_key
LLM_MODEL=gpt-4
```

## API Endpoints

### New AURA Endpoints

#### POST `/api/aura/goal`
Submit a natural language goal and receive an execution plan.

**Request**:
```json
{
  "text": "Movie time in the living room",
  "userId": "demo-user-1"
}
```

**Response**:
```json
{
  "ok": true,
  "planId": "plan_1234567890_abc123",
  "plan": {
    "goal": "Movie time in the living room",
    "goalType": "movie_time",
    "steps": [
      {
        "specialist": "AmbianceSpecialist",
        "action": "set_scene",
        "params": { "lights": "dim", "brightness": 20 }
      }
    ]
  }
}
```

#### POST `/api/aura/plan/:planId/execute`
Execute a stored plan.

#### GET `/api/aura/plan/:planId`
Get plan details and execution status.

#### GET `/api/aura/devices`
List all available devices.

#### GET `/api/aura/status`
Get system status and agent readiness.

### Legacy Endpoints

The original `/api/plan` and `/api/execute` endpoints remain available for backward compatibility.

## Demo Scenarios

### 1. Movie Time
```bash
curl -X POST http://localhost:3000/api/aura/goal \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Movie time", "userId": "demo-user"}'
```

**Expected behavior**: Dim lights, close blinds, optimize energy, lock doors

### 2. Goodnight
```bash
curl -X POST http://localhost:3000/api/aura/goal \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Goodnight", "userId": "demo-user"}'
```

**Expected behavior**: Turn off main lights, enable night lights, arm security, adjust thermostat

### 3. Leaving Home
```bash
curl -X POST http://localhost:3000/api/aura/goal \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Leaving home", "userId": "demo-user"}'
```

**Expected behavior**: Turn off all devices, eco mode, lock all doors, arm full security

## Project Structure

```
backend/
├── src/
│   ├── agents/              # Multi-agent system
│   │   ├── OrchestratorAgent.ts
│   │   ├── SecuritySpecialist.ts
│   │   ├── AmbianceSpecialist.ts
│   │   └── EnergySpecialist.ts
│   ├── services/            # Core services
│   │   ├── tuya.service.ts      # Tuya Cloud integration
│   │   ├── LLMService.ts        # LLM integration
│   │   ├── ContextService.ts    # Environmental context
│   │   ├── executor.service.ts  # Legacy executor
│   │   ├── planner.service.ts   # Legacy planner
│   │   └── learning.service.ts  # Learning/suggestions
│   ├── routes/              # API routes
│   │   ├── aura.routes.ts       # New AURA endpoints
│   │   └── plan.routes.ts       # Legacy endpoints
│   └── index.ts             # Entry point
├── test/                    # Tests
└── .env.example             # Configuration template
```

## Testing

```bash
npm test
```

## Docker

```bash
docker-compose up
```

## Hackathon Alignment

This backend demonstrates:

1. **Cloud-Based AI Agent**: Fully cloud-orchestrated
2. **Multi-Agent Pattern**: Orchestrator-Specialist architecture
3. **TuyaOpen Integration**: Native Tuya Cloud API support
4. **AI Integration**: LLM-powered intent parsing
5. **Practical Application**: Real-world smart home scenarios

## Links

- [Tuya AI Innovators Hackathon](https://tuya-ai-innovators-hackathon.devpost.com/)
- [GitHub Repository](https://github.com/lucylow/aura-smart-home-agent)
- [Live Demo](https://tuya-aura.lovable.app/)
