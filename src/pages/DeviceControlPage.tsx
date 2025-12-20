// aura-project/src/pages/DeviceControlPage.tsx
import React, { useState } from 'react';
import { useMockDevices } from '../hooks/useMockDevices';
import DeviceCard from '../components/DeviceCard';
import { Room } from '../lib/mockDataTypes';

export const DeviceControlPage: React.FC = () => {
  const { getDevicesByRoom, getRooms } = useMockDevices();
  const [selectedRoom, setSelectedRoom] = useState<Room | 'All'>('All');

  const rooms = getRooms();
  const filteredDevices = getDevicesByRoom(selectedRoom);

  return (
    <div className="device-control-page">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Device Control</h1>

      {/* Room Filter */}
      <div className="flex flex-wrap gap-3 mb-8 p-4 bg-white rounded-lg shadow">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedRoom === 'All' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setSelectedRoom('All')}
        >
          All Rooms ({getDevicesByRoom('All').length})
        </button>
        {rooms.map((room) => (
          <button
            key={room}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedRoom === room ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedRoom(room)}
          >
            {room} ({getDevicesByRoom(room).length})
          </button>
        ))}
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((device) => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No devices found in this room.</p>
      )}
    </div>
  );
};
