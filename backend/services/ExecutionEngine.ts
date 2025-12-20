// backend/services/ExecutionEngine.ts
import { ExecutionLog, IExecutionEngine, DetailedPlanStep, ISpecialistAgent } from '../agents/types';
import { TuyaService } from './TuyaService';
import { VoiceCloningService } from './VoiceCloningService';
import { AmbianceSpecialist } from '../agents/AmbianceSpecialist';
import { delay } from '../utils/utils'; // Assume a utility function for delay

// Mock Supabase client for demonstration purposes
const mockSupabaseClient = {
  from: (table: string) => ({
    select: (query: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          if (table === 'plans' && column === 'id' && value === 'mock-plan-id') {
            // Mock plan data for execution
            return {
              data: {
                plan_data: {
                  steps: [
                    {
                      order: 1,
                      specialist: 'AmbianceSpecialist',
                      action: 'set_scene',
                      description: 'Dim Living Room Light to 30%, warm white (2700K)',
                      devices: ['Living Room Light'],
                      dpValues: { brightness: 30, colorTemp: 2700 },
                      estimatedDuration: 1500,
                      retryPolicy: { maxAttempts: 3, backoffMs: 500 },
                      validation: { preCheck: 'device_responsive', postCheck: 'brightness_matches_target' }
                    } as DetailedPlanStep,
                  ]
                }
              },
              error: null
            };
          }
          return { data: null, error: new Error('Plan not found') };
        }
      })
    }),
    insert: async (data: any[]) => {
      console.log(`[SUPABASE MOCK] Inserting into ${table}:`, data);
      return { error: null };
    }
  })
};

export class ExecutionEngine implements IExecutionEngine {
  private tuyaService: TuyaService;
  private voiceCloningService: VoiceCloningService;
  private specialists: Record<string, ISpecialistAgent>;
  private supabaseClient: typeof mockSupabaseClient;

  constructor(tuyaService: TuyaService, voiceCloningService: VoiceCloningService, specialists: Record<string, ISpecialistAgent>) {
    this.tuyaService = tuyaService;
    this.voiceCloningService = voiceCloningService;
    this.specialists = specialists;
    this.supabaseClient = mockSupabaseClient; // Use mock client
  }

  private getPlan(planId: string): Promise<{ steps: DetailedPlanStep[] }> {
    // In a real app, fetch from Supabase
    return new Promise((resolve, reject) => {
      if (planId === 'mock-plan-id') {
        resolve({
          steps: [
            {
              order: 1,
              specialist: 'AmbianceSpecialist',
              action: 'set_scene',
              description: 'Dim Living Room Light to 30%, warm white (2700K)',
              devices: ['Living Room Light'],
              dpValues: { brightness: 30, colorTemp: 2700 },
              estimatedDuration: 1500,
              retryPolicy: { maxAttempts: 3, backoffMs: 500 },
              validation: { preCheck: 'device_responsive', postCheck: 'brightness_matches_target' }
            } as DetailedPlanStep,
          ]
        });
      } else {
        reject(new Error('Plan not found'));
      }
    });
  }

  async executePlan(
    planId: string,
    userId: string,
    voiceCloneFeedback: boolean = false
  ): Promise<ExecutionLog> {
    const plan = await this.getPlan(planId);
    const executionLog: ExecutionLog = {
      planId,
      userId,
      startedAt: new Date(),
      steps: [],
      overallStatus: 'pending'
    };

    for (const step of plan.steps) {
      const specialist = this.specialists[step.specialist];

      // Mock event bus emit
      console.log(`[EVENT] Step ${step.order} starting: ${step.description}`);

      try {
        if (voiceCloneFeedback) {
          await this.voiceCloningService.synthesizeExecutionFeedback(userId, step, 'executing');
        }

        // Execute the step using the specialist's executeStep method
        const startTime = Date.now();
        const result = await specialist.executeStep(step);
        const duration = Date.now() - startTime;

        executionLog.steps.push({
          order: step.order,
          status: 'completed',
          result,
          duration: duration,
          completedAt: new Date()
        });

        if (voiceCloneFeedback) {
          await this.voiceCloningService.synthesizeExecutionFeedback(userId, step, 'completed');
        }

        console.log(`[EVENT] Step ${step.order} completed.`);
      } catch (err: any) {
        executionLog.steps.push({
          order: step.order,
          status: 'failed',
          error: err.message,
          completedAt: new Date()
        });

        if (voiceCloneFeedback) {
          await this.voiceCloningService.synthesizeExecutionFeedback(userId, step, 'failed');
        }

        console.log(`[EVENT] Step ${step.order} failed: ${err.message}`);
      }

      // Small delay between steps for safety
      await delay(500);
    }

    executionLog.completedAt = new Date();
    executionLog.overallStatus = executionLog.steps.every(s => s.status === 'completed')
      ? 'success'
      : 'partial';

    // Store execution log in Supabase (mocked)
    await this.supabaseClient
      .from('execution_logs')
      .insert([{
        plan_id: planId,
        user_id: userId,
        steps_log: executionLog.steps,
        overall_status: executionLog.overallStatus,
        duration_ms: executionLog.completedAt.getTime() - executionLog.startedAt.getTime()
      }]);

    return executionLog;
  }
}

// Simple delay utility
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
