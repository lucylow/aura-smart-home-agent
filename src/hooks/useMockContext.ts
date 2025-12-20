// aura-project/src/hooks/useMockContext.ts
import { useState, useEffect, useMemo } from 'react';
import { ContextData } from '../lib/mockDataTypes';

const getInitialContext = (): ContextData => {
  const hour = new Date().getHours();
  let timeOfDay: ContextData['timeOfDay'];
  if (hour >= 5 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 22) timeOfDay = 'evening';
  else timeOfDay = 'night';

  return {
    timeOfDay,
    weather: {
      summary: 'Clear sky, 75°F',
      temperature: 75,
      isRaining: false,
    },
    occupancyCount: 2,
    indoorTemp: 70,
  };
};

export const useMockContext = () => {
  const [context, setContext] = useState<ContextData>(getInitialContext);

  // Simulate real-time context updates (e.g., time of day change)
  useEffect(() => {
    const interval = setInterval(() => {
      setContext(getInitialContext());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return context;
};
