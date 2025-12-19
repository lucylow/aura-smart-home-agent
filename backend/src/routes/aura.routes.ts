import { Router, Request, Response } from 'express';
import { orchestratorAgent } from '../agents/OrchestratorAgent';
import { securitySpecialist } from '../agents/SecuritySpecialist';
import { ambianceSpecialist } from '../agents/AmbianceSpecialist';
import { energySpecialist } from '../agents/EnergySpecialist';
import { tuyaService } from '../services/tuya.service';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

// In-memory plan storage (in production, use database)
interface StoredPlan {
  planId: string;
  plan: any;
  userId: string;
  createdAt: Date;
  executedAt?: Date;
  status: 'pending' | 'executing' | 'executed' | 'failed';
  executionDetails?: any;
}

const planStore = new Map<string, StoredPlan>();

// Generate unique plan ID
function generatePlanId(): string {
  return `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// POST /api/aura/goal - Submit a natural language goal and get a plan
router.post('/goal', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { text, userId, roomHint } = req.body;

  if (!text) {
    return res.status(400).json({ 
      ok: false, 
      error: 'Goal text is required' 
    });
  }

  try {
    logger.info(`[AURA API] Goal received from user ${userId}: "${text}"`);

    // Generate plan using orchestrator agent
    const plan = await orchestratorAgent.generatePlan(text, userId, roomHint);
    
    // Store the plan
    const planId = generatePlanId();
    const storedPlan: StoredPlan = {
      planId,
      plan,
      userId: userId || 'anonymous',
      createdAt: new Date(),
      status: 'pending'
    };
    planStore.set(planId, storedPlan);

    logger.info(`[AURA API] Plan ${planId} generated with ${plan.steps.length} steps`);

    res.json({
      ok: true,
      planId,
      plan
    });
  } catch (error) {
    logger.error('[AURA API] Error generating plan:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to generate plan',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// POST /api/aura/plan/:planId/execute - Execute a stored plan
router.post('/plan/:planId/execute', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { planId } = req.params;
  const { dryRun } = req.body;

  const storedPlan = planStore.get(planId);
  if (!storedPlan) {
    return res.status(404).json({
      ok: false,
      error: 'Plan not found'
    });
  }

  try {
    logger.info(`[AURA API] Executing plan ${planId} (dryRun: ${dryRun || false})`);
    
    storedPlan.status = 'executing';
    const executionDetails: any[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Execute each step through the appropriate specialist
    for (const step of storedPlan.plan.steps) {
      logger.info(`[AURA API] Executing step: ${step.specialist}.${step.action}`);

      let result;
      try {
        if (dryRun) {
          // Dry run - just log what would happen
          result = {
            specialist: step.specialist,
            action: step.action,
            success: true,
            details: [`[DRY RUN] Would execute ${step.action} with params:`, JSON.stringify(step.params)],
            dryRun: true
          };
        } else {
          // Real execution - dispatch to specialist
          switch (step.specialist) {
            case 'SecuritySpecialist':
              result = await securitySpecialist.execute(step.action, step.params);
              break;
            case 'AmbianceSpecialist':
              result = await ambianceSpecialist.execute(step.action, step.params);
              break;
            case 'EnergySpecialist':
              result = await energySpecialist.execute(step.action, step.params);
              break;
            default:
              result = {
                specialist: step.specialist,
                action: step.action,
                success: false,
                details: [],
                errors: [`Unknown specialist: ${step.specialist}`]
              };
          }
        }

        executionDetails.push(result);
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        logger.error(`[AURA API] Error executing step ${step.specialist}.${step.action}:`, error);
        executionDetails.push({
          specialist: step.specialist,
          action: step.action,
          success: false,
          details: [],
          errors: [error instanceof Error ? error.message : String(error)]
        });
        errorCount++;
      }
    }

    storedPlan.status = errorCount === 0 ? 'executed' : 'failed';
    storedPlan.executedAt = new Date();
    storedPlan.executionDetails = executionDetails;

    logger.info(`[AURA API] Plan ${planId} execution complete: ${successCount} successful, ${errorCount} failed`);

    res.json({
      ok: true,
      planId,
      status: storedPlan.status,
      summary: {
        totalSteps: storedPlan.plan.steps.length,
        successful: successCount,
        failed: errorCount
      },
      details: executionDetails,
      dryRun: dryRun || false
    });
  } catch (error) {
    logger.error(`[AURA API] Error executing plan ${planId}:`, error);
    storedPlan.status = 'failed';
    
    res.status(500).json({
      ok: false,
      error: 'Failed to execute plan',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// GET /api/aura/plan/:planId - Get plan details and execution status
router.get('/plan/:planId', authMiddleware, (req: AuthRequest, res: Response) => {
  const { planId } = req.params;

  const storedPlan = planStore.get(planId);
  if (!storedPlan) {
    return res.status(404).json({
      ok: false,
      error: 'Plan not found'
    });
  }

  res.json({
    ok: true,
    planId: storedPlan.planId,
    plan: storedPlan.plan,
    status: storedPlan.status,
    createdAt: storedPlan.createdAt,
    executedAt: storedPlan.executedAt,
    executionDetails: storedPlan.executionDetails
  });
});

// GET /api/aura/devices - List available devices
router.get('/devices', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { homeId } = req.query;
    const devices = await tuyaService.listDevices(homeId as string);
    
    res.json({
      ok: true,
      mode: tuyaService.getMode(),
      devices
    });
  } catch (error) {
    logger.error('[AURA API] Error listing devices:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to list devices',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// GET /api/aura/status - Get system status
router.get('/status', (req: Request, res: Response) => {
  res.json({
    ok: true,
    status: 'operational',
    mode: tuyaService.getMode(),
    timestamp: new Date().toISOString(),
    agents: {
      orchestrator: 'ready',
      security: 'ready',
      ambiance: 'ready',
      energy: 'ready'
    }
  });
});

export default router;
