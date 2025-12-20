// aura-project/src/components/DeviceCard.tsx
import React from 'react';
import { Device } from '../lib/mockDataTypes';
import { useMockDevices } from '../hooks/useMockDevices';
import { Lightbulb, Thermometer, Lock, Plug, Wifi, Battery, AirVent } from 'lucide-react';

interface DeviceCardProps {
  device: Device;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const { updateDeviceState } = useMockDevices();

  const handleTogglePower = () => {
    updateDeviceState(device.id, { power: !device.state.power });
  };

  const handleSliderChange = (key: keyof Device['state'], value: number) => {
    updateDeviceState(device.id, { [key]: value });
  };

  const Icon = {
    light: Lightbulb,
    thermostat: Thermometer,
    lock: Lock,
    plug: Plug,
    sensor: AirVent,
  }[device.type];

  const powerClass = device.state.power ? 'bg-teal-500 hover:bg-teal-600' : 'bg-gray-300 hover:bg-gray-400';

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Icon className="w-6 h-6 mr-3 text-teal-600" />
          <div>
            <h3 className="text-lg font-semibold">{device.name}</h3>
            <p className="text-sm text-gray-500">{device.room} | {device.type}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Wifi className={`w-4 h-4 ${device.isOnline ? 'text-green-500' : 'text-red-500'}`} />
          {device.state.battery && (
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Battery className="w-3 h-3 mr-1" /> {device.state.battery}%
            </div>
          )}
        </div>
      </div>

      {/* Type-Specific Controls */}
      <div className="space-y-3 mt-2">
        {/* Power Toggle for Light/Plug */}
        {(device.type === 'light' || device.type === 'plug') && (
          <button
            onClick={handleTogglePower}
            className={`w-full py-2 rounded-lg text-white font-medium transition-colors ${powerClass}`}
          >
            {device.state.power ? 'ON' : 'OFF'}
          </button>
        )}

        {/* Light Controls */}
        {device.type === 'light' && device.state.power && (
          <>
            <div className="control-group">
              <label className="text-sm font-medium text-gray-700">Brightness: {device.state.brightness}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={device.state.brightness || 0}
                onChange={(e) => handleSliderChange('brightness', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
              />
            </div>
            <div className="control-group">
              <label className="text-sm font-medium text-gray-700">Color Temp: {device.state.colorTemp}K</label>
              <input
                type="range"
                min="2700"
                max="6500"
                value={device.state.colorTemp || 4000}
                onChange={(e) => handleSliderChange('colorTemp', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
              />
            </div>
          </>
        )}

        {/* Thermostat Controls */}
        {device.type === 'thermostat' && (
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-teal-600">{device.state.temperature}°F</span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleSliderChange('temperature', (device.state.temperature || 70) - 1)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                -
              </button>
              <button
                onClick={() => handleSliderChange('temperature', (device.state.temperature || 70) + 1)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Lock Controls */}
        {device.type === 'lock' && (
          <button
            onClick={() => updateDeviceState(device.id, { locked: !device.state.locked })}
            className={`w-full py-2 rounded-lg text-white font-medium transition-colors ${device.state.locked ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {device.state.locked ? 'LOCKED' : 'UNLOCKED'}
          </button>
        )}

        {/* Sensor Display */}
        {device.type === 'sensor' && (
          <div className="text-center p-2 bg-teal-50 rounded-lg">
            <p className="text-sm text-gray-600">Air Quality Index (AQI)</p>
            <p className="text-2xl font-bold text-teal-600">{device.state.airQuality}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceCard;
