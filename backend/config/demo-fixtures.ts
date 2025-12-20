// backend/config/demo-fixtures.ts
import { Device } from '../agents/types';

export const demoDevices: Device[] = [
  {
    id: 'dvc-1',
    tuya_device_id: 'vdevo12345678901234567',
    name: 'Living Room Light',
    type: 'light',
    room: 'Living Room',
    dpIds: { power: 1, brightness: 2, colorTemp: 3 },
    is_online: true,
    current_state: { power: true, brightness: 75, colorTemp: 4500 },
  },
  {
    id: 'dvc-2',
    tuya_device_id: 'vdevo12345678901234568',
    name: 'Front Door Lock',
    type: 'lock',
    room: 'Entrance',
    dpIds: { lock: 1, battery: 2 },
    is_online: true,
    current_state: { lock: 'locked', battery: 85 },
  },
  {
    id: 'dvc-3',
    tuya_device_id: 'vdevo12345678901234569',
    name: 'Bedroom Thermostat',
    type: 'thermostat',
    room: 'Bedroom',
    dpIds: { temperature: 4, mode: 5 },
    is_online: true,
    current_state: { temperature: 72, mode: 'cool' },
  },
  {
    id: 'dvc-4',
    tuya_device_id: 'vdevo12345678901234570',
    name: 'Kitchen Plug',
    type: 'plug',
    room: 'Kitchen',
    dpIds: { power: 1 },
    is_online: true,
    current_state: { power: false },
  },
];
