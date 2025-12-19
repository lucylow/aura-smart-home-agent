/**
 * aura-orchestrator Edge Function
 *
 * TODO: When ready, set the real backend base URL in an env var named AURA_BACKEND_URL
 * and forward requests to `${AURA_BACKEND_URL}/plan` or `/execute`. For now this function
 * returns deterministic mocked plans for demo purposes.
 *
 * CORS: Allows all origins for development. Tighten in production.
 */

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type AuraOrchestratorRequest =
  | { mode: 'plan'; goalText: string; userId?: string | null }
  | { mode: 'execute'; planId: string; userId?: string | null };

type AuraPlanStep = {
  id: string;
  order: number;
  specialist: 'AmbianceSpecialist' | 'SecuritySpecialist' | 'EnergySpecialist' | string;
  description: string;
  devices: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
};

type AuraOrchestratorResponse =
  | { mode: 'plan'; ok: true; planId: string; goalText: string; steps: AuraPlanStep[] }
  | { mode: 'execute'; ok: true; planId: string; steps: AuraPlanStep[] }
  | { ok: false; error: string };

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });

function uuidFromText(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (Math.imul(31, h) + text.charCodeAt(i)) | 0;
  return ('00000000' + (h >>> 0).toString(16)).slice(-8);
}

function buildDemoPlan(goalText: string): { planId: string; steps: AuraPlanStep[] } {
  const baseId = uuidFromText(goalText + '|plan');
  const lower = goalText.toLowerCase();

  const possibleSteps: AuraPlanStep[] = [
    {
      id: `${baseId}-1`,
      order: 1,
      specialist: 'AmbianceSpecialist',
      description: `Set living room lights and start ambience for: ${goalText}`,
      devices: ['living-room-light', 'media-soundbar'],
      status: 'pending',
    },
    {
      id: `${baseId}-2`,
      order: 2,
      specialist: 'EnergySpecialist',
      description: 'Ensure energy-saving modes are applied where appropriate',
      devices: ['thermostat', 'smart-plug-tv'],
      status: 'pending',
    },
    {
      id: `${baseId}-3`,
      order: 3,
      specialist: 'SecuritySpecialist',
      description: 'Lock exterior doors and arm perimeter sensors if leaving home',
      devices: ['front-door-lock', 'back-door-lock'],
      status: 'pending',
    },
  ];

  // Adjust for quick scenarios
  if (lower.includes('movie')) {
    possibleSteps[0].description = `Dim lights, close blinds, set media volume for: ${goalText}`;
    possibleSteps[0].devices = ['living-room-light', 'living-room-blinds', 'media-soundbar'];
    possibleSteps[2].devices = ['front-door-lock'];
  } else if (lower.includes('goodnight') || lower.includes('good night')) {
    possibleSteps.unshift({
      id: `${baseId}-0`,
      order: 0,
      specialist: 'AmbianceSpecialist',
      description: 'Turn off upstairs lights and set bedroom to night mode',
      devices: ['upstairs-lights', 'bedroom-light'],
      status: 'pending',
    });
  } else if (lower.includes('leaving') || lower.includes('away')) {
    possibleSteps[1].description = 'Set thermostat to away temperature and turn off unnecessary devices';
    possibleSteps[1].devices = ['thermostat', 'kitchen-light', 'smart-plug-coffee'];
  } else if (lower.includes('morning') || lower.includes('wake')) {
    possibleSteps[0].description = 'Open blinds, set energizing lights, start coffee maker';
    possibleSteps[0].devices = ['bedroom-blinds', 'kitchen-light', 'coffee-maker'];
    possibleSteps[1].description = 'Set thermostat to comfortable temperature';
  }

  // Normalize order
  const steps = possibleSteps
    .sort((a, b) => a.order - b.order)
    .map((s, idx) => ({ ...s, order: idx + 1 }));

  const planId = `plan-${baseId}`;

  return { planId, steps };
}

serve(async (req: Request) => {
  console.log(`[aura-orchestrator] ${req.method} request received`);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed, use POST' }, 405);
  }

  let body: any;
  try {
    body = await req.json();
    console.log('[aura-orchestrator] Request body:', JSON.stringify(body));
  } catch (err) {
    console.error('[aura-orchestrator] Invalid JSON:', err);
    return jsonResponse({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  // Basic validation
  if (!body || typeof body !== 'object' || !('mode' in body)) {
    return jsonResponse({ ok: false, error: 'Missing or invalid "mode" field' }, 400);
  }

  const mode = body.mode as string;

  if (mode === 'plan') {
    const { goalText, userId } = body as AuraOrchestratorRequest & { goalText?: string };
    if (!goalText || typeof goalText !== 'string' || goalText.trim() === '') {
      return jsonResponse({ ok: false, error: 'Missing or empty goalText' }, 400);
    }

    console.log(`[aura-orchestrator] Planning for goal: "${goalText}" (user: ${userId || 'anonymous'})`);

    // TODO: Forward to real backend:
    // const BACKEND_BASE_URL = Deno.env.get('AURA_BACKEND_URL');
    // await fetch(`${BACKEND_BASE_URL}/plan`, { method: 'POST', body: JSON.stringify({ goalText, userId }) });

    const { planId, steps } = buildDemoPlan(goalText);

    const resp: AuraOrchestratorResponse = {
      mode: 'plan',
      ok: true,
      planId,
      goalText,
      steps,
    };
    console.log(`[aura-orchestrator] Plan created: ${planId} with ${steps.length} steps`);
    return jsonResponse(resp, 200);
  } else if (mode === 'execute') {
    const { planId, userId } = body as AuraOrchestratorRequest & { planId?: string };
    if (!planId || typeof planId !== 'string') {
      return jsonResponse({ ok: false, error: 'Missing or invalid planId' }, 400);
    }

    console.log(`[aura-orchestrator] Executing plan: ${planId} (user: ${userId || 'anonymous'})`);

    // TODO: Forward to real backend:
    // const BACKEND_BASE_URL = Deno.env.get('AURA_BACKEND_URL');
    // const result = await fetch(`${BACKEND_BASE_URL}/execute`, { method: 'POST', body: JSON.stringify({ planId, userId }) });

    // For demo, reconstruct steps from planId (best-effort) and mark completed
    const demoGoal = planId.replace(/^plan-/, '');
    const { steps } = buildDemoPlan(demoGoal);

    const completed = steps.map((s) => ({ ...s, status: 'completed' as const }));

    const resp: AuraOrchestratorResponse = {
      mode: 'execute',
      ok: true,
      planId,
      steps: completed,
    };
    console.log(`[aura-orchestrator] Execution complete for ${planId}`);
    return jsonResponse(resp, 200);
  } else {
    return jsonResponse({ ok: false, error: 'Unsupported mode' }, 400);
  }
});
