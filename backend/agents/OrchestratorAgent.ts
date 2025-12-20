// backend/agents/OrchestratorAgent.ts
import {
  AuraPlan,
  ContextData,
  DetailedPlanStep,
  Device,
  IContextService,
  ILLMService,
  ISpecialistAgent,
  PlanStep,
} from './types';
import { DeviceRegistry } from '../services/DeviceRegistry';

export class OrchestratorAgent {
  private llmService: ILLMService;
  private contextService: IContextService;
  private deviceRegistry: DeviceRegistry;
  private specialists: Record<string, ISpecialistAgent>;

  constructor(
    llmService: ILLMService,
    contextService: IContextService,
    deviceRegistry: DeviceRegistry,
    specialists: Record<string, ISpecialistAgent>
  ) {
    this.llmService = llmService;
    this.contextService = contextService;
    this.deviceRegistry = deviceRegistry;
    this.specialists = specialists;
  }

  async createPlan(
    goalText: string,
    userId: string,
    context?: ContextData
  ): Promise<AuraPlan> {
    // 1. Classify goal
    const goalClassification = await this.llmService.classifyGoal(goalText);

    // 2. Fetch current context
    const enrichedContext = await this.contextService.getContext(userId);

    // 3. Build system prompt with available devices, specialist capabilities
    const systemPrompt = this.buildOrchestratorPrompt(
      goalClassification,
      this.deviceRegistry.getDevices(userId),
      enrichedContext
    );

    // 4. Call LLM to generate plan skeleton
    const planSkeleton = await this.llmService.generatePlan(
      systemPrompt,
      goalText,
      enrichedContext
    );

    // 5. Validate plan against available devices & constraints (simplified for mock)
    const validatedPlan = planSkeleton;

    // 6. Decompose plan into specialist-specific steps
    const detailedPlan = await this.decomposePlanIntoSpecialists(validatedPlan.steps);

    // 7. Store plan in Supabase (mocked)
    const planId = 'mock-plan-id'; // Mock ID
    console.log(`[SUPABASE MOCK] Storing plan ${planId} for goal: ${goalText}`);

    return { planId, goal: goalText, steps: detailedPlan };
  }

  private buildOrchestratorPrompt(
    classification: any,
    devices: Device[],
    context: ContextData
  ): string {
    // This prompt is primarily for the LLM, but we'll return a simplified version for the mock
    return `
You are A.U.R.A., an intelligent home orchestrator.
Your task: Create a reliable, multi-step plan to achieve the user's goal.

CURRENT CONTEXT: ${JSON.stringify(context)}

AVAILABLE DEVICES: ${JSON.stringify(devices.map(d => ({ name: d.name, type: d.type, room: d.room })))}

GOAL: ${classification.primary}

Generate a JSON plan with steps... (See full blueprint for detailed prompt)
    `;
  }

  private async decomposePlanIntoSpecialists(
    steps: PlanStep[]
  ): Promise<DetailedPlanStep[]> {
    // For each step, call the responsible specialist to add constraints, retries, fallbacks
    return Promise.all(
      steps.map(async (step) => {
        const specialist = this.specialists[step.specialist];
        if (!specialist) {
          throw new Error(`Unknown specialist: ${step.specialist}`);
        }
        return await specialist.enrichStep(step);
      })
    );
  }
}
