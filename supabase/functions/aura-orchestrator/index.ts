// supabase/functions/aura-orchestrator/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- Configuration ---
// NOTE: BACKEND_BASE_URL should be set in Supabase environment variables
const BACKEND_BASE_URL = Deno.env.get('BACKEND_BASE_URL') || 'http://localhost:3001';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

interface AuraOrchestratorRequest {
  mode: 'plan' | 'execute' | 'history';
  goalText?: string;
  planId?: string;
  userId: string;
  enableVoiceFeedback?: boolean;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload: AuraOrchestratorRequest = await req.json();
    
    // Supabase client setup (using service role key for backend operations)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    let response;

    switch (payload.mode) {
      case 'plan':
        response = await handlePlanMode(payload, supabase);
        break;

      case 'execute':
        response = await handleExecuteMode(payload, supabase);
        break;

      case 'history':
        response = await handleHistoryMode(payload, supabase);
        break;

      default:
        return new Response(JSON.stringify({ ok: false, error: 'Unknown mode' }), {
          status: 400,
          headers: corsHeaders,
        });
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Edge Function Error:', err.message);
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handlePlanMode(
  payload: AuraOrchestratorRequest,
  supabase: any
): Promise<any> {
  const { goalText, userId } = payload;

  // 1. Call your backend orchestrator service (Node/Bun) to generate the plan
  const orchestratorResponse = await fetch(
    `${BACKEND_BASE_URL}/api/aura/goal`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: goalText, userId })
    }
  );

  if (!orchestratorResponse.ok) {
    const errorText = await orchestratorResponse.text();
    throw new Error(`Orchestrator service failed: ${orchestratorResponse.status} - ${errorText}`);
  }

  const { planId, steps } = await orchestratorResponse.json();

  // 2. Store plan in Supabase
  const { error } = await supabase
    .from('plans')
    .insert({
      id: planId,
      user_id: userId,
      goal_text: goalText,
      plan_data: { steps },
      created_at: new Date().toISOString()
    });

  if (error) throw error;

  return {
    ok: true,
    mode: 'plan',
    planId,
    goalText,
    steps
  };
}

async function handleExecuteMode(
  payload: AuraOrchestratorRequest,
  supabase: any
): Promise<any> {
  const { planId, userId, enableVoiceFeedback } = payload;

  // 1. Call backend execution engine
  const executionResponse = await fetch(
    `${BACKEND_BASE_URL}/api/aura/plan/${planId}/execute`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        enableVoiceFeedback
      })
    }
  );

  if (!executionResponse.ok) {
    const errorText = await executionResponse.text();
    throw new Error(`Execution failed: ${executionResponse.status} - ${errorText}`);
  }

  const executionLog = await executionResponse.json();

  // 2. Update plan record in Supabase
  const { error: planUpdateError } = await supabase
    .from('plans')
    .update({
      executed_at: new Date().toISOString(),
      execution_count: supabase.raw('execution_count + 1')
    })
    .eq('id', planId);

  if (planUpdateError) console.error('Error updating plan execution count:', planUpdateError);

  return {
    ok: true,
    mode: 'execute',
    planId,
    overallStatus: executionLog.overallStatus,
    steps: executionLog.steps
  };
}

async function handleHistoryMode(
  payload: AuraOrchestratorRequest,
  supabase: any
): Promise<any> {
  const { userId } = payload;

  const { data: logs, error } = await supabase
    .from('execution_logs')
    .select(`
      id,
      plan_id,
      overall_status,
      started_at,
      completed_at,
      plans(goal_text)
    `)
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(20);

  if (error) throw error;

  return {
    ok: true,
    mode: 'history',
    logs: logs.map((log: any) => ({
      executionId: log.id,
      planId: log.plan_id,
      goal: log.plans.goal_text,
      status: log.overall_status,
      startedAt: log.started_at,
      completedAt: log.completed_at
    }))
  };
}
