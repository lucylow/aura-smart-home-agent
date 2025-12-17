import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Zap, Database, Brain, Shield } from 'lucide-react';
import { PageWrapper } from '@/components/PageWrapper';

const sections = [
  {
    title: 'Getting Started',
    icon: Zap,
    items: ['Installation', 'Quick Start', 'Configuration', 'First Query']
  },
  {
    title: 'Core Concepts',
    icon: Brain,
    items: ['Memory Architecture', 'Graph Reasoning', 'Agent Orchestration', 'Pipeline Flow']
  },
  {
    title: 'API Reference',
    icon: Code,
    items: ['REST Endpoints', 'GraphQL Schema', 'WebSocket Events', 'Error Handling']
  },
  {
    title: 'Database',
    icon: Database,
    items: ['Neo4j Setup', 'Schema Design', 'Cypher Queries', 'Performance Tuning']
  }
];

const Docs = () => {
  return (
    <PageWrapper 
      title="Documentation" 
      description="Complete guide to building with Memoria Scholae."
    >
      <div className="grid md:grid-cols-2 gap-6">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-glass backdrop-blur-xl rounded-3xl p-8 border border-glass-border"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald to-cyan flex items-center justify-center">
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">{section.title}</h3>
            </div>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item}>
                  <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-glass-hover transition-all text-muted-foreground hover:text-foreground flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{item}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-gradient-to-r from-emerald/20 to-cyan/20 rounded-3xl p-8 border border-emerald/30"
      >
        <div className="flex items-center space-x-4 mb-4">
          <Shield className="w-8 h-8 text-emerald" />
          <h3 className="text-xl font-bold">Need Help?</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          Join our community or reach out for support with your implementation.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-glass hover:bg-glass-hover px-6 py-3 rounded-xl font-semibold transition-all">
            Discord Community
          </button>
          <button className="bg-glass hover:bg-glass-hover px-6 py-3 rounded-xl font-semibold transition-all">
            GitHub Issues
          </button>
        </div>
      </motion.div>
    </PageWrapper>
  );
};

export default Docs;
