// backend/services/DeviceRegistry.ts
import { Device } from '../agents/types';
import { getDemoDevices } from '../config/demo-fixtures';

export class DeviceRegistry {
  private devices: Device[];

  constructor() {
    // Load demo devices for simplicity
    this.devices = getDemoDevices();
  }

  getDevices(userId: string): Device[] {
    // In a real app, filter by userId and fetch from Supabase
    return this.devices;
  }

  getDeviceByName(name: string): Device | undefined {
    return this.devices.find(d => d.name === name);
  }
}
