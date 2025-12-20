// aura-project/src/hooks/useMockHistory.ts
import { useState, useCallback, useMemo } from 'react';
import { ExecutionLog } from '../lib/mockDataTypes';

const initialHistory: ExecutionLog[] = [
  { id: 'exec-1', goal: 'Movie time', status: 'success', durationMs: 4500, startedAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'exec-2', goal: 'Goodnight', status: 'success', durationMs: 6200, startedAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'exec-3', goal: 'Turn off all lights', status: 'failed', durationMs: 1500, startedAt: new Date(Date.now() - 10800000).toISOString() },
  { id: 'exec-4', goal: 'Leaving home', status: 'success', durationMs: 5100, startedAt: new Date(Date.now() - 14400000).toISOString() },
  { id: 'exec-5', goal: 'Set temperature to 75', status: 'success', durationMs: 1200, startedAt: new Date(Date.now() - 18000000).toISOString() },
];

export const useMockHistory = () => {
  const [history, setHistory] = useState<ExecutionLog[]>(initialHistory);

  const addLog = useCallback((log: ExecutionLog) => {
    setHistory(prev => [{ ...log, id: `exec-${Date.now()}` }, ...prev]);
  }, []);

  const stats = useMemo(() => {
    const totalPlans = history.length;
    const successCount = history.filter(log => log.status === 'success').length;
    const successRate = totalPlans > 0 ? Math.round((successCount / totalPlans) * 100) : 0;
    const avgDurationMs = totalPlans > 0 ? Math.round(history.reduce((sum, log) => sum + log.durationMs, 0) / totalPlans) : 0;
    
    const goalCounts = history.reduce((acc, log) => {
      acc[log.goal] = (acc[log.goal] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedGoal = Object.entries(goalCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

    return {
      totalPlans,
      successRate,
      avgDurationMs,
      mostUsedGoal,
    };
  }, [history]);

  return {
    history,
    addLog,
    stats,
  };
};
