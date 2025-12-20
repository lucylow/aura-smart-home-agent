// aura-project/src/hooks/useAuraOrchestrator.ts
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMockContext } from './useMockContext';

// Define types for the frontend to use
export interface PlanStep {
  id: string;
  order: number;
  specialist: string;
  description: string;
  devices: string[];
  deviceIds?: string[];
  action?: string;
  params?: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  executionTime?: number; // ms taken to execute
}

export interface PlanResult {
  ok: boolean;
  planId: string;
  goalText: string;
  steps: PlanStep[];
  mode: 'plan';
  source?: 'tuya' | 'mock';
  estimatedDuration?: number;
}

export interface ExecuteResult {
  ok: boolean;
  planId: string;
  overallStatus: 'success' | 'partial' | 'failed';
  steps: PlanStep[];
  mode: 'execute';
  source?: 'tuya' | 'mock';
  totalExecutionTime?: number;
}

// Mock user ID for demo
const MOCK_USER_ID = 'demo-user-12345';

// Realistic device names mapped to Tuya-style categories
const REALISTIC_DEVICES = {
  lights: [
    { id: 'dev-light-living', name: 'Living Room Light', category: 'dj' },
    { id: 'dev-light-bedroom', name: 'Bedroom Light', category: 'dj' },
    { id: 'dev-light-kitchen', name: 'Kitchen Light', category: 'dj' },
    { id: 'dev-light-hallway', name: 'Hallway Light', category: 'dj' },
  ],
  locks: [
    { id: 'dev-lock-front', name: 'Front Door Lock', category: 'ms' },
    { id: 'dev-lock-back', name: 'Back Door Lock', category: 'ms' },
  ],
  thermostats: [
    { id: 'dev-therm-main', name: 'Main Thermostat', category: 'wk' },
  ],
  blinds: [
    { id: 'dev-blind-living', name: 'Living Room Blinds', category: 'cl' },
    { id: 'dev-blind-bedroom', name: 'Bedroom Blinds', category: 'cl' },
  ],
  speakers: [
    { id: 'dev-speaker-living', name: 'Living Room Speaker', category: 'sp' },
  ],
  tvs: [
    { id: 'dev-tv-living', name: 'Living Room TV', category: 'tv' },
  ],
};

// Generate a deterministic plan ID from goal text
function generatePlanId(goalText: string): string {
  let h = 0;
  for (let i = 0; i < goalText.length; i++) h = (Math.imul(31, h) + goalText.charCodeAt(i)) | 0;
  return `plan-${('00000000' + (h >>> 0).toString(16)).slice(-8)}`;
}

