// aura-project/src/hooks/useMockDevices.ts
import { useState, useCallback } from 'react';
import { Device, DeviceType, Room } from '../lib/mockDataTypes';

const initialDevices: Device[] = [
  {
    id: 'dvc-1',
    name: 'Living Room Light',
    type: 'light',
    room: 'Living Room',
    isOnline: true,
    state: { power: true, brightness: 75, colorTemp: 4500 },
  },
  {
    id: 'dvc-2',
    name: 'Front Door Lock',
    type: 'lock',
    room: 'Entrance',
    isOnline: true,
    state: { locked: true, battery: 85 },
  },
  {
    id: 'dvc-3',
    name: 'Bedroom Thermostat',
    type: 'thermostat',
    room: 'Bedroom',
    isOnline: true,
    state: { temperature: 72 },
  },
  {
    id: 'dvc-4',
    name: 'Kitchen Plug',
    type: 'plug',
    room: 'Kitchen',
    isOnline: true,
    state: { power: false },
  },
  {
    id: 'dvc-5',
    name: 'Office Air Sensor',
    type: 'sensor',
    room: 'Office',
    isOnline: true,
    state: { airQuality: 45 },
  },
  {
    id: 'dvc-6',
    name: 'Bedroom Light',
    type: 'light',
    room: 'Bedroom',
    isOnline: true,
    state: { power: false, brightness: 50, colorTemp: 3000 },
  },
];

export const useMockDevices = () => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);

  const updateDeviceState = useCallback((deviceId: string, newState: Partial<Device['state']>) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === deviceId
          ? { ...device, state: { ...device.state, ...newState } }
          : device
      )
    );
  }, []);

  const getDeviceById = useCallback((deviceId: string) => {
    return devices.find(d => d.id === deviceId);
  }, [devices]);

  const getDevicesByRoom = useCallback((room: Room | 'All') => {
    if (room === 'All') return devices;
    return devices.filter(d => d.room === room);
  }, [devices]);

  const getRooms = useCallback(() => {
    const rooms = devices.map(d => d.room);
    return Array.from(new Set(rooms));
  }, [devices]);

  return {
    devices,
    updateDeviceState,
    getDeviceById,
    getDevicesByRoom,
    getRooms,
  };
};
