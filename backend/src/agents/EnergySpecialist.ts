import logger from '../utils/logger';
import { tuyaService, Command } from '../services/tuya.service';

export interface EnergyExecutionResult {
  specialist: 'EnergySpecialist';
  action: string;
  success: boolean;
  details: string[];
  errors?: string[];
}

class EnergySpecialist {
  async execute(action: string, params: Record<string, unknown>): Promise<EnergyExecutionResult> {
    logger.info(`[EnergySpecialist] Executing action: ${action}`, params);

    const details: string[] = [];
    const errors: string[] = [];
    let overallSuccess = true;

    try {
      switch (action) {
        case 'optimize':
          await this.optimize(params, details, errors);
          break;
        case 'sleep_mode':
          await this.sleepMode(params, details, errors);
          break;
        case 'away_mode':
          await this.awayMode(params, details, errors);
          break;
        case 'comfort_mode':
          await this.comfortMode(params, details, errors);
          break;
        default:
          logger.warn(`[EnergySpecialist] Unknown action: ${action}`);
          details.push(`Unknown energy action: ${action}`);
      }

      if (errors.length > 0) {
        overallSuccess = false;
      }
    } catch (error) {
      logger.error(`[EnergySpecialist] Error executing ${action}:`, error);
      errors.push(`Failed to execute ${action}: ${error}`);
      overallSuccess = false;
    }

    return {
      specialist: 'EnergySpecialist',
      action,
      success: overallSuccess,
      details,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  private async optimize(
    params: Record<string, unknown>,
    details: string[],
    errors: string[]
  ): Promise<void> {
    const devices = await tuyaService.listDevices();

    // Turn off non-essential devices
    if (params.non_essential_off) {
      const nonEssential = devices.filter(d => 
        d.category === 'tv' || 
        d.category === 'speaker' ||
        (d.category === 'light' && !d.name.toLowerCase().includes('essential'))
      );

      for (const device of nonEssential) {
        const commands: Command[] = [
          { code: device.category === 'light' ? 'switch_led' : 'power', value: false }
        ];
        const result = await tuyaService.sendCommands(device.id, commands);
        
        if (result.status === 'ok') {
          details.push(`Turned off non-essential device: ${device.name}`);
        } else {
          errors.push(`Failed to turn off ${device.name}`);
        }
      }
    }

    details.push('Energy optimization completed');
  }

  private async sleepMode(
    params: Record<string, unknown>,
    details: string[],
    errors: string[]
  ): Promise<void> {
    const devices = await tuyaService.listDevices();

    // Set thermostat to sleep temperature
    if (typeof params.thermostat === 'number') {
      const thermostats = devices.filter(d => d.category === 'thermostat');
      for (const thermostat of thermostats) {
        const commands: Command[] = [
          { code: 'temp_set', value: params.thermostat },
          { code: 'mode', value: 'sleep' }
        ];
        const result = await tuyaService.sendCommands(thermostat.id, commands);
        
        if (result.status === 'ok') {
          details.push(`Set ${thermostat.name} to ${params.thermostat}°C (sleep mode)`);
        } else {
          errors.push(`Failed to set ${thermostat.name}`);
        }
      }
    }

    // Turn off non-essential devices
    if (params.non_essential_off) {
      const nonEssential = devices.filter(d => 
        d.category === 'tv' || d.category === 'speaker'
      );

      for (const device of nonEssential) {
        const commands: Command[] = [{ code: 'power', value: false }];
        const result = await tuyaService.sendCommands(device.id, commands);
        
        if (result.status === 'ok') {
          details.push(`Turned off ${device.name}`);
        }
      }
    }

    details.push('Sleep mode energy settings applied');
  }

  private async awayMode(
    params: Record<string, unknown>,
    details: string[],
    errors: string[]
  ): Promise<void> {
    const devices = await tuyaService.listDevices();

    // Turn off all devices if requested
    if (params.all_off) {
      const controllableDevices = devices.filter(d => 
        d.category === 'light' || 
        d.category === 'tv' || 
        d.category === 'speaker'
      );

      for (const device of controllableDevices) {
        const commands: Command[] = [
          { code: device.category === 'light' ? 'switch_led' : 'power', value: false }
        ];
        const result = await tuyaService.sendCommands(device.id, commands);
        
        if (result.status === 'ok') {
          details.push(`Turned off ${device.name}`);
        }
      }
    }

    // Set thermostat to eco mode
    if (params.thermostat === 'eco') {
      const thermostats = devices.filter(d => d.category === 'thermostat');
      for (const thermostat of thermostats) {
        const commands: Command[] = [
          { code: 'temp_set', value: 16 }, // Eco temperature
          { code: 'mode', value: 'eco' }
        ];
        const result = await tuyaService.sendCommands(thermostat.id, commands);
        
        if (result.status === 'ok') {
          details.push(`Set ${thermostat.name} to eco mode (16°C)`);
        } else {
          errors.push(`Failed to set ${thermostat.name}`);
        }
      }
    }

    details.push('Away mode energy settings applied');
  }

  private async comfortMode(
    params: Record<string, unknown>,
    details: string[],
    errors: string[]
  ): Promise<void> {
    const devices = await tuyaService.listDevices();

    // Set thermostat to comfort temperature
    if (typeof params.thermostat === 'number') {
      const thermostats = devices.filter(d => d.category === 'thermostat');
      for (const thermostat of thermostats) {
        const commands: Command[] = [
          { code: 'temp_set', value: params.thermostat },
          { code: 'mode', value: 'comfort' }
        ];
        const result = await tuyaService.sendCommands(thermostat.id, commands);
        
        if (result.status === 'ok') {
          details.push(`Set ${thermostat.name} to ${params.thermostat}°C (comfort mode)`);
        } else {
          errors.push(`Failed to set ${thermostat.name}`);
        }
      }
    }

    details.push('Comfort mode energy settings applied');
  }
}

export const energySpecialist = new EnergySpecialist();
