// backend/agents/types.ts

// --- Shared Data Structures ---

export interface Device {
  id: string;
  tuya_device_id: string;
  name: string;
  type: 'light' | 'thermostat' | 'lock' | 'blinds' | 'plug' | 'sensor';
  room: string;
  dpIds: Record<string, number>; // Tuya data point IDs
  is_online: boolean;
  current_state: Record<string, any>;
}

export interface WeatherData {
  summary: string;
  temperature: number;
  humidity: number;
  isRaining: boolean;
  feelsLike: number;
}

export interface ContextData {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: number; // 0-6
  weather: WeatherData;
  calendarBusy: boolean;
  upcomingEvents: any[];
  userLocation: string;
  occupancyCount: number;
  isQuietHours: boolean;
  sensors: {
    indoorTemp?: number;
    indoorHumidity?: number;
    airQuality?: number;
    luminosity?: number;
  };
  preferences: Record<string, any>;
}

export interface GoalClassification {
  primary: string;
  confidence: number;
  nuances?: string[];
}

export interface PlanStep {
  order: number;
  specialist: 'OrchestratorAgent' | 'SecuritySpecialist' | 'AmbianceSpecialist' | 'EnergySpecialist' | 'WellnessSpecialist';
  action: string;
  description: string;
  devices: string[]; // Device names
  dpValues: Record<string, any>;
  estimatedDuration: number; // ms
}

export interface DetailedPlanStep extends PlanStep {
  retryPolicy: {
    maxAttempts: number;
    backoffMs: number;
  };
  fallback?: {
    action: string;
    value: any;
  };
  validation: {
    preCheck: string;
    postCheck: string;
  };
}

export interface AuraPlan {
  planId: string;
  goal: string;
  steps: DetailedPlanStep[];
}

export interface ExecutionLog {
  planId: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  overallStatus: 'success' | 'partial' | 'failed' | 'pending';
  steps: any[]; // Array of step execution results
}

// --- Service Interfaces ---

export interface ITuyaService {
  listDevices(deviceNames: string[]): Promise<Device[]>;
  sendDeviceCommands(deviceId: string, commands: { dpId: number; value: any }[]): Promise<any>;
  getDeviceState(deviceId: string): Promise<Record<string, any>>;
}

export interface ILLMService {
  classifyGoal(goalText: string): Promise<GoalClassification>;
  generatePlan(systemPrompt: string, goalText: string, context: ContextData): Promise<{ steps: PlanStep[] }>;
}

export interface IContextService {
  getContext(userId: string): Promise<ContextData>;
  getAmbientLight(): Promise<number>;
  getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface IVoiceCloningService {
  synthesizeExecutionFeedback(userId: string, planStep: PlanStep, status: 'executing' | 'completed' | 'failed'): Promise<any>;
}

export interface IExecutionEngine {
  executePlan(planId: string, userId: string, voiceCloneFeedback: boolean): Promise<ExecutionLog>;
}

export interface ISpecialistAgent {
  enrichStep(step: PlanStep): Promise<DetailedPlanStep>;
  executeStep(step: DetailedPlanStep): Promise<any>;
}
