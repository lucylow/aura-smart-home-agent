import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, FileText, Database } from 'lucide-react';
import { PageWrapper } from '@/components/PageWrapper';

const Literature = () => {
  return (
    <PageWrapper 
      title="Literature Agent" 
      description="Retrieves and synthesizes relevant papers from the research corpus."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-glass backdrop-blur-xl rounded-3xl p-8 border border-glass-border">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan to-blue-500 flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Capabilities</h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start space-x-3">
              <Search className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" />
              <span>Semantic search across 50M+ research papers</span>
            </li>
            <li className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" />
              <span>Extract key findings, methods, and citations</span>
            </li>
            <li className="flex items-start space-x-3">
              <Database className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" />
              <span>Cross-reference with Neo4j concept graph</span>
            </li>
          </ul>
        </div>

        <div className="bg-glass backdrop-blur-xl rounded-3xl p-8 border border-glass-border">
          <h3 className="text-xl font-bold mb-6">Recent Retrievals</h3>
          <div className="space-y-3">
            {[
              { title: 'CRISPR-Cas9 in Cancer Immunotherapy', year: 2024, citations: 847 },
              { title: 'AlphaFold and Drug Discovery', year: 2023, citations: 1293 },
              { title: 'Memory-Augmented Neural Networks', year: 2024, citations: 456 },
            ].map((paper, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-glass-hover hover:bg-cyan/10 transition-all cursor-pointer"
              >
                <h4 className="font-semibold text-sm">{paper.title}</h4>
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <span>{paper.year}</span>
                  <span>{paper.citations} citations</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Literature;
