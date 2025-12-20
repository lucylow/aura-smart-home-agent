// aura-project/src/hooks/useMockUser.ts
import { useState, useCallback } from 'react';
import { VoiceProfile, UserPreferences } from '../lib/mockDataTypes';

// --- Voice Profile Mock ---
const initialVoiceProfile: VoiceProfile = {
  status: 'pending',
  voiceName: 'Aura Default',
  sampleCount: 0,
};

export const useMockVoice = () => {
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile>(initialVoiceProfile);

  const startCloning = useCallback((name: string) => {
    setVoiceProfile({ status: 'pending', voiceName: name, sampleCount: 0 });
  }, []);

  const recordSample = useCallback(() => {
    setVoiceProfile(prev => ({ ...prev, sampleCount: prev.sampleCount + 1 }));
  }, []);

  const startTraining = useCallback(() => {
    setVoiceProfile(prev => ({ ...prev, status: 'trained' }));
  }, []);

  return {
    voiceProfile,
    startCloning,
    recordSample,
    startTraining,
  };
};

// --- User Settings Mock ---
const initialPreferences: UserPreferences = {
  preferredTemp: 70,
  ecoMode: false,
  quietHours: { start: '22:00', end: '06:00' },
};

export const useMockSettings = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(initialPreferences);

  const updatePreference = useCallback((key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    preferences,
    updatePreference,
  };
};
