// backend/agents/AmbianceSpecialist.ts
import { DetailedPlanStep, ISpecialistAgent, PlanStep } from '../agents/types';
import { TuyaService } from '../services/TuyaService';
import { ContextService } from '../services/ContextService';
import { DeviceRegistry } from '../services/DeviceRegistry';
import { delay } from '../utils/utils';

export class AmbianceSpecialist implements ISpecialistAgent {
  private tuyaService: TuyaService;
  private contextService: ContextService;
  private deviceRegistry: DeviceRegistry;

  constructor(tuyaService: TuyaService, contextService: ContextService, deviceRegistry: DeviceRegistry) {
    this.tuyaService = tuyaService;
    this.contextService = contextService;
    this.deviceRegistry = deviceRegistry;
  }

  async enrichStep(step: PlanStep): Promise<DetailedPlanStep> {
    // Add specialist-specific validation, retries, and optimizations
    const enrichedStep: DetailedPlanStep = {
      ...step,
      retryPolicy: { maxAttempts: 3, backoffMs: 500 },
      validation: {
        preCheck: 'device_responsive',
        postCheck: 'state_matches_target'
      }
    };

    if (step.action === 'set_scene') {
      // Example optimization: adjust brightness based on time of day
      const timeOfDay = this.contextService.getTimeOfDay();
      if (timeOfDay === 'night' && enrichedStep.dpValues.brightness > 50) {
        enrichedStep.dpValues.brightness = 50; // Cap brightness at night
        enrichedStep.description += ' (Night-time cap applied)';
      }
      enrichedStep.fallback = { action: 'set_brightness', value: 50 }; // fallback if color fails
    }

    return enrichedStep;
  }

  async executeStep(step: DetailedPlanStep): Promise<any> {
    console.log(`[AmbianceSpecialist] Executing step: ${step.description}`);
    const devices = step.devices.map(name => this.deviceRegistry.getDeviceByName(name)).filter(d => d);

    if (devices.length === 0) {
      throw new Error(`No devices found for step: ${step.description}`);
    }

    const commands = Object.entries(step.dpValues).map(([key, value]) => {
      // Simple mock mapping: key is the DP name, value is the target value
      // In a real app, we'd use the device's dpIds map to get the Tuya DP ID
      return { dpId: 1, value: value }; // Mocking dpId as 1 for simplicity
    });

    for (const device of devices) {
      if (!device) continue;
      
      // Map DP names to mock DP IDs for TuyaService
      const actualCommands = Object.entries(step.dpValues).map(([dpName, value]) => {
        const dpId = device.dpIds[dpName];
        if (!dpId) {
          console.warn(`DP ID not found for ${dpName} on device ${device.name}. Using mock ID 1.`);
        }
        return { dpId: dpId || 1, value };
      });

      for (let attempt = 0; attempt < step.retryPolicy.maxAttempts; attempt++) {
        try {
          const result = await this.tuyaService.sendDeviceCommands(device.id, actualCommands);
          // Post-execution validation (mocked)
          if (step.validation.postCheck === 'state_matches_target') {
            await delay(500); // Simulate network delay for state update
            const currentState = await this.tuyaService.getDeviceState(device.id);
            const matches = Object.entries(step.dpValues).every(([key, value]) => {
              // Simple check: does the current state contain the target value?
              return currentState[key] === value;
            });
            if (!matches) {
              throw new Error(`Post-check failed: State mismatch for ${device.name}`);
            }
          }
          return { status: 'success', deviceId: device.id, result };
        } catch (err: any) {
          console.error(`Attempt ${attempt + 1} failed for ${device.name}: ${err.message}`);
          if (attempt < step.retryPolicy.maxAttempts - 1) {
            await delay(step.retryPolicy.backoffMs);
            continue;
          }
          throw err; // Re-throw if all attempts fail
        }
      }
    }
  }
}
