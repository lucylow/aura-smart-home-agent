import logger from '../utils/logger';

export interface Device {
  id: string;
  name: string;
  category: string;
  productId?: string;
  uuid?: string;
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

// Enhanced mock devices with more realistic Tuya device structure
const mockDevices: Device[] = [
  { 
    id: 'dev-light-living-1', 
    name: 'Living Room Light', 
    category: 'light',
    productId: 'tuya_light_001',
    status: { switch_led: true, bright_value: 100, temp_value: 4000 } 
  },
  { 
    id: 'dev-light-bedroom-1', 
    name: 'Bedroom Light', 
    category: 'light',
    productId: 'tuya_light_001',
    status: { switch_led: true, bright_value: 80, temp_value: 3000 } 
  },
  { 
    id: 'dev-light-hallway-1', 
    name: 'Hallway Light', 
    category: 'light',
    productId: 'tuya_light_001',
    status: { switch_led: false, bright_value: 10 } 
  },
  { 
    id: 'dev-therm-1', 
    name: 'Thermostat', 
    category: 'thermostat',
    productId: 'tuya_thermostat_001',
    status: { temp_set: 22, temp_current: 21, mode: 'comfort' } 
  },
  { 
    id: 'dev-tv-1', 
    name: 'Living Room TV', 
    category: 'tv',
    productId: 'tuya_tv_001',
    status: { power: false } 
  },
  { 
    id: 'dev-blind-bedroom-1', 
    name: 'Bedroom Blinds', 
    category: 'blinds',
    productId: 'tuya_blind_001',
    status: { position: 100, control: 'stop' } 
  },
  { 
    id: 'dev-speaker-1', 
    name: 'Smart Speaker', 
    category: 'speaker',
    productId: 'tuya_speaker_001',
    status: { volume: 50, playing: false, mute: false } 
  },
  { 
    id: 'dev-lock-front-1', 
    name: 'Front Door Lock', 
    category: 'lock',
    productId: 'tuya_lock_001',
    status: { lock: true, battery: 85 } 
  },
  { 
    id: 'dev-lock-back-1', 
    name: 'Back Door Lock', 
    category: 'lock',
    productId: 'tuya_lock_001',
    status: { lock: true, battery: 92 } 
  },
  { 
    id: 'dev-sensor-motion-1', 
    name: 'Motion Sensor', 
    category: 'sensor',
    productId: 'tuya_sensor_001',
    status: { arm_mode: 'off', motion_detected: false } 
  },
];

class TuyaService {
  private devices: Device[] = [...mockDevices];
  private mode: 'live' | 'demo';
  private clientId?: string;
  private clientSecret?: string;
  private region?: string;
  private accessUrl?: string;

  constructor() {
    this.mode = (process.env.TUYA_MOCK === 'true' || process.env.MODE === 'demo') ? 'demo' : 'live';
    this.clientId = process.env.TUYA_CLIENT_ID;
    this.clientSecret = process.env.TUYA_CLIENT_SECRET;
    this.region = process.env.TUYA_REGION || 'us';
    this.accessUrl = process.env.TUYA_ACCESS_URL || 'https://openapi.tuyaus.com';

    logger.info(`[TuyaService] Initialized in ${this.mode} mode`);
    
    if (this.mode === 'live' && (!this.clientId || !this.clientSecret)) {
      logger.warn('[TuyaService] Live mode requested but credentials not configured, falling back to demo mode');
      this.mode = 'demo';
    }
  }

  async listDevices(homeId?: string): Promise<Device[]> {
    logger.debug(`[TuyaService] Listing devices for home: ${homeId || 'all'}`);
    
    if (this.mode === 'demo') {
      await this.delay(50);
      return this.devices;
    } else {
      // In live mode, would call Tuya Cloud API
      logger.info('[TuyaService] Would call Tuya Cloud API: GET /v1.0/users/{uid}/devices');
      // TODO: Implement real Tuya API call
      // return await this.callTuyaAPI('/v1.0/users/{uid}/devices');
      return this.devices;
    }
  }

