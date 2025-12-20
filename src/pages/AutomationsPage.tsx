// aura-project/src/pages/AutomationsPage.tsx
import React from 'react';
import { useMockAutomations } from '../hooks/useMockAutomations';
import { Clock, Zap, ToggleLeft, ToggleRight, Plus, Trash2 } from 'lucide-react';

const AutomationCard: React.FC<{ rule: any; onToggle: (id: string) => void; onDelete: (id: string) => void }> = ({ rule, onToggle, onDelete }) => {
  const triggerIcon = rule.trigger.type === 'time' ? <Clock className="w-5 h-5 text-blue-500" /> : <Zap className="w-5 h-5 text-yellow-500" />;
  const actionText = rule.action.type === 'scene' ? `Run Scene: ${rule.action.targetId}` : `Control Device: ${rule.action.targetId}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold mb-1">{rule.name}</h2>
        <div className="flex items-center text-sm text-gray-600 space-x-4">
          <p className="flex items-center">
            {triggerIcon}
            <span className="ml-1 font-medium">Trigger:</span> {rule.trigger.type} at {rule.trigger.value}
          </p>
          <p>
            <span className="font-medium">Action:</span> {actionText}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={() => onToggle(rule.id)} className="text-teal-600 hover:text-teal-800">
          {rule.isEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
        </button>
        <button onClick={() => onDelete(rule.id)} className="text-red-500 hover:text-red-700">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export const AutomationsPage: React.FC = () => {
  const { automations, toggleAutomation, deleteAutomation } = useMockAutomations();

  return (
    <div className="automations-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Smart Automations</h1>
        <button className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" /> Create New Rule
        </button>
      </div>

      <div className="space-y-4">
        {automations.map((rule) => (
          <AutomationCard
            key={rule.id}
            rule={rule}
            onToggle={toggleAutomation}
            onDelete={deleteAutomation}
          />
        ))}
      </div>

      {automations.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No automation rules defined.</p>
      )}
    </div>
  );
};
