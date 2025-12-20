// aura-project/src/pages/SettingsPage.tsx
import React from 'react';
import { useMockSettings } from '../hooks/useMockUser';
import { Thermometer, Zap, Clock } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { preferences, updatePreference } = useMockSettings();

  return (
    <div className="settings-page max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User & System Settings</h1>

      <div className="space-y-6">
        {/* General Preferences */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">General Preferences</h2>
          
          <div className="flex justify-between items-center py-3 border-b">
            <div className="flex items-center">
              <Thermometer className="w-5 h-5 mr-3 text-red-500" />
              <label htmlFor="preferredTemp" className="text-lg font-medium">Preferred Temperature (°F)</label>
            </div>
            <input
              id="preferredTemp"
              type="number"
              min="60"
              max="80"
              value={preferences.preferredTemp}
              onChange={(e) => updatePreference('preferredTemp', parseInt(e.target.value))}
              className="w-20 p-2 border rounded-lg text-center"
            />
          </div>
        </div>

        {/* Energy & Safety */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Energy & Safety</h2>
          
          <div className="flex justify-between items-center py-3 border-b">
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-3 text-green-500" />
              <label htmlFor="ecoMode" className="text-lg font-medium">Eco Mode Optimization</label>
            </div>
            <button
              onClick={() => updatePreference('ecoMode', !preferences.ecoMode)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${preferences.ecoMode ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {preferences.ecoMode ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quiet Hours</h2>
          
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-3 text-blue-500" />
              <label className="text-lg font-medium">Quiet Hours (Start/End)</label>
            </div>
            <div className="flex space-x-2">
              <input
                type="time"
                value={preferences.quietHours.start}
                onChange={(e) => updatePreference('quietHours', { ...preferences.quietHours, start: e.target.value })}
                className="p-2 border rounded-lg"
              />
              <input
                type="time"
                value={preferences.quietHours.end}
                onChange={(e) => updatePreference('quietHours', { ...preferences.quietHours, end: e.target.value })}
                className="p-2 border rounded-lg"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">A.U.R.A. will minimize notifications and loud actions during these hours.</p>
        </div>
      </div>
    </div>
  );
};
