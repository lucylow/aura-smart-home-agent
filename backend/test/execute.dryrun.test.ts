import request from 'supertest';
import { app } from '../src/index';

describe('POST /api/execute with dryRun', () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser' });
    token = res.body.token;
  });

  it('should simulate execution with dryRun=true query param', async () => {
    const plan = {
      name: 'Test Plan',
      steps: [
        { deviceHint: 'Bedroom Light', action: 'turnOff', description: 'Turn off bedroom light' },
        { deviceHint: 'Thermostat', action: 'set', params: { temperature: 20 }, description: 'Set temp' },
      ],
      requiresConfirmation: false,
    };

    const res = await request(app)
      .post('/api/execute?dryRun=true')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'U123', plan });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.summary.totalSteps).toBe(2);
    expect(res.body.summary.successful).toBe(2);
    expect(res.body.results.length).toBe(2);
    res.body.results.forEach((result: any) => {
      expect(result.simulated).toBe(true);
      expect(result.success).toBe(true);
      expect(result.result.status).toBe('simulated_ok');
    });
  });

  it('should simulate execution with dryRun in body', async () => {
    const plan = {
      name: 'Test Plan',
      steps: [
        { deviceHint: 'Living Room Light', action: 'turnOn', description: 'Turn on light' },
      ],
      requiresConfirmation: false,
    };

    const res = await request(app)
      .post('/api/execute')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'U123', plan, dryRun: true });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.results[0].simulated).toBe(true);
  });

  it('should use simulated device IDs in dry run', async () => {
    const plan = {
      name: 'Test Plan',
      steps: [
        { deviceHint: 'Light', action: 'turnOff', description: 'Step 0' },
        { deviceHint: 'TV', action: 'turnOn', description: 'Step 1' },
      ],
      requiresConfirmation: false,
    };

    const res = await request(app)
      .post('/api/execute?dryRun=true')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'U123', plan });

    expect(res.body.results[0].deviceId).toBe('simulated-dev-0');
    expect(res.body.results[1].deviceId).toBe('simulated-dev-1');
  });
});
