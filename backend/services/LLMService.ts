// backend/services/LLMService.ts
import { ILLMService, GoalClassification, ContextData, PlanStep } from '../agents/types';

// In a real application, this would use the OpenAI or Groq API
export class LLMService implements ILLMService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async classifyGoal(goalText: string): Promise<GoalClassification> {
    // Mock classification for demo
    if (goalText.toLowerCase().includes('movie')) {
      return { primary: 'Movie Time', confidence: 0.95, nuances: ['dim lights', 'lock doors'] };
    }
    if (goalText.toLowerCase().includes('goodnight')) {
      return { primary: 'Goodnight', confidence: 0.90, nuances: ['secure home', 'set temperature'] };
    }
    return { primary: 'Custom', confidence: 0.7, nuances: [] };
  }

  async generatePlan(systemPrompt: string, goalText: string, context: ContextData): Promise<{ steps: PlanStep[] }> {
    // Mock plan generation for demo
    if (goalText.toLowerCase().includes('movie')) {
      return {
        steps: [
          {
            order: 1,
            specialist: 'AmbianceSpecialist',
            action: 'set_scene',
            description: 'Dim Living Room Light to 30%, warm white (2700K)',
            devices: ['Living Room Light'],
            dpValues: { brightness: 30, colorTemp: 2700 },
            estimatedDuration: 1500,
          } as PlanStep,
          {
            order: 2,
            specialist: 'SecuritySpecialist',
            action: 'lock_check',
            description: 'Verify Front Door Lock is locked',
            devices: ['Front Door Lock'],
            dpValues: { lock: 'locked' },
            estimatedDuration: 2000,
          } as PlanStep,
          {
            order: 3,
            specialist: 'AmbianceSpecialist',
            action: 'set_temperature',
            description: 'Set Bedroom Thermostat to 70°F',
            devices: ['Bedroom Thermostat'],
            dpValues: { temperature: 70 },
            estimatedDuration: 1000,
          } as PlanStep,
        ],
      };
    }

    return { steps: [] };
  }
}