  async getDevice(deviceId: string): Promise<Device | undefined> {
    logger.debug(`[TuyaService] Getting device: ${deviceId}`);
    
    if (this.mode === 'demo') {
      await this.delay(30);
      return this.devices.find(d => d.id === deviceId);
    } else {
      logger.info(`[TuyaService] Would call Tuya Cloud API: GET /v1.0/devices/${deviceId}`);
      // TODO: Implement real Tuya API call
      return this.devices.find(d => d.id === deviceId);
    }
  }

  async getDeviceState(deviceId: string): Promise<Record<string, unknown> | undefined> {
    const device = await this.getDevice(deviceId);
    return device?.status;
  }

  async sendCommands(deviceId: string, commands: Command[]): Promise<CommandResult> {
    logger.info(`[TuyaService] [${this.mode}] Sending commands to device ${deviceId}:`, commands);
    
    if (this.mode === 'demo') {
      // Simulate network delay (100-400ms)
      await this.delay(100 + Math.random() * 300);
      
      // 95% success rate in demo mode
      if (Math.random() > 0.05) {
        // Update mock device status
        const device = this.devices.find(d => d.id === deviceId);
        if (device) {
          commands.forEach(cmd => {
            device.status[cmd.code] = cmd.value;
            logger.debug(`[TuyaService] Updated ${device.name} DP ${cmd.code} = ${cmd.value}`);
          });
        }
        
        logger.info(`[TuyaService] Commands successful for device ${deviceId}`);
        return { status: 'ok', deviceId };
      } else {
        logger.warn(`[TuyaService] Commands failed for device ${deviceId} (simulated failure)`);
        return { status: 'error', deviceId, error: 'Simulated random failure' };
      }
    } else {
      // In live mode, would call Tuya Cloud API
      logger.info(`[TuyaService] Would call Tuya Cloud API: POST /v1.0/devices/${deviceId}/commands`);
      logger.info(`[TuyaService] Command payload (Tuya DP format):`, {
        commands: commands.map(cmd => ({ code: cmd.code, value: cmd.value }))
      });
      
      // TODO: Implement real Tuya API call
      // const result = await this.callTuyaAPI(`/v1.0/devices/${deviceId}/commands`, {
      //   commands: commands
      // });
      
      // For now, simulate success
      return { status: 'ok', deviceId };
    }
  }

  async sendDeviceCommands(deviceId: string, commands: Command[]): Promise<CommandResult> {
    return this.sendCommands(deviceId, commands);
  }

  async executeScene(sceneId: string): Promise<{ status: 'ok' | 'error'; sceneId: string; error?: string }> {
    logger.info(`[TuyaService] [${this.mode}] Executing scene: ${sceneId}`);
    
    if (this.mode === 'demo') {
      await this.delay(200);
      logger.info(`[TuyaService] Scene ${sceneId} executed (demo mode)`);
      return { status: 'ok', sceneId };
    } else {
      logger.info(`[TuyaService] Would call Tuya Cloud API: POST /v1.0/homes/{home_id}/scenes/${sceneId}/trigger`);
      // TODO: Implement real Tuya API call
      return { status: 'ok', sceneId };
    }
  }

  getMode(): 'live' | 'demo' {
    return this.mode;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Placeholder for real Tuya API integration
  private async callTuyaAPI(endpoint: string, data?: unknown): Promise<unknown> {
    // TODO: Implement Tuya Cloud API authentication and requests
    // Reference: https://developer.tuya.com/en/docs/iot/api-reference
    
    // Steps for real implementation:
    // 1. Generate access token using clientId and clientSecret
    // 2. Sign the request with timestamp and signature
    // 3. Make HTTP request to accessUrl + endpoint
    // 4. Parse and return response
    
    logger.info(`[TuyaService] Tuya API call: ${this.accessUrl}${endpoint}`);
    return {};
  }
}

export const tuyaService = new TuyaService();
