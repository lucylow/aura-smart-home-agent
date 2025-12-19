import logger from '../utils/logger';

export interface Device {
  id: string;
  name: string;
  category: string;
  status: Record<string, unknown>;
}

export interface Command {
  code: string;
  value: unknown;
}

export interface CommandResult {
  status: 'ok' | 'error';
  deviceId: string;
  error?: string;
}

const mockDevices: Device[] = [
  { id: 'dev-light-1', name: 'Living Room Light', category: 'light', status: { switch_1: true } },
  { id: 'dev-light-2', name: 'Bedroom Light', category: 'light', status: { switch_1: true } },
  { id: 'dev-therm-1', name: 'Thermostat', category: 'thermostat', status: { temp: 22 } },
  { id: 'dev-tv-1', name: 'Living Room TV', category: 'tv', status: { power: false } },
  { id: 'dev-blind-1', name: 'Bedroom Blinds', category: 'blinds', status: { position: 100 } },
  { id: 'dev-speaker-1', name: 'Smart Speaker', category: 'speaker', status: { volume: 50, playing: false } },
];

class TuyaService {
  private devices: Device[] = [...mockDevices];

  async listDevices(homeId?: string): Promise<Device[]> {
    logger.debug(`Listing devices for home: ${homeId || 'all'}`);
    // Simulate network delay
    await this.delay(50);
    return this.devices;
  }

  async getDevice(deviceId: string): Promise<Device | undefined> {
    await this.delay(30);
    return this.devices.find(d => d.id === deviceId);
  }

  async sendCommands(deviceId: string, commands: Command[]): Promise<CommandResult> {
    logger.info(`Sending commands to device ${deviceId}:`, commands);
    
    // Simulate network delay (100-400ms)
    await this.delay(100 + Math.random() * 300);
    
    // 90% success rate
    if (Math.random() > 0.1) {
      // Update mock device status
      const device = this.devices.find(d => d.id === deviceId);
      if (device) {
        commands.forEach(cmd => {
          device.status[cmd.code] = cmd.value;
        });
      }
      
      logger.info(`Commands successful for device ${deviceId}`);
      return { status: 'ok', deviceId };
    } else {
      logger.warn(`Commands failed for device ${deviceId} (simulated failure)`);
      return { status: 'error', deviceId, error: 'Simulated random failure' };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const tuyaService = new TuyaService();