// Generate realistic mock plan steps based on goal text
function generateMockPlan(goalText: string, context: ReturnType<typeof useMockContext>): PlanStep[] {
  const lower = goalText.toLowerCase();
  const baseId = generatePlanId(goalText);
  const steps: PlanStep[] = [];
  
  // Add context-aware descriptions
  const timeContext = context.timeOfDay;
  const tempContext = context.weather.temperature;

  if (lower.includes('movie') || lower.includes('dim') || lower.includes('cinema')) {
    steps.push(
      { 
        id: `${baseId}-1`, 
        order: 1, 
        specialist: 'AmbianceSpecialist', 
        description: 'Dimming living room lights to 15% for cinema atmosphere', 
        devices: ['Living Room Light'],
        deviceIds: ['dev-light-living'],
        action: 'dim',
        params: { brightness: 15 },
        status: 'pending' 
      },
      { 
        id: `${baseId}-2`, 
        order: 2, 
        specialist: 'AmbianceSpecialist', 
        description: 'Closing living room blinds to block outside light', 
        devices: ['Living Room Blinds'],
        deviceIds: ['dev-blind-living'],
        action: 'close',
        status: 'pending' 
      },
      { 
        id: `${baseId}-3`, 
        order: 3, 
        specialist: 'AmbianceSpecialist', 
        description: 'Powering on TV and setting volume to 40%', 
        devices: ['Living Room TV', 'Living Room Speaker'],
        deviceIds: ['dev-tv-living', 'dev-speaker-living'],
        action: 'turnOn',
        params: { volume: 40 },
        status: 'pending' 
      },
      { 
        id: `${baseId}-4`, 
        order: 4, 
        specialist: 'SecuritySpecialist', 
        description: 'Locking front door for privacy', 
        devices: ['Front Door Lock'],
        deviceIds: ['dev-lock-front'],
        action: 'lock',
        status: 'pending' 
      }
    );
  } else if (lower.includes('goodnight') || lower.includes('sleep') || lower.includes('bed')) {
    steps.push(
      { 
        id: `${baseId}-1`, 
        order: 1, 
        specialist: 'AmbianceSpecialist', 
        description: 'Turning off all living area lights', 
        devices: ['Living Room Light', 'Kitchen Light', 'Hallway Light'],
        deviceIds: ['dev-light-living', 'dev-light-kitchen', 'dev-light-hallway'],
        action: 'turnOff',
        status: 'pending' 
      },
      { 
        id: `${baseId}-2`, 
        order: 2, 
        specialist: 'AmbianceSpecialist', 
        description: 'Setting bedroom light to warm night mode (5%)', 
        devices: ['Bedroom Light'],
        deviceIds: ['dev-light-bedroom'],
        action: 'dim',
        params: { brightness: 5, colorTemp: 2700 },
        status: 'pending' 
      },
      { 
        id: `${baseId}-3`, 
        order: 3, 
        specialist: 'EnergySpecialist', 
        description: `Setting thermostat to sleep temperature (${timeContext === 'night' ? '68' : '70'}°F)`, 
        devices: ['Main Thermostat'],
        deviceIds: ['dev-therm-main'],
        action: 'setTemperature',
        params: { temperature: timeContext === 'night' ? 68 : 70 },
        status: 'pending' 
      },
      { 
        id: `${baseId}-4`, 
        order: 4, 
        specialist: 'SecuritySpecialist', 
        description: 'Securing all entry points - locking front and back doors', 
        devices: ['Front Door Lock', 'Back Door Lock'],
        deviceIds: ['dev-lock-front', 'dev-lock-back'],
        action: 'lock',
        status: 'pending' 
      }
    );
  } else if (lower.includes('leaving') || lower.includes('away') || lower.includes('bye')) {
    steps.push(
      { 
        id: `${baseId}-1`, 
        order: 1, 
        specialist: 'EnergySpecialist', 
        description: `Setting thermostat to eco mode (${tempContext > 80 ? '78' : '65'}°F)`, 
        devices: ['Main Thermostat'],
        deviceIds: ['dev-therm-main'],
        action: 'setTemperature',
        params: { temperature: tempContext > 80 ? 78 : 65 },
        status: 'pending' 
      },
      { 
        id: `${baseId}-2`, 
        order: 2, 
        specialist: 'AmbianceSpecialist', 
        description: 'Powering off all lights and entertainment', 
        devices: ['Living Room Light', 'Bedroom Light', 'Kitchen Light', 'Living Room TV'],
        deviceIds: ['dev-light-living', 'dev-light-bedroom', 'dev-light-kitchen', 'dev-tv-living'],
        action: 'turnOff',
        status: 'pending' 
      },
      { 
        id: `${baseId}-3`, 
        order: 3, 
        specialist: 'AmbianceSpecialist', 
        description: 'Closing all blinds for security and energy efficiency', 
        devices: ['Living Room Blinds', 'Bedroom Blinds'],
        deviceIds: ['dev-blind-living', 'dev-blind-bedroom'],
        action: 'close',
        status: 'pending' 
      },
      { 
        id: `${baseId}-4`, 
        order: 4, 
        specialist: 'SecuritySpecialist', 
        description: 'Engaging all door locks and arming security', 
        devices: ['Front Door Lock', 'Back Door Lock'],
        deviceIds: ['dev-lock-front', 'dev-lock-back'],
        action: 'lock',
        status: 'pending' 
      }
    );
  } else if (lower.includes('morning') || lower.includes('wake') || lower.includes('good morning')) {
    steps.push(
      { 
        id: `${baseId}-1`, 
        order: 1, 
        specialist: 'AmbianceSpecialist', 
        description: 'Gradually brightening bedroom lights to 60%', 
        devices: ['Bedroom Light'],
        deviceIds: ['dev-light-bedroom'],
        action: 'dim',
        params: { brightness: 60, colorTemp: 5000 },
        status: 'pending' 
      },
      { 
        id: `${baseId}-2`, 
        order: 2, 
        specialist: 'AmbianceSpecialist', 
        description: 'Opening bedroom blinds to let in natural light', 
        devices: ['Bedroom Blinds'],
        deviceIds: ['dev-blind-bedroom'],
        action: 'open',
        status: 'pending' 
      },
      { 
        id: `${baseId}-3`, 
        order: 3, 
        specialist: 'EnergySpecialist', 
        description: 'Setting thermostat to comfortable 72°F', 
        devices: ['Main Thermostat'],
        deviceIds: ['dev-therm-main'],
        action: 'setTemperature',
        params: { temperature: 72 },
        status: 'pending' 
      },
      { 
        id: `${baseId}-4`, 
        order: 4, 
        specialist: 'AmbianceSpecialist', 
        description: 'Turning on kitchen light for breakfast prep', 
        devices: ['Kitchen Light'],
        deviceIds: ['dev-light-kitchen'],
        action: 'turnOn',
        status: 'pending' 
      }
    );
  } else if (lower.includes('party') || lower.includes('guests') || lower.includes('entertain')) {
    steps.push(
      { 
        id: `${baseId}-1`, 
        order: 1, 
        specialist: 'AmbianceSpecialist', 
        description: 'Setting living room lights to vibrant party mode (80%)', 
        devices: ['Living Room Light'],
        deviceIds: ['dev-light-living'],
        action: 'dim',
        params: { brightness: 80, colorTemp: 4000 },
        status: 'pending' 
      },
      { 
        id: `${baseId}-2`, 
        order: 2, 
        specialist: 'AmbianceSpecialist', 
        description: 'Powering on speaker system with party volume', 
        devices: ['Living Room Speaker'],
        deviceIds: ['dev-speaker-living'],
        action: 'turnOn',
        params: { volume: 65 },
        status: 'pending' 
      },
      { 
        id: `${baseId}-3`, 
        order: 3, 
        specialist: 'EnergySpecialist', 
        description: 'Cooling down for guests - setting thermostat to 70°F', 
        devices: ['Main Thermostat'],
        deviceIds: ['dev-therm-main'],
        action: 'setTemperature',
        params: { temperature: 70 },
        status: 'pending' 
      },
      { 
        id: `${baseId}-4`, 
        order: 4, 
        specialist: 'SecuritySpecialist', 
        description: 'Unlocking front door for easy guest access', 
        devices: ['Front Door Lock'],
        deviceIds: ['dev-lock-front'],
        action: 'unlock',
        status: 'pending' 
      }
    );
  } else {
    // Generic intelligent plan based on context
    steps.push(
      { 
        id: `${baseId}-1`, 
        order: 1, 
        specialist: 'AmbianceSpecialist', 
        description: `Adjusting lighting for ${timeContext} ambiance: "${goalText}"`, 
        devices: ['Living Room Light', 'Hallway Light'],
        deviceIds: ['dev-light-living', 'dev-light-hallway'],
        action: timeContext === 'night' ? 'dim' : 'turnOn',
        params: { brightness: timeContext === 'night' ? 40 : 75 },
        status: 'pending' 
      },
      { 
        id: `${baseId}-2`, 
        order: 2, 
        specialist: 'EnergySpecialist', 
        description: 'Optimizing climate for comfort and efficiency', 
        devices: ['Main Thermostat'],
        deviceIds: ['dev-therm-main'],
        action: 'setTemperature',
        params: { temperature: 72 },
        status: 'pending' 
      },
      { 
        id: `${baseId}-3`, 
        order: 3, 
        specialist: 'SecuritySpecialist', 
        description: 'Verifying security status of entry points', 
        devices: ['Front Door Lock'],
        deviceIds: ['dev-lock-front'],
        action: 'lock',
        status: 'pending' 
      }
    );
  }
  
  return steps;
}

