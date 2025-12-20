// aura-project/src/components/VoiceInput.tsx
import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useAuraOrchestrator } from '../hooks/useAuraOrchestrator';
import { PlanVisualization } from './PlanVisualization';

export const VoiceInput: React.FC = () => {
  const { transcript, isListening, startListening, stopListening } = useSpeechRecognition();
  const { createPlan, executePlan, isLoading, error } = useAuraOrchestrator();
  const [manualInput, setManualInput] = useState('');
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'planning' | 'ready' | 'executing' | 'completed' | 'failed'>('idle');

  useEffect(() => {
    if (transcript && isListening === false) {
      setManualInput(transcript);
      handleSubmit(transcript);
    }
  }, [transcript, isListening]);

  const handleSubmit = async (goalText: string) => {
    if (!goalText.trim()) return;

    setExecutionStatus('planning');
    setCurrentPlan(null);

    const result = await createPlan(goalText, {
      enableVoiceFeedback: true
    });

    if (result.ok) {
      setCurrentPlan(result);
      setExecutionStatus('ready');
      setManualInput('');
    } else {
      setExecutionStatus('failed');
    }
  };

  const handleExecute = async () => {
    if (!currentPlan) return;

    setExecutionStatus('executing');
    const result = await executePlan(currentPlan.planId, { enableVoiceFeedback: true });

    if (result.ok) {
      setExecutionStatus(result.overallStatus === 'success' ? 'completed' : 'failed');
      // Update plan steps with execution status (mocked for now)
      setCurrentPlan((prev: any) => ({
        ...prev,
        steps: prev.steps.map((step: any, index: number) => ({
          ...step,
          status: result.steps[index]?.status || 'completed'
        }))
      }));
    } else {
      setExecutionStatus('failed');
    }
  };

  const statusText = {
    idle: 'Enter your goal or tap the mic.',
    planning: 'A.U.R.A. is planning your scenario...',
    ready: 'Plan ready. Review and execute.',
    executing: 'Executing plan...',
    completed: 'Plan successfully completed!',
    failed: 'An error occurred.',
  };

  return (
    <div className="voice-input-container p-6 bg-white rounded-xl shadow-2xl max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">A.U.R.A. Orchestrator</h1>
      
      {/* Status Display */}
      <p className={`mb-4 font-medium ${executionStatus === 'failed' ? 'text-red-500' : 'text-gray-600'}`}>
        {statusText[executionStatus]}
      </p>

      {/* Microphone button */}
      <button
        className={`w-full py-3 mb-4 rounded-lg text-white font-semibold transition-colors duration-200
          ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={isListening ? stopListening : startListening}
        disabled={isLoading}
      >
        {isListening ? '🎤 Listening... Tap to Stop' : '🎤 Tap to Speak Your Goal'}
      </button>

      {/* Manual input fallback */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Or type your goal here..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && manualInput.trim()) {
              handleSubmit(manualInput);
            }
          }}
          disabled={isLoading || isListening}
        />
        <button
          className="px-4 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
          onClick={() => handleSubmit(manualInput)}
          disabled={isLoading || isListening || !manualInput.trim()}
        >
          Plan
        </button>
      </div>

      {/* Quick scenario buttons */}
      <div className="flex justify-center space-x-3 mb-6">
        <button className="text-sm px-3 py-1 border rounded-full text-teal-600 border-teal-600 hover:bg-teal-50" onClick={() => handleSubmit('Movie time')}>🎬 Movie Time</button>
        <button className="text-sm px-3 py-1 border rounded-full text-teal-600 border-teal-600 hover:bg-teal-50" onClick={() => handleSubmit('Goodnight')}>🌙 Goodnight</button>
        <button className="text-sm px-3 py-1 border rounded-full text-teal-600 border-teal-600 hover:bg-teal-50" onClick={() => handleSubmit('Leaving home')}>🏃 Leaving Home</button>
      </div>

      {/* Plan Visualization and Execution Button */}
      {currentPlan && (
        <div className="mt-6">
          <PlanVisualization steps={currentPlan.steps} planId={currentPlan.planId} />
          <button
            className={`w-full mt-4 py-3 rounded-lg text-white font-semibold transition-colors duration-200
              ${executionStatus === 'ready' ? 'bg-coral-500 hover:bg-coral-600' : 'bg-gray-400 cursor-not-allowed'}
            `}
            onClick={handleExecute}
            disabled={executionStatus !== 'ready'}
          >
            {executionStatus === 'executing' ? 'Executing...' : '🚀 Execute Plan'}
          </button>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
    </div>
  );
};
