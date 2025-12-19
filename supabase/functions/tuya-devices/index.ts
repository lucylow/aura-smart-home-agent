import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TUYA_API_HOST = 'https://openapi.tuyaus.com'; // US region, change if needed

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const timestamp = Date.now().toString();
  const signStr = clientId + timestamp;
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(clientSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signStr));
  const sign = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

  const response = await fetch(`${TUYA_API_HOST}/v1.0/token?grant_type=1`, {
    method: 'GET',
    headers: {
      'client_id': clientId,
      'sign': sign,
      't': timestamp,
      'sign_method': 'HMAC-SHA256',
    },
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(`Tuya auth failed: ${data.msg}`);
  }
  return data.result.access_token;
}

async function tuyaRequest(
  method: string,
  path: string,
  clientId: string,
  clientSecret: string,
  accessToken: string,
  body?: object
): Promise<any> {
  const timestamp = Date.now().toString();
  const signStr = clientId + accessToken + timestamp;
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(clientSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signStr));
  const sign = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

  const headers: Record<string, string> = {
    'client_id': clientId,
    'access_token': accessToken,
    'sign': sign,
    't': timestamp,
    'sign_method': 'HMAC-SHA256',
  };

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${TUYA_API_HOST}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get('TUYA_CLOUD_ID');
    const clientSecret = Deno.env.get('TUYA_CLOUD_AUTH_KEY');

    if (!clientId || !clientSecret) {
      throw new Error('Tuya credentials not configured');
    }

    const { action, deviceId, commands } = await req.json();
    console.log(`Tuya action: ${action}`, { deviceId, commands });

    const accessToken = await getAccessToken(clientId, clientSecret);

    let result;
    switch (action) {
      case 'list':
        result = await tuyaRequest('GET', '/v1.0/users/me/devices', clientId, clientSecret, accessToken);
        break;
      case 'status':
        if (!deviceId) throw new Error('deviceId required');
        result = await tuyaRequest('GET', `/v1.0/devices/${deviceId}/status`, clientId, clientSecret, accessToken);
        break;
      case 'command':
        if (!deviceId || !commands) throw new Error('deviceId and commands required');
        result = await tuyaRequest('POST', `/v1.0/devices/${deviceId}/commands`, clientId, clientSecret, accessToken, { commands });
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log('Tuya result:', result);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Tuya error:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
