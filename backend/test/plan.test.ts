import request from 'supertest';
import { app } from '../src/index';

describe('POST /api/plan', () => {
  let token: string;

  beforeAll(async () => {
    // Get auth token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser' });
    token = res.body.token;
  });

  it('should return a plan for goodnight goal', async () => {
    const res = await request(app)
      .post('/api/plan')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'U123', goal: 'goodnight' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.plan).toBeDefined();
    expect(res.body.plan.name).toBe('Goodnight Routine');
    expect(res.body.plan.steps.length).toBeGreaterThan(0);
    expect(res.body.plan.requiresConfirmation).toBe(true);
  });

  it('should return a plan for movie time goal', async () => {
    const res = await request(app)
      .post('/api/plan')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'U123', goal: 'movie time' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.plan.name).toBe('Movie Time');
  });

  it('should return direct command for unknown goal', async () => {
    const res = await request(app)
      .post('/api/plan')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'U123', goal: 'unknown action' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.plan.type).toBe('DIRECT_COMMAND');
  });

  it('should reject request without auth', async () => {
    const res = await request(app)
      .post('/api/plan')
      .send({ userId: 'U123', goal: 'goodnight' });

    expect(res.status).toBe(401);
  });

  it('should reject request without goal', async () => {
    const res = await request(app)
      .post('/api/plan')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'U123' });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/health', () => {
  it('should return healthy status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('GET /api/suggestions', () => {
  it('should return suggestions', async () => {
    const res = await request(app).get('/api/suggestions?homeId=H1');

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.suggestions).toBeDefined();
    expect(Array.isArray(res.body.suggestions)).toBe(true);
  });
});
