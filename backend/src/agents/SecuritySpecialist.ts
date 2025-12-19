import logger from '../utils/logger';
import { tuyaService, Command } from '../services/tuya.service';

export interface SecurityAction {
  action: string;
  params: Record<string, unknown>;
}

export interface SecurityExecutionResult {
  specialist: 'SecuritySpecialist';
  action: string;
  success: boolean;
  details: string[];
  errors?: string[];
}

class SecuritySpecialist {
  async execute(action: string, params: Record<string, unknown>): Promise<SecurityExecutionResult> {
    logger.info(`[SecuritySpecialist] Executing action: ${action}`, params);

    const details: string[] = [];
    const errors: string[] = [];
    let overallSuccess = true;

    try {
      switch (action) {
        case 'perimeter_check':
          await this.perimeterCheck(params, details, errors);
          break;
        case 'arm_perimeter':
          await this.armPerimeter(params, details, errors);
          break;
        case 'arm_full':
          await this.armFull(params, details, errors);
          break;
        case 'disarm':
          await this.disarm(params, details, errors);
          break;
        default:
          logger.warn(`[SecuritySpecialist] Unknown action: ${action}`);
          details.push(`Unknown security action: ${action}`);
      }

      if (errors.length > 0) {
        overallSuccess = false;
      }
    } catch (error) {
      logger.error(`[SecuritySpecialist] Error executing ${action}:`, error);
      errors.push(`Failed to execute ${action}: ${error}`);
      overallSuccess = false;
    }

    return {
      specialist: 'SecuritySpecialist',
      action,
      success: overallSuccess,
      details,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  private async perimeterCheck(
    params: Record<string, unknown>,
    details: string[],
    errors: string[]
  ): Promise<void> {
    const devices = await tuyaService.listDevices();
    const locks = devices.filter(d => d.category === 'lock' || d.name.toLowerCase().includes('lock'));

    if (params.lock_doors) {
      for (const lock of locks) {
        const commands: Command[] = [{ code: 'lock', value: true }];
        const result = await tuyaService.sendCommands(lock.id, commands);
        
        if (result.status === 'ok') {
          details.push(`Locked ${lock.name}`);
        } else {
          errors.push(`Failed to lock ${lock.name}: ${result.error}`);
        }
      }
    }

    details.push('Perimeter check completed');
  }

  private async armPerimeter(
    params: Record<string, unknown>,
    details: string[],
    errors: string[]
  ): Promise<void> {
    const devices = await tuyaService.listDevices();
    
    // Lock all doors
    if (params.lock_all) {
      const locks = devices.filter(d => d.category === 'lock' || d.name.toLowerCase().includes('lock'));
      for (const lock of locks) {
        const commands: Command[] = [{ code: 'lock', value: true }];
        const result = await tuyaService.sendCommands(lock.id, commands);
        
        if (result.status === 'ok') {
          details.push(`Locked ${lock.name}`);
        } else {
          errors.push(`Failed to lock ${lock.name}`);
        }
      }
    }

    // Arm motion sensors (perimeter only)
    const sensors = devices.filter(d => d.category === 'sensor' || d.name.toLowerCase().includes('sensor'));
    for (const sensor of sensors) {
      const commands: Command[] = [{ code: 'arm_mode', value: 'perimeter' }];
      const result = await tuyaService.sendCommands(sensor.id, commands);
      
      if (result.status === 'ok') {
        details.push(`Armed ${sensor.name} in perimeter mode`);
      }
    }

    details.push(`Security armed in ${params.mode || 'perimeter'} mode`);
  }

  private async armFull(
    params: Record<string, unknown>,
    details: string[],
    errors: string[]
  ): Promise<void> {
    const devices = await tuyaService.listDevices();
    
    // Lock all doors
    if (params.lock_all) {
      const locks = devices.filter(d => d.category === 'lock' || d.name.toLowerCase().includes('lock'));
      for (const lock of locks) {
        const commands: Command[] = [{ code: 'lock', value: true }];
        const result = await tuyaService.sendCommands(lock.id, commands);
        
        if (result.status === 'ok') {
          details.push(`Locked ${lock.name}`);
        } else {
          errors.push(`Failed to lock ${lock.name}`);
        }
      }
    }

    // Arm all sensors
    if (params.arm_sensors) {
      const sensors = devices.filter(d => d.category === 'sensor' || d.name.toLowerCase().includes('sensor'));
      for (const sensor of sensors) {
        const commands: Command[] = [{ code: 'arm_mode', value: 'full' }];
        const result = await tuyaService.sendCommands(sensor.id, commands);
        
        if (result.status === 'ok') {
          details.push(`Armed ${sensor.name} in full mode`);
        }
      }
    }

    details.push('Full security armed');
  }

  private async disarm(
    params: Record<string, unknown>,
    details: string[],
    errors: string[]
  ): Promise<void> {
    const devices = await tuyaService.listDevices();
    
    // Disarm all sensors
    const sensors = devices.filter(d => d.category === 'sensor' || d.name.toLowerCase().includes('sensor'));
    for (const sensor of sensors) {
      const commands: Command[] = [{ code: 'arm_mode', value: 'off' }];
      const result = await tuyaService.sendCommands(sensor.id, commands);
      
      if (result.status === 'ok') {
        details.push(`Disarmed ${sensor.name}`);
      }
    }

    details.push('Security system disarmed');
  }
}

export const securitySpecialist = new SecuritySpecialist();
