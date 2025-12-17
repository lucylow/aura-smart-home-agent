import React from 'react';
import { motion } from 'framer-motion';
import { Brain, GitBranch, Zap, Settings, Activity } from 'lucide-react';
import { PageWrapper } from '@/components/PageWrapper';

const PI = () => {
  return (
    <PageWrapper 
      title="Principal Investigator" 
      description="The orchestration layer that routes tasks to specialized agents."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-glass backdrop-blur-xl rounded-3xl p-8 border border-glass-border">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald to-cyan flex items-center justify-center mb-6">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Core Responsibilities</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                <span>Parse incoming research queries and identify required agents</span>
              </li>
              <li className="flex items-start space-x-3">
                <GitBranch className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                <span>Route tasks to Literature, Hypothesis, and Critic agents</span>
              </li>
              <li className="flex items-start space-x-3">
                <Activity className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                <span>Coordinate memory reads/writes across the pipeline</span>
              </li>
              <li className="flex items-start space-x-3">
                <Settings className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                <span>Manage graph queries and cross-agent reasoning</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-glass backdrop-blur-xl rounded-3xl p-8 border border-glass-border">
          <h3 className="text-xl font-bold mb-6">Agent Metrics</h3>
          <div className="space-y-4">
            {[
              { label: 'Avg Response Time', value: '0.8s' },
              { label: 'Tasks Routed/Hour', value: '247' },
              { label: 'Memory Queries', value: '1,293' },
              { label: 'Graph Hops', value: '3 max' },
            ].map((metric) => (
              <div key={metric.label} className="flex justify-between items-center p-4 rounded-xl bg-glass-hover">
                <span className="text-muted-foreground">{metric.label}</span>
                <span className="font-mono font-bold text-emerald">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PI;
