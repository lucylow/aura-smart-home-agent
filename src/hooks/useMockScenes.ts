// aura-project/src/hooks/useMockScenes.ts
import { useState, useCallback } from 'react';
import { Scene } from '../lib/mockDataTypes';
import { useMockDevices } from './useMockDevices';

const initialScenes: Scene[] = [
  {
    id: 'scn-1',
    name: 'Movie Time',
    icon: '🎬',
    description: 'Dims living room lights, locks the front door.',
    steps: [
      { deviceId: 'dvc-1', state: { power: true, brightness: 20, colorTemp: 2700 } },
      { deviceId: 'dvc-2', state: { locked: true } },
    ],
  },
  {
    id: 'scn-2',
    name: 'Goodnight',
    icon: '🌙',
    description: 'Turns off all lights, sets bedroom temp to 68F.',
    steps: [
      { deviceId: 'dvc-1', state: { power: false } },
      { deviceId: 'dvc-6', state: { power: false } },
      { deviceId: 'dvc-3', state: { temperature: 68 } },
    ],
  },
];

export const useMockScenes = () => {
  const [scenes, setScenes] = useState<Scene[]>(initialScenes);
  const { updateDeviceState } = useMockDevices();

  const createScene = useCallback((newScene: Omit<Scene, 'id'>) => {
    const scene: Scene = { ...newScene, id: `scn-${Date.now()}` };
    setScenes(prev => [...prev, scene]);
  }, []);

  const updateScene = useCallback((updatedScene: Scene) => {
    setScenes(prev => prev.map(s => (s.id === updatedScene.id ? updatedScene : s)));
  }, []);

  const deleteScene = useCallback((sceneId: string) => {
    setScenes(prev => prev.filter(s => s.id !== sceneId));
  }, []);

  const executeScene = useCallback((sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (scene) {
      scene.steps.forEach(step => {
        updateDeviceState(step.deviceId, step.state);
      });
      return true;
    }
    return false;
  }, [scenes, updateDeviceState]);

  return {
    scenes,
    createScene,
    updateScene,
    deleteScene,
    executeScene,
  };
};
