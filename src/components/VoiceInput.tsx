// aura-project/src/components/VoiceInput.tsx
import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useAuraOrchestrator } from '../hooks/useAuraOrchestrator';
import { PlanVisualization } from './PlanVisualization';
import { Mic, MicOff, Send, Loader2, Sun, PartyPopper } from 'lucide-react';

export const VoiceInput: React.FC = () => {
  const { transcript, isListening, startListening, stopListening } = useSpeechRecognition();
  const { createPlan, executePlan, isLoading, error, useMockMode, executingSteps, context } = useAuraOrchestrator();
  const [manualInput, setManualInput] = useState('');
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'planning' | 'ready' | 'executing' | 'completed' | 'failed'>('idle');

  useEffect(() => {
    if (transcript && isListening === false) {
      setManualInput(transcript);
      handleSubmit(transcript);
    }
  }, [transcript, isListening]);

  // Update plan visualization during execution
  useEffect(() => {
    if (executingSteps.length > 0 && currentPlan) {
      setCurrentPlan((prev: any) => ({
        ...prev,
        steps: executingSteps
      }));
    }
  }, [executingSteps]);

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
    const result = await executePlan(currentPlan.planId, currentPlan.steps, { enableVoiceFeedback: true });

    if (result.ok) {
      setExecutionStatus(result.overallStatus === 'success' ? 'completed' : 'failed');
      setCurrentPlan((prev: any) => ({
        ...prev,
        steps: result.steps,
        totalExecutionTime: result.totalExecutionTime,
      }));
    } else {
      setExecutionStatus('failed');
    }
  };

  const handleReset = () => {
    setCurrentPlan(null);
    setExecutionStatus('idle');
    setManualInput('');
  };

  const statusConfig = {
    idle: { text: 'What would you like to do?', color: 'text-muted-foreground' },
    planning: { text: 'A.U.R.A. is analyzing your request...', color: 'text-primary' },
    ready: { text: 'Plan ready! Review the steps and execute.', color: 'text-green-600' },
    executing: { text: 'Executing actions on your devices...', color: 'text-amber-600' },
    completed: { text: '✓ All actions completed successfully!', color: 'text-green-600' },
    failed: { text: 'Some actions encountered issues.', color: 'text-red-500' },
  };

  const quickScenarios = [
    { label: 'Movie Time', icon: '🎬', goal: 'Movie time' },
    { label: 'Goodnight', icon: '🌙', goal: 'Goodnight' },
    { label: 'Leaving', icon: '🏃', goal: 'Leaving home' },
    { label: 'Good Morning', icon: '☀️', goal: 'Good morning' },
    { label: 'Party Mode', icon: '🎉', goal: 'Party time with guests' },
  ];

  return (
    <div className="voice-input-container p-6 bg-card rounded-xl shadow-2xl max-w-3xl mx-auto border border-border">
      {/* Header with context */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            🏠 A.U.R.A. Orchestrator
          </h1>
          <p className="text-xs text-muted-foreground">
            Autonomous Unified Reasoning Agent
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Sun className="w-3 h-3" />
            <span className="capitalize">{context.timeOfDay}</span>
            <span>•</span>
            <span>{context.weather.temperature}°F</span>
          </div>
          {useMockMode && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Demo Mode
            </span>
          )}
        </div>
      </div>
      
      {/* Status Display */}
      <div className={`mb-4 p-3 rounded-lg bg-muted/50 flex items-center gap-2 ${statusConfig[executionStatus].color}`}>
        {(executionStatus === 'planning' || executionStatus === 'executing') && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        <span className="font-medium">{statusConfig[executionStatus].text}</span>
      </div>

      {/* Microphone button */}
      <button
        className={`w-full py-4 mb-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2
          ${isListening 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30' 
            : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={isListening ? stopListening : startListening}
        disabled={isLoading}
      >
        {isListening ? (
          <>
            <MicOff className="w-5 h-5" />
            <span>Listening... Tap to Stop</span>
            <span className="animate-pulse">🔴</span>
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            <span>Tap to Speak Your Goal</span>
          </>
        )}
      </button>

      {/* Manual input */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Or type your goal here..."
          className="flex-grow p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground"
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
          className="px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2 disabled:opacity-50"
          onClick={() => handleSubmit(manualInput)}
          disabled={isLoading || isListening || !manualInput.trim()}
        >
          <Send className="w-4 h-4" />
          Plan
        </button>
      </div>

      {/* Quick scenario buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {quickScenarios.map((scenario) => (
          <button 
            key={scenario.goal}
            className="text-sm px-3 py-1.5 border border-primary/30 rounded-full text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
            onClick={() => handleSubmit(scenario.goal)}
            disabled={isLoading}
          >
            {scenario.icon} {scenario.label}
          </button>
        ))}
      </div>

      {/* Plan Visualization and Execution Button */}
      {currentPlan && (
        <div className="mt-6 space-y-4">
          <PlanVisualization 
            steps={currentPlan.steps} 
            planId={currentPlan.planId}
            estimatedDuration={currentPlan.estimatedDuration}
            source={currentPlan.source}
          />
          
          <div className="flex gap-2">
            {executionStatus === 'ready' && (
              <button
                className="flex-grow py-3 rounded-lg text-white font-semibold transition-all duration-200 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/30 flex items-center justify-center gap-2"
                onClick={handleExecute}
              >
                🚀 Execute Plan
              </button>
            )}
            
            {executionStatus === 'executing' && (
              <button
                className="flex-grow py-3 rounded-lg text-white font-semibold bg-amber-500 cursor-not-allowed flex items-center justify-center gap-2"
                disabled
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                Executing...
              </button>
            )}
            
            {(executionStatus === 'completed' || executionStatus === 'failed') && (
              <button
                className="flex-grow py-3 rounded-lg font-semibold transition-colors bg-muted hover:bg-muted/80 text-foreground"
                onClick={handleReset}
              >
                🔄 Start New Plan
              </button>
            )}
          </div>
          
          {currentPlan.totalExecutionTime && (
            <p className="text-center text-sm text-muted-foreground">
              Total execution time: {(currentPlan.totalExecutionTime / 1000).toFixed(2)}s
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};
