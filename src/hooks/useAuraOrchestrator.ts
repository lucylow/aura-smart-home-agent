// aura-project/src/hooks/useAuraOrchestrator.ts
import { useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// Define types for the frontend to use
interface PlanStep {
  order: number;
  specialist: string;
  action: string;
  description: string;
  devices: string[];
  dpValues: Record<string, any>;
  estimatedDuration: number;
}

interface PlanResult {
  ok: boolean;
  planId: string;
  goalText: string;
  steps: PlanStep[];
}

interface ExecuteResult {
  ok: boolean;
  planId: string;
  overallStatus: 'success' | 'partial' | 'failed';
  steps: any[];
}

// Initialize Supabase client (using anon key for client-side)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// NOTE: In a real app, you would use the authenticated user's ID
const MOCK_USER_ID = 'mock-user-uuid-12345';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useAuraOrchestrator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callEdgeFunction = useCallback(async (payload: any) => {
    setIsLoading(true);
    setError(null);
    try {
      // Call the Supabase Edge Function
      const { data, error: edgeError } = await supabase.functions.invoke('aura-orchestrator', {
        body: { ...payload, userId: MOCK_USER_ID },
      });

      if (edgeError) {
        throw new Error(edgeError.message);
      }

      if (!data.ok) {
        throw new Error(data.error || 'Unknown error from orchestrator');
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      return { ok: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPlan = useCallback(async (goalText: string, options: { enableVoiceFeedback?: boolean } = {}): Promise<PlanResult> => {
    const result = await callEdgeFunction({
      mode: 'plan',
      goalText,
      enableVoiceFeedback: options.enableVoiceFeedback,
    });
    return result as PlanResult;
  }, [callEdgeFunction]);

  const executePlan = useCallback(async (planId: string, options: { enableVoiceFeedback?: boolean } = {}): Promise<ExecuteResult> => {
    const result = await callEdgeFunction({
      mode: 'execute',
      planId,
      enableVoiceFeedback: options.enableVoiceFeedback,
    });
    return result as ExecuteResult;
  }, [callEdgeFunction]);

  // Mock fetchHistory for now
  const fetchHistory = useCallback(async () => {
    console.log('Fetching history...');
    return [];
  }, []);

  return {
    isLoading,
    error,
    createPlan,
    executePlan,
    fetchHistory,
  };
};