// Simulate realistic execution timing for each action type
function getRealisticExecutionTime(action?: string): number {
  const baseTime = 200;
  const variance = Math.random() * 300;
  
  switch (action) {
    case 'dim':
      return baseTime + 400 + variance; // Lights take a moment to dim
    case 'turnOn':
    case 'turnOff':
      return baseTime + 200 + variance;
    case 'lock':
    case 'unlock':
      return baseTime + 600 + variance; // Locks are slower
    case 'open':
    case 'close':
      return baseTime + 800 + variance; // Blinds are slowest
    case 'setTemperature':
      return baseTime + 300 + variance;
    default:
      return baseTime + 300 + variance;
  }
}

export const useAuraOrchestrator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMockMode, setUseMockMode] = useState(false);
  const [executingSteps, setExecutingSteps] = useState<PlanStep[]>([]);
  const abortRef = useRef(false);
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
    abortRef.current = false;

    try {
      // Try Supabase edge function first
      const result = await callEdgeFunction({
        mode: 'plan',
        goalText,
        enableVoiceFeedback: options.enableVoiceFeedback,
      });

      if (!result.usedMock && result.data) {
        setUseMockMode(false);
        const estimatedDuration = result.data.steps.reduce((acc: number, step: PlanStep) => 
          acc + getRealisticExecutionTime(step.action), 0);
        return { ...result.data, estimatedDuration } as PlanResult;
      }

      // Fallback to mock data with realistic delay
      setUseMockMode(true);
      console.log('🏠 A.U.R.A. Mock Mode: Generating plan for:', goalText);
      
      // Simulate AI "thinking" time
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
      
      const planId = generatePlanId(goalText);
      const steps = generateMockPlan(goalText, context);
      const estimatedDuration = steps.reduce((acc, step) => acc + getRealisticExecutionTime(step.action), 0);
      
      return {
        ok: true,
        mode: 'plan',
        planId,
        goalText,
        steps,
        source: 'mock',
        estimatedDuration,
      };
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callEdgeFunction, context]);

  const executePlan = useCallback(async (planId: string, steps: PlanStep[], options: { enableVoiceFeedback?: boolean } = {}): Promise<ExecuteResult> => {
    setIsLoading(true);
    setError(null);
    abortRef.current = false;

    try {
      // Try Supabase edge function first
      const result = await callEdgeFunction({
        mode: 'execute',
        planId,
        steps,
        enableVoiceFeedback: options.enableVoiceFeedback,
      });

      if (!result.usedMock && result.data) {
        setUseMockMode(false);
        return result.data as ExecuteResult;
      }

      // Fallback to realistic mock execution with step-by-step animation
      setUseMockMode(true);
      console.log('🏠 A.U.R.A. Mock Mode: Executing plan:', planId);
      
      const executedSteps: PlanStep[] = [];
      let totalTime = 0;
      let hasFailure = false;
      
      // Execute steps one by one with realistic timing
      for (let i = 0; i < steps.length; i++) {
        if (abortRef.current) break;
        
        const step = steps[i];
        const execTime = getRealisticExecutionTime(step.action);
        
        // Update step to running
        const runningStep = { ...step, status: 'running' as const };
        setExecutingSteps([...executedSteps, runningStep, ...steps.slice(i + 1)]);
        
        // Simulate execution time
        await new Promise(resolve => setTimeout(resolve, execTime));
        
        // 95% success rate for realism
        const success = Math.random() > 0.05;
        const completedStep: PlanStep = {
          ...step,
          status: success ? 'completed' : 'failed',
          executionTime: execTime,
        };
        
        if (!success) hasFailure = true;
        totalTime += execTime;
        executedSteps.push(completedStep);
        
        // Log device actions for realism
        console.log(`✓ ${step.specialist}: ${step.description} (${execTime}ms)`);
      }

      setExecutingSteps([]);
      
      return {
        ok: true,
        mode: 'execute',
        planId,
        overallStatus: hasFailure ? 'partial' : 'success',
        steps: executedSteps,
        source: 'mock',
        totalExecutionTime: totalTime,
      };
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [callEdgeFunction]);

  const abortExecution = useCallback(() => {
    abortRef.current = true;
  }, []);

  // Mock fetchHistory with realistic data
  const fetchHistory = useCallback(async () => {
    console.log('📊 Fetching execution history (mock)...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      { id: 'hist-1', goal: 'Movie time', status: 'success', durationMs: 2340, startedAt: new Date(Date.now() - 3600000).toISOString() },
      { id: 'hist-2', goal: 'Goodnight', status: 'success', durationMs: 3120, startedAt: new Date(Date.now() - 86400000).toISOString() },
      { id: 'hist-3', goal: 'Good morning', status: 'partial', durationMs: 2890, startedAt: new Date(Date.now() - 172800000).toISOString() },
    ];
  }, []);

  return {
    isLoading,
    error,
    createPlan,
    executePlan,
    fetchHistory,
    abortExecution,
    useMockMode,
    executingSteps,
    context,
  };
};