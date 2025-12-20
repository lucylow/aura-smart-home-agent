// aura-project/src/hooks/useAuraOrchestrator.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMockContext } from './useMockContext';

// Define types for the frontend to use
export interface PlanStep {
  id: string;
  order: number;
  specialist: string;
  description: string;
  devices: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface PlanResult {
  ok: boolean;
  planId: string;
  goalText: string;
  steps: PlanStep[];
  mode: 'plan';
}

export interface ExecuteResult {
  ok: boolean;
  planId: string;
  overallStatus: 'success' | 'partial' | 'failed';
  steps: PlanStep[];
  mode: 'execute';
}

// Mock user ID for demo
const MOCK_USER_ID = 'demo-user-12345';

// Generate a deterministic plan ID from goal text
function generatePlanId(goalText: string): string {
  let h = 0;
  for (let i = 0; i < goalText.length; i++) h = (Math.imul(31, h) + goalText.charCodeAt(i)) | 0;
  return `plan-${('00000000' + (h >>> 0).toString(16)).slice(-8)}`;
}

// Generate mock plan steps based on goal text
function generateMockPlan(goalText: string): PlanStep[] {
  const lower = goalText.toLowerCase();
  const baseId = generatePlanId(goalText);
  
  const steps: PlanStep[] = [];
  
  if (lower.includes('movie') || lower.includes('dim')) {
    steps.push(
      { id: `${baseId}-1`, order: 1, specialist: 'AmbianceSpecialist', description: 'Dim living room lights to 20%', devices: ['living-room-light'], status: 'pending' },
      { id: `${baseId}-2`, order: 2, specialist: 'AmbianceSpecialist', description: 'Close window blinds', devices: ['living-room-blinds'], status: 'pending' },
      { id: `${baseId}-3`, order: 3, specialist: 'SecuritySpecialist', description: 'Lock front door', devices: ['front-door-lock'], status: 'pending' }
    );
  } else if (lower.includes('goodnight') || lower.includes('sleep')) {
    steps.push(
      { id: `${baseId}-1`, order: 1, specialist: 'AmbianceSpecialist', description: 'Turn off all lights', devices: ['living-room-light', 'bedroom-light'], status: 'pending' },
      { id: `${baseId}-2`, order: 2, specialist: 'EnergySpecialist', description: 'Set thermostat to 68°F', devices: ['thermostat'], status: 'pending' },
      { id: `${baseId}-3`, order: 3, specialist: 'SecuritySpecialist', description: 'Lock all doors', devices: ['front-door-lock', 'back-door-lock'], status: 'pending' }
    );
  } else if (lower.includes('leaving') || lower.includes('away')) {
    steps.push(
      { id: `${baseId}-1`, order: 1, specialist: 'EnergySpecialist', description: 'Set thermostat to eco mode (65°F)', devices: ['thermostat'], status: 'pending' },
      { id: `${baseId}-2`, order: 2, specialist: 'AmbianceSpecialist', description: 'Turn off all lights', devices: ['living-room-light', 'bedroom-light', 'kitchen-light'], status: 'pending' },
      { id: `${baseId}-3`, order: 3, specialist: 'SecuritySpecialist', description: 'Lock all doors and arm security', devices: ['front-door-lock', 'back-door-lock'], status: 'pending' }
    );
  } else if (lower.includes('morning') || lower.includes('wake')) {
    steps.push(
      { id: `${baseId}-1`, order: 1, specialist: 'AmbianceSpecialist', description: 'Gradually brighten bedroom lights', devices: ['bedroom-light'], status: 'pending' },
      { id: `${baseId}-2`, order: 2, specialist: 'AmbianceSpecialist', description: 'Open window blinds', devices: ['bedroom-blinds'], status: 'pending' },
      { id: `${baseId}-3`, order: 3, specialist: 'EnergySpecialist', description: 'Set thermostat to 72°F', devices: ['thermostat'], status: 'pending' }
    );
  } else {
    // Generic plan
    steps.push(
      { id: `${baseId}-1`, order: 1, specialist: 'AmbianceSpecialist', description: `Setting ambiance for: ${goalText}`, devices: ['living-room-light'], status: 'pending' },
      { id: `${baseId}-2`, order: 2, specialist: 'EnergySpecialist', description: 'Optimizing energy usage', devices: ['thermostat'], status: 'pending' },
      { id: `${baseId}-3`, order: 3, specialist: 'SecuritySpecialist', description: 'Checking security status', devices: ['front-door-lock'], status: 'pending' }
    );
  }
  
  return steps;
}

export const useAuraOrchestrator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMockMode, setUseMockMode] = useState(false);
  const context = useMockContext();

  const callEdgeFunction = useCallback(async (payload: any) => {
    try {
      const { data, error: edgeError } = await supabase.functions.invoke('aura-orchestrator', {
        body: { ...payload, userId: MOCK_USER_ID },
      });

      if (edgeError) {
        throw new Error(edgeError.message);
      }

      if (!data?.ok) {
        throw new Error(data?.error || 'Unknown error from orchestrator');
      }

      return { data, usedMock: false };
    } catch (err: any) {
      console.warn('Edge function failed, using mock data:', err.message);
      return { data: null, error: err, usedMock: true };
    }
  }, []);

  const createPlan = useCallback(async (goalText: string, options: { enableVoiceFeedback?: boolean } = {}): Promise<PlanResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Try Supabase edge function first
      const result = await callEdgeFunction({
        mode: 'plan',
        goalText,
        enableVoiceFeedback: options.enableVoiceFeedback,
      });

      if (!result.usedMock && result.data) {
        setUseMockMode(false);
        return result.data as PlanResult;
      }

      // Fallback to mock data
      setUseMockMode(true);
      console.log('Using mock plan generation for:', goalText);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const planId = generatePlanId(goalText);
      const steps = generateMockPlan(goalText);
      
      return {
        ok: true,
        mode: 'plan',
        planId,
        goalText,
        steps,
      };
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callEdgeFunction]);

  const executePlan = useCallback(async (planId: string, steps: PlanStep[], options: { enableVoiceFeedback?: boolean } = {}): Promise<ExecuteResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Try Supabase edge function first
      const result = await callEdgeFunction({
        mode: 'execute',
        planId,
        enableVoiceFeedback: options.enableVoiceFeedback,
      });

      if (!result.usedMock && result.data) {
        setUseMockMode(false);
        return result.data as ExecuteResult;
      }

      // Fallback to mock execution
      setUseMockMode(true);
      console.log('Using mock execution for plan:', planId);
      
      // Simulate execution delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const completedSteps = steps.map(step => ({
        ...step,
        status: 'completed' as const,
      }));
      
      return {
        ok: true,
        mode: 'execute',
        planId,
        overallStatus: 'success',
        steps: completedSteps,
      };
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callEdgeFunction]);

  // Mock fetchHistory for now
  const fetchHistory = useCallback(async () => {
    console.log('Fetching history (mock)...');
    return [];
  }, []);

  return {
    isLoading,
    error,
    createPlan,
    executePlan,
    fetchHistory,
    useMockMode,
    context,
  };
};