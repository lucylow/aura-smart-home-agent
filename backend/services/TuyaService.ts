// backend/services/TuyaService.ts
import { Device, ITuyaService } from '../agents/types';
import { demoDevices } from '../config/demo-fixtures';

// In a real application, this would use the Tuya Open API SDK
export class TuyaService implements ITuyaService {
  private mode: 'demo' | 'live';
  private deviceStates: Map<string, Record<string, any>>;

  constructor(mode: 'demo' | 'live' = 'demo') {
    this.mode = mode;
    this.deviceStates = new Map();
    // Initialize states for demo devices
    demoDevices.forEach(d => {
      this.deviceStates.set(d.id, { power: false, brightness: 50, colorTemp: 4000, temperature: 70 });
    });
  }

  async listDevices(deviceNames: string[]): Promise<Device[]> {
    if (this.mode === 'demo') {
      return demoDevices.filter(d => deviceNames.includes(d.name));
    }
    // Live mode: Call Tuya Open API to list devices
    console.log('Live mode: Fetching devices from Tuya Cloud...');
    return demoDevices.filter(d => deviceNames.includes(d.name)); // Mocking for now
  }

  async sendDeviceCommands(deviceId: string, commands: { dpId: number; value: any }[]): Promise<any> {
    if (this.mode === 'demo') {
      const currentState = this.deviceStates.get(deviceId) || {};
      const newState = { ...currentState };

      commands.forEach(cmd => {
        // Simple mapping for demo: dpId 1=power, 2=brightness, 3=colorTemp, 4=temperature
        if (cmd.dpId === 1) newState.power = cmd.value;
        if (cmd.dpId === 2) newState.brightness = cmd.value;
        if (cmd.dpId === 3) newState.colorTemp = cmd.value;
        if (cmd.dpId === 4) newState.temperature = cmd.value;
      });

      this.deviceStates.set(deviceId, newState);
      console.log(`[DEMO] Device ${deviceId} updated to:`, newState);
      return { success: true, newState };
    }
    // Live mode: Call Tuya Open API to send commands
    console.log(`Live mode: Sending commands to Tuya device ${deviceId}:`, commands);
    return { success: true }; // Mocking for now
  }

  async getDeviceState(deviceId: string): Promise<Record<string, any>> {
    if (this.mode === 'demo') {
      return this.deviceStates.get(deviceId) || {};
    }
    // Live mode: Call Tuya Open API to get device state
    console.log(`Live mode: Fetching state for Tuya device ${deviceId}`);
    return this.deviceStates.get(deviceId) || {}; // Mocking for now
  }
}

// Helper for demo fixtures
export const getDemoDevices = (): Device[] => demoDevices;
