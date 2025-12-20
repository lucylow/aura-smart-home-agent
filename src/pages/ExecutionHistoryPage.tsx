// aura-project/src/pages/ExecutionHistoryPage.tsx
import React from 'react';
import { useMockHistory } from '../hooks/useMockHistory';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-3xl font-bold text-teal-600 mt-1">{value}</p>
  </div>
);

export const ExecutionHistoryPage: React.FC = () => {
  const { history, stats } = useMockHistory();

  return (
    <div className="execution-history-page">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Execution History & Analytics</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Plans" value={stats.totalPlans} />
        <StatCard title="Success Rate" value={`${stats.successRate}%`} />
        <StatCard title="Avg Duration" value={`${stats.avgDurationMs}ms`} />
        <StatCard title="Most Used Goal" value={stats.mostUsedGoal} />
      </div>

      {/* History Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Executions</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(log.startedAt).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.goal}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {log.status === 'success' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {log.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.durationMs}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
