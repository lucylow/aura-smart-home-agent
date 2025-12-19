import { tuyaService, Device, Command } from './tuya.service';
import { Plan, PlanStep } from './planner.service';
import logger from '../utils/logger';
import { Server as SocketIOServer } from 'socket.io';

export interface StepResult {
  step: { description: string };
  deviceId: string;
  success: boolean;
  simulated?: boolean;
  result: { status: string; error?: string };
}

export interface ExecutionResult {
  ok: boolean;
  summary: { totalSteps: number; successful: number };
  results: StepResult[];
}

class ExecutorService {
  private io: SocketIOServer | null = null;

  setSocketIO(io: SocketIOServer) {
    this.io = io;
  }

  async executePlan(plan: Plan, userId: string, dryRun: boolean = false): Promise<ExecutionResult> {
    if (dryRun) {
      logger.info(`DRY RUN: Simulating plan "${plan.name}" for user ${userId}`);
      return this.simulatePlan(plan);
    }

    logger.info(`Executing plan "${plan.name}" for user ${userId}`);
    
    const devices = await tuyaService.listDevices();
    const results: StepResult[] = [];
    let successful = 0;

    for (const step of plan.steps) {
      const result = await this.executeStep(step, devices);
      results.push(result);
      if (result.success) successful++;
    }

    return {
      ok: true,
      summary: { totalSteps: plan.steps.length, successful },
      results,
    };
  }

  private simulatePlan(plan: Plan): ExecutionResult {
    const results: StepResult[] = plan.steps.map((step, index) => ({
      step: { description: step.description },
      deviceId: `simulated-dev-${index}`,
      success: true,
      simulated: true,
      result: { status: 'simulated_ok' },
    }));

    return {
      ok: true,
      summary: { totalSteps: plan.steps.length, successful: plan.steps.length },
      results,
    };
  }

  private async executeStep(step: PlanStep, devices: Device[]): Promise<StepResult> {
    logger.debug(`Executing step: ${step.description}`);
    
    // Find device by hint
    const device = this.findDevice(step.deviceHint, devices);
    
    if (!device) {
      logger.warn(`Device not found for hint: ${step.deviceHint}`);
      return {
        step: { description: step.description },
        deviceId: 'unknown',
        success: false,
        result: { status: 'error', error: `Device not found: ${step.deviceHint}` },
      };
    }

    // Map action to commands
    const commands = this.mapActionToCommands(step.action, step.params);
    
    // Execute with retries
    const result = await this.executeWithRetries(device.id, commands, 2);
    
    // Emit socket event
    if (result.status === 'ok' && this.io) {
      const updatedDevice = await tuyaService.getDevice(device.id);
      this.io.emit('device_status_update', {
        deviceId: device.id,
        status: updatedDevice?.status,
      });
    }

    return {
      step: { description: step.description },
      deviceId: device.id,
      success: result.status === 'ok',
      result: { status: result.status, error: result.error },
    };
  }

  private findDevice(hint: string, devices: Device[]): Device | undefined {
    const normalizedHint = hint.toLowerCase();
    
    // Try to find by name match
    const byName = devices.find(d => 
      d.name.toLowerCase().includes(normalizedHint.split(' ')[0])
    );
    if (byName) return byName;

    // Fallback: find by category
    const categoryMap: Record<string, string> = {
      light: 'light',
      thermostat: 'thermostat',
      tv: 'tv',
      blinds: 'blinds',
      speaker: 'speaker',
    };
    
    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (normalizedHint.includes(keyword)) {
        return devices.find(d => d.category === category);
      }
    }

    return undefined;
  }

  private mapActionToCommands(action: string, params?: Record<string, unknown>): Command[] {
    switch (action) {
      case 'turnOff':
        return [{ code: 'switch_1', value: false }];
      case 'turnOn':
        return [{ code: 'switch_1', value: true }];
      case 'set':
        if (params?.temperature) {
          return [{ code: 'temp_set', value: params.temperature }];
        }
        return [];
      case 'dim':
        return [
          { code: 'switch_1', value: true },
          { code: 'bright_value', value: params?.brightness || 50 },
        ];
      case 'close':
        return [{ code: 'position', value: 0 }];
      case 'open':
        return [{ code: 'position', value: 100 }];
      case 'setVolume':
        return [{ code: 'volume', value: params?.volume || 50 }];
      default:
        return [{ code: action, value: true }];
    }
  }

  private async executeWithRetries(
    deviceId: string,
    commands: Command[],
    maxRetries: number
  ): Promise<{ status: string; error?: string }> {
    let lastError: string | undefined;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 100;
        logger.debug(`Retry ${attempt} for device ${deviceId} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const result = await tuyaService.sendCommands(deviceId, commands);
      
      if (result.status === 'ok') {
        return { status: 'ok' };
      }
      
      lastError = result.error;
    }

    return { status: 'error', error: lastError };
  }
}

export const executorService = new ExecutorService();
