// aura-project/src/pages/VoiceSetupPage.tsx
import React, { useState } from 'react';
import { useMockVoice } from '../hooks/useMockUser';
import { Mic, CheckCircle, Volume2 } from 'lucide-react';

enum VoiceSetupStep {
  Introduction,
  RecordSamples,
  Training,
  Complete
}

export const VoiceSetupPage: React.FC = () => {
  const { voiceProfile, startCloning, recordSample, startTraining } = useMockVoice();
  const [step, setStep] = useState(VoiceSetupStep.Introduction);
  const [voiceName, setVoiceName] = useState('');

  const handleBeginCloning = () => {
    if (voiceName) {
      startCloning(voiceName);
      setStep(VoiceSetupStep.RecordSamples);
    }
  };

  const handleRecordSample = () => {
    recordSample();
    if (voiceProfile.sampleCount >= 2) { // Simulate 3 samples needed (0, 1, 2)
      setStep(VoiceSetupStep.Training);
      setTimeout(() => {
        startTraining();
        setStep(VoiceSetupStep.Complete);
      }, 3000); // Simulate training time
    }
  };

  const handlePlayTestAudio = () => {
    alert(`Playing test audio in the voice of: ${voiceProfile.voiceName}`);
  };

  return (
    <div className="voice-setup-page max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Personalized Voice Cloning</h1>

      {/* Step 1: Introduction */}
      {step === VoiceSetupStep.Introduction && (
        <div className="bg-white p-8 rounded-lg shadow-md space-y-4">
          <p className="text-lg">Give your A.U.R.A. a personalized voice! This voice will be used for spoken feedback during plan execution.</p>
          <input
            type="text"
            placeholder="Name your voice (e.g., 'Alex Home Voice')"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <button
            onClick={handleBeginCloning}
            disabled={!voiceName}
            className="w-full py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50"
          >
            Start Voice Cloning
          </button>
        </div>
      )}

      {/* Step 2: Record Samples */}
      {step === VoiceSetupStep.RecordSamples && (
        <div className="bg-white p-8 rounded-lg shadow-md space-y-4 text-center">
          <h2 className="text-2xl font-semibold">Record Your Voice Samples</h2>
          <p className="text-gray-600">Please record 3 short sentences to train your voice model.</p>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg">
            <p className="text-xl font-medium mb-4">Sample {voiceProfile.sampleCount + 1} of 3</p>
            <button
              onClick={handleRecordSample}
              className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <Mic className="w-8 h-8" />
            </button>
            <p className="mt-4 text-sm text-gray-500">Click to simulate recording a sample.</p>
          </div>
          <p className="text-lg font-medium">Samples Recorded: {voiceProfile.sampleCount}</p>
        </div>
      )}

      {/* Step 3: Training */}
      {step === VoiceSetupStep.Training && voiceProfile.status !== 'trained' && (
        <div className="bg-white p-8 rounded-lg shadow-md space-y-4 text-center">
          <h2 className="text-2xl font-semibold">Training Your Voice...</h2>
          <p className="text-gray-600">This may take a few moments. We are creating your personalized voice clone.</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-teal-600 h-2.5 rounded-full w-3/4 animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Step 4: Complete */}
      {step === VoiceSetupStep.Complete && voiceProfile.status === 'trained' && (
        <div className="bg-white p-8 rounded-lg shadow-md space-y-4 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold">Voice Cloning Complete!</h2>
          <p className="text-lg">Your personalized voice, **{voiceProfile.voiceName}**, is ready to use.</p>
          <button
            onClick={handlePlayTestAudio}
            className="flex items-center justify-center mx-auto py-2 px-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700"
          >
            <Volume2 className="w-5 h-5 mr-2" /> Test Playback
          </button>
        </div>
      )}
    </div>
  );
};
