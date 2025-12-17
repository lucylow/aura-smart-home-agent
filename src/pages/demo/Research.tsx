import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Brain, ArrowRight, Clock } from 'lucide-react';
import { PageWrapper } from '@/components/PageWrapper';

const Research = () => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 3000);
  };

  return (
    <PageWrapper 
      title="Research Query" 
      description="Enter a complex research question and watch the memory-aware pipeline process it."
    >
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a cross-domain research question..."
              className="w-full bg-glass backdrop-blur-xl border border-glass-border rounded-2xl pl-16 pr-6 py-6 text-lg focus:outline-none focus:ring-2 focus:ring-emerald/50 placeholder:text-muted-foreground"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isProcessing || !query}
            className="w-full bg-gradient-to-r from-emerald to-cyan text-primary-foreground py-5 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5" />
            <span>{isProcessing ? 'Processing...' : 'Run Research Query'}</span>
          </motion.button>
        </form>

        {/* Pipeline Visualization */}
        <div className="mt-16 space-y-6">
          <h3 className="text-xl font-bold">Pipeline Stages</h3>
          <div className="grid gap-4">
            {[
              { icon: Brain, label: 'Memory Retrieval', desc: 'Fetch relevant episodic memories', time: '0.3s' },
              { icon: Search, label: 'Graph Query', desc: 'Execute Neo4j Cypher for 3-hop paths', time: '0.8s' },
              { icon: Sparkles, label: 'Agent Orchestration', desc: 'Route to specialized agents', time: '1.2s' },
              { icon: ArrowRight, label: 'Synthesis', desc: 'Generate hypothesis with citations', time: '0.5s' },
            ].map((stage, i) => (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center space-x-4 p-6 rounded-2xl border transition-all ${
                  isProcessing && i === Math.floor((Date.now() / 1000) % 4)
                    ? 'bg-emerald/10 border-emerald/50'
                    : 'bg-glass border-glass-border'
                }`}
              >
                <div className="p-3 rounded-xl bg-glass">
                  <stage.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">{stage.label}</h4>
                  <p className="text-sm text-muted-foreground">{stage.desc}</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{stage.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Research;
