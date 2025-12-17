import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Clock, Layers, Sparkles, Calendar } from 'lucide-react';
import { PageWrapper } from '@/components/PageWrapper';

const memories = [
  { id: 1, type: 'episodic', content: 'Researched CRISPR applications in cancer therapy', time: '2 hours ago', relevance: 95 },
  { id: 2, type: 'semantic', content: 'CRISPR-Cas9 enables precise gene editing', time: '1 day ago', relevance: 88 },
  { id: 3, type: 'episodic', content: 'Explored AlphaFold protein structure predictions', time: '3 days ago', relevance: 72 },
  { id: 4, type: 'semantic', content: 'Protein folding determines biological function', time: '1 week ago', relevance: 65 },
];

const Memory = () => {
  return (
    <PageWrapper 
      title="MemMachine" 
      description="Explore how episodic and semantic memories persist across research sessions."
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Memory Timeline */}
        <div className="lg:col-span-2 space-y-4">
          {memories.map((memory, i) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-glass backdrop-blur-xl rounded-2xl p-6 border border-glass-border hover:border-emerald/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  memory.type === 'episodic' 
                    ? 'bg-cyan/20 text-cyan' 
                    : 'bg-purple/20 text-purple'
                }`}>
                  {memory.type}
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{memory.time}</span>
                </div>
              </div>
              <p className="text-foreground mb-4">{memory.content}</p>
              <div className="flex items-center space-x-4">
                <div className="flex-1 h-2 bg-glass-hover rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${memory.relevance}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-emerald to-cyan"
                  />
                </div>
                <span className="text-sm font-mono text-muted-foreground">{memory.relevance}%</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Memory Stats */}
        <div className="space-y-6">
          <div className="bg-glass backdrop-blur-xl rounded-2xl p-6 border border-glass-border">
            <h3 className="font-bold mb-4 flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Memory Stats</span>
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Episodic', value: '2,847', icon: Calendar },
                { label: 'Semantic', value: '1,293', icon: Layers },
                { label: 'Active', value: '156', icon: Sparkles },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <stat.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="font-mono font-bold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-glass backdrop-blur-xl rounded-2xl p-6 border border-glass-border">
            <h3 className="font-bold mb-4">Memory Types</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-cyan/10 border border-cyan/30">
                <span className="font-bold text-cyan">Episodic</span>
                <p className="text-muted-foreground mt-1">Records of specific research interactions and discoveries</p>
              </div>
              <div className="p-3 rounded-xl bg-purple/10 border border-purple/30">
                <span className="font-bold text-purple">Semantic</span>
                <p className="text-muted-foreground mt-1">Distilled facts and relationships from research</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Memory;
