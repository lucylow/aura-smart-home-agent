import { supabase } from "@/integrations/supabase/client";

export type AuraOrchestratorRequest =
  | { mode: 'plan'; goalText: string; userId?: string | null }
  | { mode: 'execute'; planId: string; userId?: string | null };

export type AuraPlanStep = {
  id: string;
  order: number;
  specialist: string;
  description: string;
  devices: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
};

export type AuraOrchestratorResponse =
  | { mode: 'plan'; ok: true; planId: string; goalText: string; steps: AuraPlanStep[] }
  | { mode: 'execute'; ok: true; planId: string; steps: AuraPlanStep[] }
  | { ok: false; error: string };

export async function callAuraOrchestrator(
  payload: AuraOrchestratorRequest
): Promise<AuraOrchestratorResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('aura-orchestrator', {
      body: payload,
    });

    if (error) {
      console.error('aura-orchestrator error', error);
      return { ok: false, error: error.message ?? 'Unknown error' } as AuraOrchestratorResponse;
    }

    return data as AuraOrchestratorResponse;
  } catch (err: any) {
    console.error('aura-orchestrator exception', err);
    return { ok: false, error: err?.message ?? 'Network error' };
  }
}

// Quick scenario goal texts
export const QUICK_SCENARIOS = {
  movie: "Movie time in the living room",
  goodnight: "Goodnight, shut down the house for sleep",
  leaving: "I'm leaving home, secure and save energy",
  morning: "Good morning, wake up the house",
} as const;
