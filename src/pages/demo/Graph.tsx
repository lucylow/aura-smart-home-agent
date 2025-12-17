import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Database, GitBranch, Zap } from 'lucide-react';
import { PageWrapper } from '@/components/PageWrapper';

const Graph = () => {
  const nodes = [
    { id: 1, label: 'CRISPR', x: 50, y: 30, type: 'method' },
    { id: 2, label: 'Protein Folding', x: 20, y: 50, type: 'concept' },
    { id: 3, label: 'Drug Discovery', x: 80, y: 50, type: 'domain' },
    { id: 4, label: 'AlphaFold', x: 35, y: 70, type: 'tool' },
    { id: 5, label: 'Cancer Research', x: 65, y: 70, type: 'domain' },
  ];

  const edges = [
    { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 4 },
    { from: 3, to: 5 }, { from: 4, to: 5 }, { from: 2, to: 3 }
  ];

  const typeColors: Record<string, string> = {
    method: 'bg-cyan',
    concept: 'bg-purple',
    domain: 'bg-emerald',
    tool: 'bg-yellow'
  };

  return (
    <PageWrapper 
      title="Neo4j Graph" 
      description="Visualize the concept graph with 3-hop reasoning across research domains."
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Graph Visualization */}
        <div className="lg:col-span-2 bg-glass backdrop-blur-xl rounded-3xl p-8 border border-glass-border relative overflow-hidden min-h-[500px]">
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100">
            {/* Edges */}
            {edges.map((edge, i) => {
              const from = nodes.find(n => n.id === edge.from)!;
              const to = nodes.find(n => n.id === edge.to)!;
              return (
                <motion.line
                  key={i}
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke="hsl(var(--emerald) / 0.3)"
                  strokeWidth="0.3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              );
            })}
            {/* Nodes */}
            {nodes.map((node, i) => (
              <motion.g key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <circle
                  cx={node.x} cy={node.y} r="4"
                  className={`fill-current ${node.type === 'method' ? 'text-cyan' : node.type === 'concept' ? 'text-purple' : node.type === 'domain' ? 'text-emerald' : 'text-yellow'}`}
                />
                <text
                  x={node.x} y={node.y + 8}
                  textAnchor="middle"
                  className="fill-current text-muted-foreground text-[3px]"
                >
                  {node.label}
                </text>
              </motion.g>
            ))}
          </svg>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-glass backdrop-blur-xl rounded-2xl p-6 border border-glass-border">
            <h3 className="font-bold mb-4 flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Graph Stats</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nodes</span>
                <span className="font-mono">12,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Edges</span>
                <span className="font-mono">45,291</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Depth</span>
                <span className="font-mono">3 hops</span>
              </div>
            </div>
          </div>

          <div className="bg-glass backdrop-blur-xl rounded-2xl p-6 border border-glass-border">
            <h3 className="font-bold mb-4 flex items-center space-x-2">
              <GitBranch className="w-5 h-5" />
              <span>Node Types</span>
            </h3>
            <div className="space-y-2">
              {Object.entries(typeColors).map(([type, color]) => (
                <div key={type} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="capitalize text-sm">{type}</span>
                </div>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-emerald to-cyan text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center space-x-2"
          >
            <Zap className="w-5 h-5" />
            <span>Run Query</span>
          </motion.button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Graph;
