import { Router, Response } from 'express';
import { plannerService } from '../services/planner.service';
import { executorService } from '../services/executor.service';
import { learningService } from '../services/learning.service';
import { authMiddleware, AuthRequest, generateToken } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

// Health check - no auth required
router.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Login endpoint - returns JWT for demo purposes
router.post('/auth/login', (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ ok: false, error: 'Username required' });
  }

  const token = generateToken(username);
  logger.info(`User ${username} logged in`);
  
  res.json({ ok: true, token });
});

// Plan endpoint - requires auth
router.post('/plan', authMiddleware, (req: AuthRequest, res: Response) => {
  const { userId, goal } = req.body;

  if (!goal) {
    return res.status(400).json({ ok: false, error: 'Goal is required' });
  }

  try {
    const plan = plannerService.generatePlan(goal, { userId });
    logger.info(`Plan generated for user ${userId}: ${plan.name}`);
    
    res.json({ ok: true, plan });
  } catch (error) {
    logger.error('Error generating plan:', error);
    res.status(500).json({ ok: false, error: 'Failed to generate plan' });
  }
});

// Execute endpoint - requires auth
// Supports ?dryRun=true query param or { dryRun: true } in body
router.post('/execute', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { userId, plan, dryRun: bodyDryRun } = req.body;
  const dryRun = req.query.dryRun === 'true' || bodyDryRun === true;

  if (!plan || !plan.steps) {
    return res.status(400).json({ ok: false, error: 'Valid plan is required' });
  }

  try {
    const result = await executorService.executePlan(plan, userId, dryRun);
    const mode = dryRun ? 'DRY RUN' : 'executed';
    logger.info(`Plan ${mode} for user ${userId}: ${result.summary.successful}/${result.summary.totalSteps} successful`);
    
    res.json(result);
  } catch (error) {
    logger.error('Error executing plan:', error);
    res.status(500).json({ ok: false, error: 'Failed to execute plan' });
  }
});

// Suggestions endpoint - no auth required for demo
router.get('/suggestions', async (req, res) => {
  const homeId = (req.query.homeId as string) || 'H1';

  try {
    const suggestions = await learningService.getAutomationSuggestions(homeId);
    res.json({ ok: true, suggestions });
  } catch (error) {
    logger.error('Error getting suggestions:', error);
    res.status(500).json({ ok: false, error: 'Failed to get suggestions' });
  }
});

export default router;
