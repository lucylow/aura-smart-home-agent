import React from 'react';
import { motion } from 'framer-motion';
import { Brain, BookOpen, Lightbulb, PenTool, Shield, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/PageWrapper';

const agents = [
  {
    id: 'pi',
    name: 'Principal Investigator',
    icon: Brain,
    description: 'Orchestrates the research pipeline and routes tasks to specialized agents.',
    path: '/agents/pi',
    color: 'from-emerald to-cyan'
  },
  {
    id: 'literature',
    name: 'Literature Agent',
    icon: BookOpen,
    description: 'Retrieves and synthesizes relevant papers from the research corpus.',
    path: '/agents/literature',
    color: 'from-cyan to-blue-500'
  },
  {
    id: 'hypothesis',
    name: 'Hypothesis Agent',
    icon: Lightbulb,
    description: 'Generates testable hypotheses based on graph reasoning and memory.',
    path: '/agents/hypothesis',
    color: 'from-purple to-pink-500'
  },
  {
    id: 'critic',
    name: 'Critic Agent',
    icon: Shield,
    description: 'Validates claims and identifies gaps in reasoning.',
    path: '/agents/pi',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'synthesizer',
    name: 'Synthesizer Agent',
    icon: Users,
    description: 'Combines outputs from multiple agents into coherent insights.',
    path: '/agents/pi',
    color: 'from-green-500 to-emerald'
  },
  {
    id: 'writer',
    name: 'Writer Agent',
    icon: PenTool,
    description: 'Transforms research findings into publication-ready text.',
    path: '/agents/pi',
    color: 'from-yellow to-orange-500'
  }
];

const Agents = () => {
  return (
    <PageWrapper 
      title="Agent Orchestra" 
      description="A 6-agent LangGraph pipeline that coordinates memory and graph reasoning."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={agent.path}>
              <div className="group bg-glass backdrop-blur-xl rounded-3xl p-8 border border-glass-border hover:border-emerald/50 transition-all h-full">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${agent.color} flex items-center justify-center mb-6`}>
                  <agent.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-emerald transition-colors">
                  {agent.name}
                </h3>
                <p className="text-muted-foreground mb-6 text-sm">{agent.description}</p>
                <div className="flex items-center text-emerald font-semibold text-sm">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Architecture Diagram */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 bg-glass backdrop-blur-xl rounded-3xl p-8 border border-glass-border"
      >
        <h3 className="text-2xl font-bold mb-6">Agent Communication Flow</h3>
        <div className="flex items-center justify-center space-x-4 overflow-x-auto py-4">
          {['PI Agent', 'Literature', 'Hypothesis', 'Critic', 'Synthesizer', 'Writer'].map((agent, i) => (
            <React.Fragment key={agent}>
              <div className="flex flex-col items-center space-y-2 min-w-[100px]">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald to-cyan flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs font-medium text-center">{agent}</span>
              </div>
              {i < 5 && <ArrowRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </PageWrapper>
  );
};

export default Agents;
