import logger from '../utils/logger';
import { llmService } from '../services/LLMService';
import { contextService } from '../services/ContextService';

export interface SpecialistStep {
  specialist: string;
  action: string;
  params: Record<string, unknown>;
  description?: string;
}

export interface OrchestratedPlan {
  goal: string;
  goalType: string;
  steps: SpecialistStep[];
  context?: Record<string, unknown> | any;
  requiresConfirmation: boolean;
}

interface SceneTemplate {
  goalType: string;
  steps: SpecialistStep[];
  requiresConfirmation: boolean;
}

const sceneTemplates: Record<string, SceneTemplate> = {
  'movie_time': {
    goalType: 'movie_time',
    steps: [
      {
        specialist: 'AmbianceSpecialist',
        action: 'set_scene',
        params: { lights: 'dim', brightness: 20, color: 'warm', blinds: 'down' },
        description: 'Set ambiance for movie watching'
      },
      {
        specialist: 'EnergySpecialist',
        action: 'optimize',
        params: { non_essential_off: true },
        description: 'Turn off non-essential devices'
      },
      {
        specialist: 'SecuritySpecialist',
        action: 'perimeter_check',
        params: { lock_doors: true },
        description: 'Ensure doors are locked'
      }
    ],
    requiresConfirmation: true
  },
  'goodnight': {
    goalType: 'goodnight',
    steps: [
      {
        specialist: 'AmbianceSpecialist',
        action: 'night_mode',
        params: { main_lights: 'off', night_lights: 'on', blinds: 'close' },
        description: 'Set night ambiance'
      },
      {
        specialist: 'SecuritySpecialist',
        action: 'arm_perimeter',
        params: { mode: 'night', lock_all: true },
        description: 'Arm security for night'
      },
      {
        specialist: 'EnergySpecialist',
        action: 'sleep_mode',
        params: { thermostat: 20, non_essential_off: true },
        description: 'Set energy-saving sleep mode'
      }
    ],
    requiresConfirmation: true
  },
  'leaving_home': {
    goalType: 'leaving_home',
    steps: [
      {
        specialist: 'EnergySpecialist',
        action: 'away_mode',
        params: { all_off: true, thermostat: 'eco' },
        description: 'Set energy-saving away mode'
      },
      {
        specialist: 'SecuritySpecialist',
        action: 'arm_full',
        params: { lock_all: true, arm_sensors: true },
        description: 'Arm full security'
      },
      {
        specialist: 'AmbianceSpecialist',
        action: 'all_off',
        params: {},
        description: 'Turn off all lights and media'
      }
    ],
    requiresConfirmation: true
  },
  'wake_up': {
    goalType: 'wake_up',
    steps: [
      {
        specialist: 'AmbianceSpecialist',
        action: 'morning_scene',
        params: { lights: 'on', brightness: 70, blinds: 'open' },
        description: 'Set morning ambiance'
      },
      {
        specialist: 'EnergySpecialist',
        action: 'comfort_mode',
        params: { thermostat: 22 },
        description: 'Set comfortable temperature'
      },
      {
        specialist: 'SecuritySpecialist',
        action: 'disarm',
        params: {},
        description: 'Disarm security system'
      }
    ],
    requiresConfirmation: false
  }
};

class OrchestratorAgent {
  async generatePlan(
    goalText: string,
    userId?: string,
    roomHint?: string
  ): Promise<OrchestratedPlan> {
    logger.info(`[OrchestratorAgent] Generating plan for goal: "${goalText}"`);

    // Get context for enrichment
    const context = await contextService.getContext(userId);
    logger.debug(`[OrchestratorAgent] Context:`, context);

    // Step 1: Classify intent using LLM
    const goalType = await llmService.classifyGoal(goalText);
    logger.info(`[OrchestratorAgent] Classified goal type: ${goalType}`);

    // Step 2: Check if we have a template for this goal
    let plan: OrchestratedPlan;
    
    if (sceneTemplates[goalType]) {
      const template = sceneTemplates[goalType];
      plan = {
        goal: goalText,
        goalType: template.goalType,
        steps: [...template.steps],
        context,
        requiresConfirmation: template.requiresConfirmation
      };
      
      // Apply context-based adjustments
      plan = this.applyContextAdjustments(plan, context);
      
      logger.info(`[OrchestratorAgent] Using template for ${goalType} with ${plan.steps.length} steps`);
    } else {
      // Step 3: Use LLM to generate a custom plan
      logger.info(`[OrchestratorAgent] No template found, using LLM to generate plan`);
      plan = await llmService.generatePlan(goalText, goalType, context, roomHint);
    }

    return plan;
  }

  private applyContextAdjustments(
    plan: OrchestratedPlan,
    context: any
  ): OrchestratedPlan {
    const adjustedPlan = { ...plan, steps: [...plan.steps] };

    // If raining and it's a goodnight or leaving_home scenario, ensure windows are closed
    if (context.isRaining && (plan.goalType === 'goodnight' || plan.goalType === 'leaving_home')) {
      const ambianceStep = adjustedPlan.steps.find(s => s.specialist === 'AmbianceSpecialist');
      if (ambianceStep && ambianceStep.params) {
        ambianceStep.params.windows = 'close';
        ambianceStep.description += ' (windows closed due to rain)';
      }
    }

    // Adjust thermostat based on external temperature
    if (typeof context.temperature === 'number') {
      const energyStep = adjustedPlan.steps.find(s => s.specialist === 'EnergySpecialist');
      if (energyStep && energyStep.params && typeof energyStep.params.thermostat === 'number') {
        // If it's very cold outside, pre-heat a bit more
        if (context.temperature < 5 && plan.goalType === 'wake_up') {
          energyStep.params.thermostat = 23;
          energyStep.description += ' (increased due to cold weather)';
        }
      }
    }

    // During quiet hours, reduce volumes and brightness
    if (context.isQuietHours) {
      adjustedPlan.steps.forEach(step => {
        if (step.specialist === 'AmbianceSpecialist' && step.params.brightness) {
          step.params.brightness = Math.min(step.params.brightness as number, 30);
        }
      });
    }

    return adjustedPlan;
  }
}

export const orchestratorAgent = new OrchestratorAgent();
