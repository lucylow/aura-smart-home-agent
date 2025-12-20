/**
 * aura-orchestrator Edge Function
 *
 * Integrates with Tuya Cloud API for real smart home device control.
 * Falls back to mock data if Tuya credentials are not configured or API fails.
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Tuya Cloud API configuration
const TUYA_API_BASE = 'https://openapi.tuyaus.com'; // US region, change for other regions

interface TuyaToken {
  access_token: string;
  expire_time: number;
  refresh_token: string;
  uid: string;
}

interface TuyaDevice {
  id: string;
  name: string;
  category: string;
  online: boolean;
  status: Array<{ code: string; value: unknown }>;
}

type AuraOrchestratorRequest =
  | { mode: 'plan'; goalText: string; userId?: string | null; enableVoiceFeedback?: boolean }
  | { mode: 'execute'; planId: string; steps?: any[]; userId?: string | null; enableVoiceFeedback?: boolean };

type AuraPlanStep = {
  id: string;
  order: number;
  specialist: 'AmbianceSpecialist' | 'SecuritySpecialist' | 'EnergySpecialist' | string;
  description: string;
  devices: string[];
  deviceIds?: string[];
  action?: string;
  params?: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed';
};

type AuraOrchestratorResponse =
  | { mode: 'plan'; ok: true; planId: string; goalText: string; steps: AuraPlanStep[]; source: 'tuya' | 'mock' }
  | { mode: 'execute'; ok: true; planId: string; overallStatus: string; steps: AuraPlanStep[]; source: 'tuya' | 'mock' }
  | { ok: false; error: string };

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });

// ========== TUYA CLOUD API INTEGRATION ==========

async function generateTuyaSign(
  clientId: string,
  clientSecret: string,
  timestamp: string,
  accessToken: string = '',
  body: string = ''
): Promise<string> {
  const stringToSign = clientId + accessToken + timestamp + body;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(clientSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(stringToSign));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

async function getTuyaToken(clientId: string, clientSecret: string): Promise<TuyaToken | null> {
  const timestamp = Date.now().toString();
  const sign = await generateTuyaSign(clientId, clientSecret, timestamp);

  try {
    const response = await fetch(`${TUYA_API_BASE}/v1.0/token?grant_type=1`, {
      method: 'GET',
      headers: {
        'client_id': clientId,
        'sign': sign,
        't': timestamp,
        'sign_method': 'HMAC-SHA256',
      },
    });

    const data = await response.json();
    console.log('Tuya token response:', JSON.stringify(data));

    if (data.success && data.result) {
      return data.result as TuyaToken;
    }
    console.error('Tuya token error:', data.msg);
    return null;
  } catch (error) {
    console.error('Tuya token fetch error:', error);
    return null;
  }
}

async function getTuyaDevices(
  clientId: string,
  clientSecret: string,
  accessToken: string
): Promise<TuyaDevice[]> {
  const timestamp = Date.now().toString();
  const sign = await generateTuyaSign(clientId, clientSecret, timestamp, accessToken);

  try {
    const response = await fetch(`${TUYA_API_BASE}/v1.0/users/me/devices`, {
      method: 'GET',
      headers: {
        'client_id': clientId,
        'access_token': accessToken,
        'sign': sign,
        't': timestamp,
        'sign_method': 'HMAC-SHA256',
      },
    });

    const data = await response.json();
    console.log('Tuya devices response:', JSON.stringify(data));

    if (data.success && data.result) {
      return data.result as TuyaDevice[];
    }
    console.error('Tuya devices error:', data.msg);
    return [];
  } catch (error) {
    console.error('Tuya devices fetch error:', error);
    return [];
  }
}

async function sendTuyaCommand(
  clientId: string,
  clientSecret: string,
  accessToken: string,
  deviceId: string,
  commands: Array<{ code: string; value: unknown }>
): Promise<boolean> {
  const timestamp = Date.now().toString();
  const body = JSON.stringify({ commands });
  const sign = await generateTuyaSign(clientId, clientSecret, timestamp, accessToken, body);

  try {
    const response = await fetch(`${TUYA_API_BASE}/v1.0/devices/${deviceId}/commands`, {
      method: 'POST',
      headers: {
        'client_id': clientId,
        'access_token': accessToken,
        'sign': sign,
        't': timestamp,
        'sign_method': 'HMAC-SHA256',
        'Content-Type': 'application/json',
      },
      body,
    });

    const data = await response.json();
    console.log(`Tuya command response for ${deviceId}:`, JSON.stringify(data));
    return data.success === true;
  } catch (error) {
    console.error(`Tuya command error for ${deviceId}:`, error);
    return false;
  }
}

// ========== MOCK DATA FALLBACK ==========

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
      action: 'turnOn',
      status: 'pending',
    },
    {
      id: `${baseId}-2`,
      order: 2,
      specialist: 'EnergySpecialist',
      description: 'Ensure energy-saving modes are applied where appropriate',
      devices: ['thermostat', 'smart-plug-tv'],
      action: 'setTemperature',
      params: { temperature: 72 },
      status: 'pending',
    },
    {
      id: `${baseId}-3`,
      order: 3,
      specialist: 'SecuritySpecialist',
      description: 'Lock exterior doors and arm perimeter sensors if leaving home',
      devices: ['front-door-lock', 'back-door-lock'],
      action: 'lock',
      status: 'pending',
    },
  ];

  if (lower.includes('movie') || lower.includes('dim')) {
    possibleSteps[0].description = `Dim lights, close blinds, set media volume for: ${goalText}`;
    possibleSteps[0].devices = ['living-room-light', 'living-room-blinds', 'media-soundbar'];
    possibleSteps[0].action = 'dim';
    possibleSteps[0].params = { brightness: 20 };
  } else if (lower.includes('goodnight') || lower.includes('sleep')) {
    possibleSteps.unshift({
      id: `${baseId}-0`,
      order: 0,
      specialist: 'AmbianceSpecialist',
      description: 'Turn off upstairs lights and set bedroom to night mode',
      devices: ['upstairs-lights', 'bedroom-light'],
      action: 'turnOff',
      status: 'pending',
    });
  }

  const steps = possibleSteps
    .sort((a, b) => a.order - b.order)
    .map((s, idx) => ({ ...s, order: idx + 1 }));

  return { planId: `plan-${baseId}`, steps };
}

// ========== SMART PLAN BUILDER WITH TUYA DEVICES ==========

function buildPlanFromTuyaDevices(goalText: string, devices: TuyaDevice[]): { planId: string; steps: AuraPlanStep[] } {
  const baseId = uuidFromText(goalText + '|tuya');
  const lower = goalText.toLowerCase();
  const steps: AuraPlanStep[] = [];
  let order = 1;

  // Categorize devices
  const lights = devices.filter(d => ['dj', 'dd', 'fwd', 'xdd', 'dc', 'tgq'].includes(d.category));
  const switches = devices.filter(d => ['kg', 'pc', 'cz'].includes(d.category));
  const thermostats = devices.filter(d => ['wk', 'kt'].includes(d.category));
  const locks = devices.filter(d => ['ms', 'jtmspro'].includes(d.category));
  const blinds = devices.filter(d => ['cl', 'clkg'].includes(d.category));

  if (lower.includes('movie') || lower.includes('dim')) {
    if (lights.length > 0) {
      steps.push({
        id: `${baseId}-${order}`,
        order: order++,
        specialist: 'AmbianceSpecialist',
        description: 'Dim lights for movie atmosphere',
        devices: lights.map(d => d.name),
        deviceIds: lights.map(d => d.id),
        action: 'dim',
        params: { brightness: 20 },
        status: 'pending',
      });
    }
    if (blinds.length > 0) {
      steps.push({
        id: `${baseId}-${order}`,
        order: order++,
        specialist: 'AmbianceSpecialist',
        description: 'Close blinds',
        devices: blinds.map(d => d.name),
        deviceIds: blinds.map(d => d.id),
        action: 'close',
        status: 'pending',
      });
    }
  } else if (lower.includes('goodnight') || lower.includes('sleep')) {
    if (lights.length > 0) {
      steps.push({
        id: `${baseId}-${order}`,
        order: order++,
        specialist: 'AmbianceSpecialist',
        description: 'Turn off all lights',
        devices: lights.map(d => d.name),
        deviceIds: lights.map(d => d.id),
        action: 'turnOff',
        status: 'pending',
      });
    }
    if (locks.length > 0) {
      steps.push({
        id: `${baseId}-${order}`,
        order: order++,
        specialist: 'SecuritySpecialist',
        description: 'Lock all doors',
        devices: locks.map(d => d.name),
        deviceIds: locks.map(d => d.id),
        action: 'lock',
        status: 'pending',
      });
    }
  } else if (lower.includes('morning') || lower.includes('wake')) {
    if (lights.length > 0) {
      steps.push({
        id: `${baseId}-${order}`,
        order: order++,
        specialist: 'AmbianceSpecialist',
        description: 'Turn on lights gradually',
        devices: lights.map(d => d.name),
        deviceIds: lights.map(d => d.id),
        action: 'turnOn',
        params: { brightness: 80 },
        status: 'pending',
      });
    }
    if (blinds.length > 0) {
      steps.push({
        id: `${baseId}-${order}`,
        order: order++,
        specialist: 'AmbianceSpecialist',
        description: 'Open blinds',
        devices: blinds.map(d => d.name),
        deviceIds: blinds.map(d => d.id),
        action: 'open',
        status: 'pending',
      });
    }
  } else {
    // Generic plan for other goals
    if (lights.length > 0) {
      steps.push({
        id: `${baseId}-${order}`,
        order: order++,
        specialist: 'AmbianceSpecialist',
        description: `Adjust lighting for: ${goalText}`,
        devices: lights.slice(0, 3).map(d => d.name),
        deviceIds: lights.slice(0, 3).map(d => d.id),
        action: 'turnOn',
        status: 'pending',
      });
    }
  }

  // Fallback if no devices matched
  if (steps.length === 0) {
    return buildDemoPlan(goalText);
  }

  return { planId: `plan-${baseId}`, steps };
}

// ========== ACTION TO TUYA COMMAND MAPPING ==========

function mapActionToTuyaCommands(action: string, params?: Record<string, unknown>): Array<{ code: string; value: unknown }> {
  switch (action) {
    case 'turnOn':
      return [{ code: 'switch_led', value: true }];
    case 'turnOff':
      return [{ code: 'switch_led', value: false }];
    case 'dim':
      return [
        { code: 'switch_led', value: true },
        { code: 'bright_value_v2', value: params?.brightness ?? 20 },
      ];
    case 'lock':
      return [{ code: 'manual_lock', value: true }];
    case 'unlock':
      return [{ code: 'manual_lock', value: false }];
    case 'open':
      return [{ code: 'control', value: 'open' }];
    case 'close':
      return [{ code: 'control', value: 'close' }];
    case 'setTemperature':
      return [{ code: 'temp_set', value: params?.temperature ?? 72 }];
    default:
      return [{ code: 'switch', value: true }];
  }
}

// ========== MAIN HANDLER ==========

serve(async (req: Request) => {
  console.log('aura-orchestrator: Received request', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed, use POST' }, 405);
  }

  let body: any;
  try {
    body = await req.json();
    console.log('aura-orchestrator: Request body', JSON.stringify(body));
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  if (!body || typeof body !== 'object' || !('mode' in body)) {
    return jsonResponse({ ok: false, error: 'Missing or invalid "mode" field' }, 400);
  }

  const mode = body.mode as string;
  const clientId = Deno.env.get('TUYA_CLIENT_ID');
  const clientSecret = Deno.env.get('TUYA_CLIENT_SECRET');
  const useTuya = clientId && clientSecret;

  console.log(`aura-orchestrator: Tuya integration ${useTuya ? 'ENABLED' : 'DISABLED (using mock)'}`);

  if (mode === 'plan') {
    const { goalText } = body;
    if (!goalText || typeof goalText !== 'string' || goalText.trim() === '') {
      return jsonResponse({ ok: false, error: 'Missing or empty goalText' }, 400);
    }

    console.log('aura-orchestrator: Creating plan for goal:', goalText);

    // Try Tuya Cloud first
    if (useTuya) {
      try {
        const token = await getTuyaToken(clientId, clientSecret);
        if (token) {
          const devices = await getTuyaDevices(clientId, clientSecret, token.access_token);
          if (devices.length > 0) {
            const { planId, steps } = buildPlanFromTuyaDevices(goalText, devices);
            console.log('aura-orchestrator: Plan created from Tuya devices', planId);
            return jsonResponse({
              mode: 'plan',
              ok: true,
              planId,
              goalText,
              steps,
              source: 'tuya',
            });
          }
        }
      } catch (error) {
        console.error('aura-orchestrator: Tuya plan error, falling back to mock:', error);
      }
    }

    // Fallback to mock
    const { planId, steps } = buildDemoPlan(goalText);
    console.log('aura-orchestrator: Plan created (mock)', planId);
    return jsonResponse({
      mode: 'plan',
      ok: true,
      planId,
      goalText,
      steps,
      source: 'mock',
    });

  } else if (mode === 'execute') {
    const { planId, steps } = body;
    if (!planId || typeof planId !== 'string') {
      return jsonResponse({ ok: false, error: 'Missing or invalid planId' }, 400);
    }

    console.log('aura-orchestrator: Executing plan:', planId);

    const executedSteps: AuraPlanStep[] = [];
    let allSuccess = true;

    // Try Tuya Cloud execution
    if (useTuya && steps && Array.isArray(steps)) {
      try {
        const token = await getTuyaToken(clientId, clientSecret);
        if (token) {
          for (const step of steps) {
            const stepResult = { ...step, status: 'completed' as const };
            
            if (step.deviceIds && Array.isArray(step.deviceIds)) {
              const commands = mapActionToTuyaCommands(step.action, step.params);
              
              for (const deviceId of step.deviceIds) {
                const success = await sendTuyaCommand(
                  clientId,
                  clientSecret,
                  token.access_token,
                  deviceId,
                  commands
                );
                if (!success) {
                  stepResult.status = 'failed';
                  allSuccess = false;
                }
              }
            }
            
            executedSteps.push(stepResult);
          }

          console.log('aura-orchestrator: Plan executed via Tuya');
          return jsonResponse({
            mode: 'execute',
            ok: true,
            planId,
            overallStatus: allSuccess ? 'success' : 'partial',
            steps: executedSteps,
            source: 'tuya',
          });
        }
      } catch (error) {
        console.error('aura-orchestrator: Tuya execute error, falling back to mock:', error);
      }
    }

    // Fallback to mock execution
    const demoGoal = planId.replace(/^plan-/, '');
    const mockPlan = buildDemoPlan(demoGoal);
    const completed = mockPlan.steps.map(s => ({ ...s, status: 'completed' as const }));

    console.log('aura-orchestrator: Plan executed (mock)');
    return jsonResponse({
      mode: 'execute',
      ok: true,
      planId,
      overallStatus: 'success',
      steps: completed,
      source: 'mock',
    });

  } else {
    return jsonResponse({ ok: false, error: 'Unsupported mode. Use "plan" or "execute"' }, 400);
  }
});
