import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Code, Copy, Check, Zap, Database } from 'lucide-react';
import { PageWrapper } from '@/components/PageWrapper';

const endpoints = [
  { method: 'POST', path: '/api/v1/query', desc: 'Submit a research query' },
  { method: 'GET', path: '/api/v1/memory/:id', desc: 'Retrieve memory by ID' },
  { method: 'POST', path: '/api/v1/graph/query', desc: 'Execute Cypher query' },
  { method: 'GET', path: '/api/v1/agents/status', desc: 'Get agent pipeline status' },
];

const codeExample = `// Example: Submit a research query
const response = await fetch('https://api.memoriaschola.ai/v1/query', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'How does CRISPR relate to protein folding?',
    options: {
      maxHops: 3,
      includeMemory: true
    }
  })
});

const result = await response.json();
console.log(result.hypothesis);`;

const Api = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageWrapper 
      title="API Reference" 
      description="Integrate Memoria Scholae's research pipeline into your applications."
    >
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Code Example */}
          <div className="bg-card rounded-3xl border border-glass-border overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-glass-border">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-emerald" />
                <span className="font-semibold">Quick Start</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-glass-hover transition-all text-sm"
              >
                {copied ? <Check className="w-4 h-4 text-emerald" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-6 overflow-x-auto text-sm">
              <code className="text-muted-foreground">{codeExample}</code>
            </pre>
          </div>

          {/* Endpoints */}
          <div className="bg-glass backdrop-blur-xl rounded-3xl p-8 border border-glass-border">
            <h3 className="text-xl font-bold mb-6">Endpoints</h3>
            <div className="space-y-3">
              {endpoints.map((ep, i) => (
                <motion.div
                  key={ep.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-glass-hover"
                >
                  <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                    ep.method === 'POST' ? 'bg-emerald/20 text-emerald' : 'bg-cyan/20 text-cyan'
                  }`}>
                    {ep.method}
                  </span>
                  <code className="font-mono text-sm flex-1">{ep.path}</code>
                  <span className="text-sm text-muted-foreground hidden sm:block">{ep.desc}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-glass backdrop-blur-xl rounded-2xl p-6 border border-glass-border">
            <h3 className="font-bold mb-4 flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Authentication</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              All API requests require a Bearer token in the Authorization header.
            </p>
            <button className="w-full bg-gradient-to-r from-emerald to-cyan text-primary-foreground py-3 rounded-xl font-bold text-sm">
              Get API Key
            </button>
          </div>

          <div className="bg-glass backdrop-blur-xl rounded-2xl p-6 border border-glass-border">
            <h3 className="font-bold mb-4 flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Rate Limits</span>
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Free tier</span>
                <span className="font-mono">100/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pro tier</span>
                <span className="font-mono">10,000/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Enterprise</span>
                <span className="font-mono">Unlimited</span>
              </div>
            </div>
          </div>

          <div className="bg-glass backdrop-blur-xl rounded-2xl p-6 border border-glass-border">
            <h3 className="font-bold mb-4 flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>SDKs</span>
            </h3>
            <div className="space-y-2">
              {['Python', 'JavaScript', 'Go', 'Rust'].map((lang) => (
                <button
                  key={lang}
                  className="w-full text-left px-4 py-2 rounded-xl hover:bg-glass-hover transition-all text-sm"
                >
                  {lang} SDK
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Api;
