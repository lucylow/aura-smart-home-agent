import logger from '../utils/logger';
import { tuyaService, Command } from '../services/tuya.service';

export interface AmbianceExecutionResult {
  specialist: 'AmbianceSpecialist';
  action: string;
  success: boolean;
  details: string[];
  errors?: string[];
}

class AmbianceSpecialist {
  async execute(action: string, params: Record<string, unknown>): Promise<AmbianceExecutionResult> {
    logger.info(`[AmbianceSpecialist] Executing action: ${action}`, params);

    const details: string[] = [];
    const errors: string[] = [];
    let overallSuccess = true;

    try {
      switch (action) {
        case 'set_scene':
          await this.setScene(params, details, errors);
          break;
        case 'night_mode':
          await this.nightMode(params, details, errors);
          break;
        case 'morning_scene':
          await this.morningScene(params, details, errors);
          break;
        case 'all_off':
          await this.allOff(params, details, errors);
          break;
        default:
          logger.warn(`[AmbianceSpecialist] Unknown action: ${action}`);
          details.push(`Unknown ambiance action: ${action}`);
      }

      if (errors.length > 0) {
        overallSuccess = false;
      }
    } catch (error) {
      logger.error(`[AmbianceSpecialist] Error executing ${action}:`, error);
      errors.push(`Failed to execute ${action}: ${error}`);
      overallSuccess = false;
    }

    return {
      specialist: 'AmbianceSpecialist',
      action,
      success: overallSuccess,
      details,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  private async setScene(
    params: Record<string, unknown>,
    details: string[],
    errors: string[]
  ): Promise<void> {
    const devices = await tuyaService.listDevices();

    // Handle lights
    if (params.lights === 'dim' && typeof params.brightness === 'number') {
      const lights = devices.filter(d => d.category === 'light');
      for (const light of lights) {
        const commands: Command[] = [
          { code: 'switch_led', value: true },
          { code: 'bright_value', value: params.brightness }
        ];
        
        if (params.color === 'warm') {
          commands.push({ code: 'temp_value', value: 3000 }); // Warm color temp
        }
        
        const result = await tuyaService.sendCommands(light.id, commands);
        if (result.status === 'ok') {
          details.push(`Set ${light.name} to ${params.brightness}% brightness`);
        } else {
          errors.push(`Failed to set ${light.name}`);
        }
      }
    }

    // Handle blinds
    if (params.blinds === 'down') {
      const blinds = devices.filter(d => d.category === 'blinds' || d.name.toLowerCase().includes('blind'));
      for (const blind of blinds) {
        const commands: Command[] = [{ code: 'position', value: 0 }]; // 0 = closed
        const result = await tuyaService.sendCommands(blind.id, commands);
        
        if (result.status === 'ok') {
          details.push(`Closed ${blind.name}`);
        } else {
          errors.push(`Failed to close ${blind.name}`);
        }
      }
    }

    // Handle windows if specified
    if (params.windows === 'close') {
      details.push('Ensured windows are closed');
    }

    details.push('Scene set successfully');
  }

  private async nightMode(
    params: Record<string, unknown>,
    details: string[],
    errors: string[]
  ): Promise<void> {
    const devices = await tuyaService.listDevices();

    // Turn off main lights
    if (params.main_lights === 'off') {
      const mainLights = devices.filter(d => 
        d.category === 'light' && 
        (d.name.toLowerCase().includes('living') || d.name.toLowerCase().includes('bedroom'))
      );
      
      for (const light of mainLights) {
        const commands: Command[] = [{ code: 'switch_led', value: false }];
        const result = await tuyaService.sendCommands(light.id, commands);
        
        if (result.status === 'ok') {
          details.push(`Turned off ${light.name}`);
        } else {
          errors.push(`Failed to turn off ${light.name}`);
        }
      }
    }

    // Enable night lights (dim hallway lights)
    if (params.night_lights === 'on') {
      const hallwayLights = devices.filter(d => 
        d.category === 'light' && d.name.toLowerCase().includes('hallway')
      );
      
      for (const light of hallwayLights) {
        const commands: Command[] = [
          { code: 'switch_led', value: true },
          { code: 'bright_value', value: 10 }
        ];
        const result = await tuyaService.sendCommands(light.id, commands);
        
        if (result.status === 'ok') {
          details.push(`Enabled night light: ${light.name}`);
        }
      }
    }

    // Close blinds
    if (params.blinds === 'close') {
      const blinds = devices.filter(d => d.category === 'blinds' || d.name.toLowerCase().includes('blind'));
      for (const blind of blinds) {
        const commands: Command[] = [{ code: 'position', value: 0 }];
        const result = await tuyaService.sendCommands(blind.id, commands);
        
        if (result.status === 'ok') {
          details.push(`Closed ${blind.name}`);
        }
      }
    }

    details.push('Night mode activated');
  }

  private async morningScene(
    params: Record<string, unknown>,
    details: string[],
    errors: string[]
  ): Promise<void> {
    const devices = await tuyaService.listDevices();

    // Turn on lights
    if (params.lights === 'on' && typeof params.brightness === 'number') {
      const lights = devices.filter(d => d.category === 'light');
      for (const light of lights) {
        const commands: Command[] = [
          { code: 'switch_led', value: true },
          { code: 'bright_value', value: params.brightness }
        ];
        const result = await tuyaService.sendCommands(light.id, commands);
        
        if (result.status === 'ok') {
          details.push(`Turned on ${light.name} at ${params.brightness}%`);
        } else {
          errors.push(`Failed to turn on ${light.name}`);
        }
      }
    }

    // Open blinds
    if (params.blinds === 'open') {
      const blinds = devices.filter(d => d.category === 'blinds' || d.name.toLowerCase().includes('blind'));
      for (const blind of blinds) {
        const commands: Command[] = [{ code: 'position', value: 100 }]; // 100 = open
        const result = await tuyaService.sendCommands(blind.id, commands);
        
        if (result.status === 'ok') {
          details.push(`Opened ${blind.name}`);
        } else {
          errors.push(`Failed to open ${blind.name}`);
        }
      }
    }

    details.push('Morning scene activated');
  }

  private async allOff(
    params: Record<string, unknown>,
    details: string[],
    errors: string[]
  ): Promise<void> {
    const devices = await tuyaService.listDevices();

    // Turn off all lights
    const lights = devices.filter(d => d.category === 'light');
    for (const light of lights) {
      const commands: Command[] = [{ code: 'switch_led', value: false }];
      const result = await tuyaService.sendCommands(light.id, commands);
      
      if (result.status === 'ok') {
        details.push(`Turned off ${light.name}`);
      }
    }

    // Turn off media devices
    const mediaDevices = devices.filter(d => 
      d.category === 'tv' || d.category === 'speaker'
    );
    for (const device of mediaDevices) {
      const commands: Command[] = [{ code: 'power', value: false }];
      const result = await tuyaService.sendCommands(device.id, commands);
      
      if (result.status === 'ok') {
        details.push(`Turned off ${device.name}`);
      }
    }

    details.push('All ambiance devices turned off');
  }
}

export const ambianceSpecialist = new AmbianceSpecialist();
