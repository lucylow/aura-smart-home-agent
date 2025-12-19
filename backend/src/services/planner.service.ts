import logger from '../utils/logger';

export interface PlanStep {
  deviceHint: string;
  action: string;
  params?: Record<string, unknown>;
  description: string;
}

export interface Plan {
  name: string;
  type?: string;
  steps: PlanStep[];
  requiresConfirmation: boolean;
}

interface RecipeBook {
  [key: string]: Plan;
}

const recipeBook: RecipeBook = {
  goodnight: {
    name: 'Goodnight Routine',
    steps: [
      { deviceHint: 'Bedroom Light', action: 'turnOff', description: 'Turn off the bedroom light' },
      { deviceHint: 'Living Room Light', action: 'turnOff', description: 'Turn off the living room light' },
      { deviceHint: 'Thermostat', action: 'set', params: { temperature: 20 }, description: 'Set thermostat to 20°C' },
      { deviceHint: 'Bedroom Blinds', action: 'close', description: 'Close the bedroom blinds' },
    ],
    requiresConfirmation: true,
  },
  'movie time': {
    name: 'Movie Time',
    steps: [
      { deviceHint: 'Living Room Light', action: 'dim', params: { brightness: 20 }, description: 'Dim the living room lights to 20%' },
      { deviceHint: 'Living Room TV', action: 'turnOn', description: 'Turn on the TV' },
      { deviceHint: 'Bedroom Blinds', action: 'close', description: 'Close the blinds' },
      { deviceHint: 'Smart Speaker', action: 'setVolume', params: { volume: 30 }, description: 'Set speaker volume to 30%' },
    ],
    requiresConfirmation: true,
  },
  'wake up': {
    name: 'Wake Up Routine',
    steps: [
      { deviceHint: 'Bedroom Blinds', action: 'open', description: 'Open the bedroom blinds' },
      { deviceHint: 'Bedroom Light', action: 'turnOn', description: 'Turn on the bedroom light' },
      { deviceHint: 'Thermostat', action: 'set', params: { temperature: 22 }, description: 'Set thermostat to 22°C' },
    ],
    requiresConfirmation: true,
  },
};

class PlannerService {
  generatePlan(goal: string, userContext?: Record<string, unknown>): Plan {
    logger.info(`Generating plan for goal: ${goal}`);
    
    const normalizedGoal = goal.toLowerCase().trim();
    
    // Check recipe book for matching plan
    for (const [key, plan] of Object.entries(recipeBook)) {
      if (normalizedGoal.includes(key)) {
        logger.info(`Found matching recipe: ${key}`);
        return { ...plan };
      }
    }
    
    // No recipe found - return direct command plan
    logger.info(`No recipe found for goal: ${goal}, returning direct command`);
    return {
      name: 'Direct Command',
      type: 'DIRECT_COMMAND',
      steps: [
        {
          deviceHint: goal,
          action: 'execute',
          description: `Execute: ${goal}`,
        },
      ],
      requiresConfirmation: true,
    };
  }
}

export const plannerService = new PlannerService();
