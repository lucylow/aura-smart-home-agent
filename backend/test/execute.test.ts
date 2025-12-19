import request from 'supertest';
import { app } from '../src/index';

describe('POST /api/execute', () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser' });
    token = res.body.token;
  });

  it('should execute a goodnight plan successfully', async () => {
    // First get a plan
    const planRes = await request(app)
      .post('/api/plan')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'U123', goal: 'goodnight' });

    const plan = planRes.body.plan;

    // Execute the plan
    const res = await request(app)
      .post('/api/execute')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'U123', plan });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.summary).toBeDefined();
    expect(res.body.summary.totalSteps).toBe(plan.steps.length);
    expect(res.body.results).toBeDefined();
    expect(res.body.results.length).toBe(plan.steps.length);
  }, 10000);

  it('should execute a movie time plan', async () => {
    const planRes = await request(app)
      .post('/api/plan')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'U123', goal: 'movie time' });

    const plan = planRes.body.plan;

    const res = await request(app)
      .post('/api/execute')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'U123', plan });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.summary.totalSteps).toBe(plan.steps.length);
  }, 10000);

  it('should reject execution without auth', async () => {
    const res = await request(app)
      .post('/api/execute')
      .send({
        userId: 'U123',
        plan: { name: 'Test', steps: [] },
      });

    expect(res.status).toBe(401);
  });

  it('should reject execution without valid plan', async () => {
    const res = await request(app)
      .post('/api/execute')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'U123' });

    expect(res.status).toBe(400);
  });

  it('should return results for each step', async () => {
    const plan = {
      name: 'Test Plan',
      steps: [
        { deviceHint: 'Bedroom Light', action: 'turnOff', description: 'Turn off bedroom light' },
        { deviceHint: 'Thermostat', action: 'set', params: { temperature: 20 }, description: 'Set temp' },
      ],
      requiresConfirmation: false,
    };

    const res = await request(app)
      .post('/api/execute')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'U123', plan });

    expect(res.status).toBe(200);
    expect(res.body.results.length).toBe(2);
    res.body.results.forEach((result: any) => {
      expect(result.step).toBeDefined();
      expect(result.deviceId).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });
  }, 10000);
});
