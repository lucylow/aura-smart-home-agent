// aura-project/src/pages/DashboardPage.tsx
import React from 'react';
import { VoiceInput } from '../components/VoiceInput';
import { ContextPanel } from '../components/ContextPanel';
import { useMockScenes } from '../hooks/useMockScenes';
import { Zap } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { scenes, executeScene } = useMockScenes();

  return (
    <div className="dashboard-page">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">A.U.R.A. Dashboard</h1>
      
      <ContextPanel />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Orchestrator Input */}
        <div className="lg:col-span-2">
          <VoiceInput />
        </div>

        {/* Quick Scenes */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-teal-500" /> Quick Scenes
          </h2>
          <div className="space-y-3">
            {scenes.map(scene => (
              <div
                key={scene.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-teal-50 transition-colors cursor-pointer"
                onClick={() => executeScene(scene.id)}
              >
                <div>
                  <p className="font-medium">{scene.icon} {scene.name}</p>
                  <p className="text-sm text-gray-500">{scene.description}</p>
                </div>
                <button className="text-teal-600 hover:text-teal-800 font-semibold text-sm">
                  Run
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
