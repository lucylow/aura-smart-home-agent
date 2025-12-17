import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/PageWrapper';

const demos = [
  {
    id: 'research',
    title: 'Research Query',
    description: 'Watch how a complex research question flows through the memory-aware pipeline.',
    path: '/demo/research',
    color: 'from-cyan to-blue-500'
  },
  {
    id: 'graph',
    title: 'Neo4j Graph',
    description: 'Explore the concept graph with 3-hop reasoning across research domains.',
    path: '/demo/graph',
    color: 'from-purple to-pink-500'
  },
  {
    id: 'memory',
    title: 'MemMachine',
    description: 'See how episodic and semantic memories persist across research sessions.',
    path: '/demo/memory',
    color: 'from-emerald to-cyan'
  }
];

const Demo = () => {
  return (
    <PageWrapper 
      title="Live Demo" 
      description="Experience Memoria Scholae's memory-aware research pipeline in action."
    >
      <div className="grid md:grid-cols-3 gap-6">
        {demos.map((demo, i) => (
          <motion.div
            key={demo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={demo.path}>
              <div className="group bg-glass backdrop-blur-xl rounded-3xl p-8 border border-glass-border hover:border-emerald/50 transition-all h-full">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${demo.color} flex items-center justify-center mb-6`}>
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-emerald transition-colors">{demo.title}</h3>
                <p className="text-muted-foreground mb-6">{demo.description}</p>
                <div className="flex items-center text-emerald font-semibold">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 bg-glass backdrop-blur-xl rounded-3xl p-8 border border-glass-border"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-2xl font-bold mb-2">Quick Demo</h3>
            <p className="text-muted-foreground">Watch the full 2.5 minute demo flow</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-emerald to-cyan text-primary-foreground px-8 py-4 rounded-2xl font-bold flex items-center space-x-3"
          >
            <Play className="w-5 h-5" />
            <span>Watch Demo</span>
          </motion.button>
        </div>
      </motion.div>
    </PageWrapper>
  );
};

export default Demo;
