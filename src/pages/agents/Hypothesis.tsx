import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Sparkles, Target, CheckCircle } from 'lucide-react';
import { PageWrapper } from '@/components/PageWrapper';

const hypotheses = [
  { id: 1, text: 'CRISPR-based delivery could enhance AlphaFold-predicted drug candidates for cancer treatment', confidence: 87, status: 'validated' },
  { id: 2, text: 'Memory-augmented models improve research synthesis by 40% over baseline', confidence: 72, status: 'testing' },
  { id: 3, text: 'Graph reasoning enables novel cross-domain connections undetectable by keyword search', confidence: 94, status: 'validated' },
];

const Hypothesis = () => {
  return (
    <PageWrapper 
      title="Hypothesis Agent" 
      description="Generates testable hypotheses based on graph reasoning and memory."
    >
      <div className="space-y-8">
        <div className="bg-glass backdrop-blur-xl rounded-3xl p-8 border border-glass-border">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple to-pink-500 flex items-center justify-center">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Hypothesis Generation</h3>
              <p className="text-muted-foreground">Combining memory + graph for novel insights</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Sparkles, label: 'Pattern Recognition', value: 'Cross-domain' },
              { icon: Target, label: 'Confidence Threshold', value: '70%+' },
              { icon: CheckCircle, label: 'Validation Rate', value: '89%' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-glass-hover text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-purple" />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold">Generated Hypotheses</h3>
          {hypotheses.map((hyp, i) => (
            <motion.div
              key={hyp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-glass backdrop-blur-xl rounded-2xl p-6 border border-glass-border"
            >
              <div className="flex items-start justify-between mb-4">
                <p className="flex-1 pr-4">{hyp.text}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  hyp.status === 'validated' ? 'bg-emerald/20 text-emerald' : 'bg-yellow/20 text-yellow'
                }`}>
                  {hyp.status}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">Confidence:</span>
                <div className="flex-1 h-2 bg-glass-hover rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple to-pink-500"
                    style={{ width: `${hyp.confidence}%` }}
                  />
                </div>
                <span className="font-mono text-sm">{hyp.confidence}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Hypothesis;
