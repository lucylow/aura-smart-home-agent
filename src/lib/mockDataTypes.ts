// aura-project/src/lib/mockDataTypes.ts

export type DeviceType = 'light' | 'thermostat' | 'lock' | 'plug' | 'sensor';
export type Room = 'Living Room' | 'Kitchen' | 'Bedroom' | 'Entrance' | 'Office';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: Room;
  isOnline: boolean;
  state: {
    power?: boolean;
    brightness?: number; // 0-100
    colorTemp?: number; // 2700-6500K
    temperature?: number; // F
    locked?: boolean;
    battery?: number; // 0-100
    airQuality?: number; // AQI
  };
}

export interface Scene {
  id: string;
  name: string;
  icon: string;
  description: string;
  steps: { deviceId: string; state: Partial<Device['state']> }[];
}

export interface AutomationRule {
  id: string;
  name: string;
  isEnabled: boolean;
  trigger: { type: 'time' | 'sensor' | 'event'; value: string };
  action: { type: 'scene' | 'device'; targetId: string };
}

export interface ExecutionLog {
  id: string;
  goal: string;
  status: 'success' | 'partial' | 'failed';
  durationMs: number;
  startedAt: string;
}

export interface ContextData {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  weather: {
    summary: string;
    temperature: number;
    isRaining: boolean;
  };
  occupancyCount: number;
  indoorTemp: number;
}

export interface VoiceProfile {
  status: 'pending' | 'trained' | 'failed';
  voiceName: string;
  sampleCount: number;
}

export interface UserPreferences {
  preferredTemp: number;
  ecoMode: boolean;
  quietHours: { start: string; end: string };
}
