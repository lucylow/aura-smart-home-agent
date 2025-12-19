import logger from '../utils/logger';

export interface AutomationSuggestion {
  type: string;
  deviceName: string;
  proposedAction: {
    time?: string;
    action: {
      code: string;
      value: unknown;
    };
  };
}

class LearningService {
  async getAutomationSuggestions(homeId: string): Promise<AutomationSuggestion[]> {
    logger.info(`Getting automation suggestions for home: ${homeId}`);
    
    // Mock suggestions based on "learned" patterns
    return [
      {
        type: 'SCHEDULED_AUTOMATION',
        deviceName: 'Living Room Light',
        proposedAction: {
          time: '23:00',
          action: { code: 'switch_1', value: false },
        },
      },
      {
        type: 'SCHEDULED_AUTOMATION',
        deviceName: 'Thermostat',
        proposedAction: {
          time: '22:00',
          action: { code: 'temp_set', value: 20 },
        },
      },
      {
        type: 'PRESENCE_BASED',
        deviceName: 'Bedroom Light',
        proposedAction: {
          action: { code: 'switch_1', value: true },
        },
      },
    ];
  }
}

export const learningService = new LearningService();
