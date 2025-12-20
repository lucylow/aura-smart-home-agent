// aura-project/src/pages/ScenesPage.tsx
import React, { useState } from 'react';
import { useMockScenes } from '../hooks/useMockScenes';
import { useMockDevices } from '../hooks/useMockDevices';
import { Zap, Plus, Trash2, Edit, Play } from 'lucide-react';
import { Scene } from '../lib/mockDataTypes';

const SceneCard: React.FC<{ scene: Scene; onDelete: (id: string) => void; onExecute: (id: string) => void }> = ({ scene, onDelete, onExecute }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
    <div>
      <div className="flex items-center mb-2">
        <span className="text-3xl mr-3">{scene.icon}</span>
        <h2 className="text-xl font-semibold">{scene.name}</h2>
      </div>
      <p className="text-gray-600 mb-4">{scene.description}</p>
      <p className="text-sm text-gray-500">Steps: {scene.steps.length}</p>
    </div>
    <div className="flex justify-end space-x-2 mt-4">
      <button
        onClick={() => onExecute(scene.id)}
        className="flex items-center px-3 py-1 text-sm bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors"
      >
        <Play className="w-4 h-4 mr-1" /> Run
      </button>
      <button
        onClick={() => onDelete(scene.id)}
        className="p-1 text-red-500 hover:text-red-700 transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export const ScenesPage: React.FC = () => {
  const { scenes, createScene, deleteScene, executeScene } = useMockScenes();
  const { devices } = useMockDevices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newScene, setNewScene] = useState<Omit<Scene, 'id'>>({
    name: '',
    icon: '✨',
    description: '',
    steps: [],
  });

  const handleCreateScene = () => {
    if (newScene.name && newScene.steps.length > 0) {
      createScene(newScene);
      setIsModalOpen(false);
      setNewScene({ name: '', icon: '✨', description: '', steps: [] });
    }
  };

  const handleAddStep = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      setNewScene(prev => ({
        ...prev,
        steps: [...prev.steps, { deviceId, state: device.state }],
      }));
    }
  };

  return (
    <div className="scenes-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Smart Scenes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> Create New Scene
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            onDelete={deleteScene}
            onExecute={executeScene}
          />
        ))}
      </div>

      {/* Modal for creating a new scene */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Create New Scene</h2>
            <input
              type="text"
              placeholder="Scene Name (e.g., 'Reading Time')"
              value={newScene.name}
              onChange={(e) => setNewScene({ ...newScene, name: e.target.value })}
              className="w-full p-3 border rounded-lg mb-3"
            />
            <textarea
              placeholder="Description"
              value={newScene.description}
              onChange={(e) => setNewScene({ ...newScene, description: e.target.value })}
              className="w-full p-3 border rounded-lg mb-3"
            />
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Scene Steps ({newScene.steps.length})</h3>
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto border p-2 rounded-lg">
              {newScene.steps.map((step, index) => (
                <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                  {devices.find(d => d.id === step.deviceId)?.name}: {JSON.stringify(step.state)}
                </div>
              ))}
            </div>

            <select
              onChange={(e) => handleAddStep(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
              defaultValue=""
            >
              <option value="" disabled>Add Device to Scene</option>
              {devices.map(device => (
                <option key={device.id} value={device.id}>
                  {device.name} ({device.room})
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateScene}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                disabled={!newScene.name || newScene.steps.length === 0}
              >
                Create Scene
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
