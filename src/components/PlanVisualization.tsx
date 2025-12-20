// aura-project/src/components/PlanVisualization.tsx
import React from 'react';
import { Check, Loader2, AlertCircle, Clock, Zap } from 'lucide-react';

interface PlanStep {
  id?: string;
  order: number;
  specialist: string;
  description: string;
  devices?: string[];
  action?: string;
  params?: Record<string, unknown>;
  status?: 'pending' | 'running' | 'completed' | 'failed';
  executionTime?: number;
}

interface PlanVisualizationProps {
  steps: PlanStep[];
  planId: string;
  estimatedDuration?: number;
  source?: 'tuya' | 'mock';
}

const specialistColors: Record<string, { bg: string; border: string; icon: string }> = {
  AmbianceSpecialist: { bg: 'bg-amber-50', border: 'border-amber-400', icon: '💡' },
  EnergySpecialist: { bg: 'bg-emerald-50', border: 'border-emerald-400', icon: '⚡' },
  SecuritySpecialist: { bg: 'bg-blue-50', border: 'border-blue-400', icon: '🔒' },
};

const StatusIcon: React.FC<{ status?: string }> = ({ status }) => {
  switch (status) {
    case 'completed':
      return <Check className="w-5 h-5 text-green-600" />;
    case 'running':
      return <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />;
    case 'failed':
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    default:
      return <Clock className="w-5 h-5 text-gray-400" />;
  }
};

export const PlanVisualization: React.FC<PlanVisualizationProps> = ({ 
  steps, 
  planId, 
  estimatedDuration,
  source 
}) => {
  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const totalTime = steps.reduce((acc, s) => acc + (s.executionTime || 0), 0);
  
  return (
    <div className="plan-visualization p-5 border border-border rounded-xl shadow-lg bg-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Orchestration Plan
          </h2>
          <p className="text-xs text-muted-foreground font-mono">{planId}</p>
        </div>
        <div className="text-right">
          {source && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              source === 'tuya' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {source === 'tuya' ? '🔗 Tuya Cloud' : '🧪 Demo Mode'}
            </span>
          )}
          {estimatedDuration && completedSteps === 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Est. {(estimatedDuration / 1000).toFixed(1)}s
            </p>
          )}
          {totalTime > 0 && (
            <p className="text-xs text-green-600 mt-1">
              ✓ {(totalTime / 1000).toFixed(1)}s total
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {steps.length > 0 && (
        <div className="w-full h-2 bg-muted rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(completedSteps / steps.length) * 100}%` }}
          />
        </div>
      )}

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const colors = specialistColors[step.specialist] || { bg: 'bg-gray-50', border: 'border-gray-300', icon: '🔧' };
          
          return (
            <div
              key={step.id || step.order}
              className={`p-4 rounded-lg flex items-start gap-3 transition-all duration-300 border-l-4
                ${step.status === 'completed' ? 'bg-green-50 border-green-500' : ''}
                ${step.status === 'running' ? `${colors.bg} ${colors.border} shadow-md` : ''}
                ${step.status === 'failed' ? 'bg-red-50 border-red-500' : ''}
                ${step.status === 'pending' || !step.status ? 'bg-muted/30 border-muted-foreground/30' : ''}
              `}
            >
              {/* Step number */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${step.status === 'completed' ? 'bg-green-500 text-white' : ''}
                ${step.status === 'running' ? 'bg-amber-500 text-white' : ''}
                ${step.status === 'failed' ? 'bg-red-500 text-white' : ''}
                ${step.status === 'pending' || !step.status ? 'bg-muted text-muted-foreground' : ''}
              `}>
                {step.status === 'completed' ? <Check className="w-4 h-4" /> : step.order}
              </div>

              {/* Content */}
              <div className="flex-grow min-w-0">
                <p className={`font-medium ${step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {step.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-background border">
                    {colors.icon} {step.specialist.replace('Specialist', '')}
                  </span>
                  {step.devices && step.devices.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      → {step.devices.slice(0, 2).join(', ')}{step.devices.length > 2 ? ` +${step.devices.length - 2}` : ''}
                    </span>
                  )}
                  {step.executionTime && (
                    <span className="text-xs text-green-600">
                      {step.executionTime}ms
                    </span>
                  )}
                </div>
              </div>

              {/* Status icon */}
              <div className="flex-shrink-0">
                <StatusIcon status={step.status} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {completedSteps === steps.length && steps.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-700 font-medium">
            All {steps.length} steps completed successfully!
          </span>
        </div>
      )}
    </div>
  );
};
