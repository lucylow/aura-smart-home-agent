// aura-project/src/components/ContextPanel.tsx
import React from 'react';
import { useMockContext } from '../hooks/useMockContext';
import { Sun, CloudRain, Thermometer, Users, Clock } from 'lucide-react';

export const ContextPanel: React.FC = () => {
  const context = useMockContext();

  const weatherIcon = context.weather.isRaining ? <CloudRain className="w-6 h-6 text-blue-500" /> : <Sun className="w-6 h-6 text-yellow-500" />;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Time of Day */}
      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Time of Day</p>
          <p className="text-xl font-semibold capitalize">{context.timeOfDay}</p>
        </div>
        <Clock className="w-6 h-6 text-teal-500" />
      </div>

      {/* Weather */}
      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Outdoor Temp</p>
          <p className="text-xl font-semibold">{context.weather.temperature}°F</p>
        </div>
        {weatherIcon}
      </div>

      {/* Indoor Temp */}
      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Indoor Temp</p>
          <p className="text-xl font-semibold">{context.indoorTemp}°F</p>
        </div>
        <Thermometer className="w-6 h-6 text-red-500" />
      </div>

      {/* Occupancy */}
      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Occupants</p>
          <p className="text-xl font-semibold">{context.occupancyCount}</p>
        </div>
        <Users className="w-6 h-6 text-green-500" />
      </div>
    </div>
  );
};
