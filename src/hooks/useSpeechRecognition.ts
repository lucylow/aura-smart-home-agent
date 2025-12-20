// aura-project/src/hooks/useSpeechRecognition.ts
import { useState, useCallback } from 'react';

// Mock implementation for useSpeechRecognition
export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    setIsListening(true);
    setTranscript('Dim the lights and start the movie.');
    // In a real app, this would start the Web Speech API
    setTimeout(() => {
      setIsListening(false);
    }, 3000);
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
  };
};
