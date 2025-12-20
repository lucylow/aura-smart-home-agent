// backend/index.ts
import express, { Request, Response } from 'express';
import { TuyaService } from './services/TuyaService';
import { LLMService } from './services/LLMService';
import { ContextService } from './services/ContextService';
import { DeviceRegistry } from './services/DeviceRegistry';
import { VoiceCloningService } from './services/VoiceCloningService';
import { ExecutionEngine } from './services/ExecutionEngine';
import { OrchestratorAgent } from './agents/OrchestratorAgent';
import { AmbianceSpecialist } from './agents/AmbianceSpecialist';
import { ISpecialistAgent } from './agents/types';

// --- Configuration (Mocked Environment Variables) ---
const TUYA_CLIENT_ID = process.env.TUYA_CLIENT_ID || 'mock-tuya-id';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'mock-openai-key';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'mock-elevenlabs-key';
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'mock-weather-key';
const MODE = (process.env.MODE as 'demo' | 'live') || 'demo';

// --- Service Initialization ---
const tuyaService = new TuyaService(MODE);
const llmService = new LLMService(OPENAI_API_KEY);
const contextService = new ContextService(WEATHER_API_KEY);
const deviceRegistry = new DeviceRegistry();
const voiceCloningService = new VoiceCloningService(ELEVENLABS_API_KEY);

// --- Agent Initialization ---
const ambianceSpecialist = new AmbianceSpecialist(tuyaService, contextService, deviceRegistry);

// Mock other specialists for now
const specialists: Record<string, ISpecialistAgent> = {
  AmbianceSpecialist: ambianceSpecialist,
  SecuritySpecialist: {
    enrichStep: async (step) => ({ ...step, retryPolicy: { maxAttempts: 1, backoffMs: 0 }, validation: { preCheck: 'none', postCheck: 'none' } }),
    executeStep: async (step) => ({ status: 'mock-success', device: step.devices[0] })
  },
  EnergySpecialist: {
    enrichStep: async (step) => ({ ...step, retryPolicy: { maxAttempts: 1, backoffMs: 0 }, validation: { preCheck: 'none', postCheck: 'none' } }),
    executeStep: async (step) => ({ status: 'mock-success', device: step.devices[0] })
  },
  WellnessSpecialist: {
    enrichStep: async (step) => ({ ...step, retryPolicy: { maxAttempts: 1, backoffMs: 0 }, validation: { preCheck: 'none', postCheck: 'none' } }),
    executeStep: async (step) => ({ status: 'mock-success', device: step.devices[0] })
  },
};

const orchestratorAgent = new OrchestratorAgent(llmService, contextService, deviceRegistry, specialists);
const executionEngine = new ExecutionEngine(tuyaService, voiceCloningService, specialists);

// --- Express App Setup ---
const app = express();
const PORT = 3001;

app.use(express.json());

// CORS middleware (essential for frontend communication)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// --- Routes (Simplified to match Edge Function calls) ---

// POST /api/aura/goal - Creates a plan
app.post('/api/aura/goal', async (req: Request, res: Response) => {
  try {
    const { text: goalText, userId } = req.body;
    if (!goalText || !userId) {
      return res.status(400).json({ error: 'Missing goalText or userId' });
    }

    const plan = await orchestratorAgent.createPlan(goalText, userId);

    res.json({
      ok: true,
      planId: plan.planId,
      goalText: plan.goal,
      steps: plan.steps,
    });
  } catch (error: any) {
    console.error('Error creating plan:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// POST /api/aura/plan/:planId/execute - Executes a plan
app.post('/api/aura/plan/:planId/execute', async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const { userId, enableVoiceFeedback } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    // NOTE: In a real app, the plan would be fetched from the DB here
    // For this mock, we use a hardcoded planId in the ExecutionEngine
    const executionLog = await executionEngine.executePlan(planId, userId, enableVoiceFeedback);

    res.json({
      ok: true,
      planId,
      overallStatus: executionLog.overallStatus,
      steps: executionLog.steps,
      duration: executionLog.completedAt!.getTime() - executionLog.startedAt.getTime()
    });
  } catch (error: any) {
    console.error('Error executing plan:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// GET /api/aura/devices - Lists devices (for DeviceControlPage)
app.get('/api/aura/devices', (req: Request, res: Response) => {
  const userId = req.query.userId as string; // Assume userId is passed for filtering
  const devices = deviceRegistry.getDevices(userId || 'mock-user');
  res.json({ ok: true, devices });
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`AURA Backend running in ${MODE} mode on http://localhost:${PORT}`);
});
