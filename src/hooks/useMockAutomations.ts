// aura-project/src/hooks/useMockAutomations.ts
import { useState, useCallback } from 'react';
import { AutomationRule } from '../lib/mockDataTypes';

const initialAutomations: AutomationRule[] = [
  {
    id: 'auto-1',
    name: 'Evening Ambiance',
    isEnabled: true,
    trigger: { type: 'time', value: '18:00' },
    action: { type: 'scene', targetId: 'scn-1' }, // Movie Time
  },
  {
    id: 'auto-2',
    name: 'Away Mode Security',
    isEnabled: false,
    trigger: { type: 'event', value: 'User Leaves Home' },
    action: { type: 'device', targetId: 'dvc-2' }, // Lock Front Door
  },
];

export const useMockAutomations = () => {
  const [automations, setAutomations] = useState<AutomationRule[]>(initialAutomations);

  const toggleAutomation = useCallback((automationId: string) => {
    setAutomations(prev =>
      prev.map(auto =>
        auto.id === automationId ? { ...auto, isEnabled: !auto.isEnabled } : auto
      )
    );
  }, []);

  const createAutomation = useCallback((newAuto: Omit<AutomationRule, 'id'>) => {
    const automation: AutomationRule = { ...newAuto, id: `auto-${Date.now()}` };
    setAutomations(prev => [...prev, automation]);
  }, []);

  const deleteAutomation = useCallback((automationId: string) => {
    setAutomations(prev => prev.filter(a => a.id !== automationId));
  }, []);

  return {
    automations,
    toggleAutomation,
    createAutomation,
    deleteAutomation,
  };
};
