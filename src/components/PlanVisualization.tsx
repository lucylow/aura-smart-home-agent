// aura-project/src/components/PlanVisualization.tsx
import React from 'react';

interface PlanStep {
  order: number;
  specialist: string;
  description: string;
  status?: 'pending' | 'running' | 'completed' | 'failed';
}

interface PlanVisualizationProps {
  steps: PlanStep[];
  planId: string;
}

export const PlanVisualization: React.FC<PlanVisualizationProps> = ({ steps, planId }) => {
  return (
    <div className="plan-visualization p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">Orchestration Plan: {planId}</h2>
      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.order}
            className={`p-3 rounded-md flex items-center transition-all duration-300
              ${step.status === 'completed' ? 'bg-green-100 border-l-4 border-green-500' : ''}
              ${step.status === 'running' ? 'bg-yellow-100 border-l-4 border-yellow-500 animate-pulse' : ''}
              ${step.status === 'failed' ? 'bg-red-100 border-l-4 border-red-500' : ''}
              ${step.status === 'pending' || !step.status ? 'bg-gray-50 border-l-4 border-gray-300' : ''}
            `}
          >
            <span className="font-bold mr-3 text-lg">{step.order}.</span>
            <div>
              <p className="text-gray-800">{step.description}</p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">{step.specialist}</span> | Status: {step.status || 'Pending'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
