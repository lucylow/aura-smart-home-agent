import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, Upload, Send, Loader2, AlertCircle, Zap, BookOpen, 
  GitBranch, Settings, LogOut, Menu, X, Plus, FileText, Brain
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';

// Types
interface Paper {
  paper_id: string;
  title: string;
  abstract?: string;
  authors?: string[];
  year?: number;
  venue?: string;
  concepts?: string[];
  status: string;
}

interface QueryResult {
  results: {
    type: string;
    core_concepts?: string[];
    related_concepts?: Record<string, string[]>;
    papers?: Paper[];
    emerging_themes?: string[];
  };
  explanation: string;
  memory_context: string[];
  suggested_followups: string[];
}

interface GraphNode {
  id: string;
  label: string;
  group: string;
  x?: number;
  y?: number;
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
}

// Mock API - replace with real API calls
const mockPapers: Paper[] = [
  { paper_id: '1', title: 'Graph Neural Networks for Scientific Discovery', year: 2024, status: 'processed', concepts: ['GNN', 'ML', 'Science'], authors: ['Smith et al.'] },
  { paper_id: '2', title: 'Memory-Augmented Language Models', year: 2023, status: 'processed', concepts: ['LLM', 'Memory', 'NLP'], authors: ['Johnson et al.'] },
];

const mockQuery = async (query: string): Promise<QueryResult> => {
  await new Promise(r => setTimeout(r, 1500));
  return {
    results: {
      type: 'analysis',
      core_concepts: ['Graph Neural Networks', 'Few-shot Learning', 'Meta-learning'],
      papers: mockPapers,
      emerging_themes: ['Combining GNNs with LLMs', 'Self-supervised graph learning']
    },
    explanation: `Based on your query about "${query}", I found connections between graph neural networks and few-shot learning paradigms. The knowledge graph reveals 3-hop relationships through meta-learning concepts.`,
    memory_context: ['Previous session: explored transformer architectures', 'Related to your interest in neural memory'],
    suggested_followups: ['How do attention mechanisms enhance GNNs?', 'What are the limitations of current few-shot GNN methods?']
  };
};

// Components
const Sidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  papers: Paper[];
  selectedPaper: Paper | null;
  onSelectPaper: (paper: Paper) => void;
  onUploadClick: () => void;
}> = ({ isOpen, onClose, papers, selectedPaper, onSelectPaper, onUploadClick }) => (
  <>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    </AnimatePresence>
    <motion.aside
      initial={false}
      animate={{ x: isOpen ? 0 : '-100%' }}
      className={`fixed lg:relative top-0 left-0 h-full w-72 bg-card border-r border-glass-border z-50 lg:translate-x-0 lg:block ${!isOpen && 'lg:!translate-x-0'}`}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Research Library</h2>
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-glass-hover rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <button onClick={onUploadClick} className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-emerald to-cyan text-primary-foreground rounded-xl font-semibold mb-4">
          <Upload className="w-5 h-5" />
          Upload Paper
        </button>
        <div className="flex-1 overflow-y-auto space-y-2">
          {papers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No papers yet</p>
            </div>
          ) : papers.map(paper => (
            <button
              key={paper.paper_id}
              onClick={() => { onSelectPaper(paper); onClose(); }}
              className={`w-full text-left p-3 rounded-xl transition-all ${selectedPaper?.paper_id === paper.paper_id ? 'bg-emerald/20 border border-emerald/50' : 'bg-glass hover:bg-glass-hover border border-glass-border'}`}
            >
              <p className="font-medium text-sm line-clamp-2">{paper.title}</p>
              {paper.year && <p className="text-xs text-muted-foreground mt-1">{paper.year}</p>}
            </button>
          ))}
        </div>
      </div>
    </motion.aside>
  </>
);

const QueryInterface: React.FC<{
  onQuery: (q: string) => void;
  isLoading: boolean;
  suggestedQueries: string[];
}> = ({ onQuery, isLoading, suggestedQueries }) => {
  const [query, setQuery] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) { onQuery(query); setQuery(''); }
  };
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask about your research..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-glass border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald/50 placeholder:text-muted-foreground"
        />
        <button type="submit" disabled={isLoading || !query.trim()} className="px-6 py-3 bg-gradient-to-r from-emerald to-cyan text-primary-foreground rounded-xl font-semibold disabled:opacity-50 flex items-center gap-2">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
      {suggestedQueries.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestedQueries.map((q, i) => (
            <button key={i} onClick={() => onQuery(q)} className="px-3 py-1.5 text-sm bg-glass border border-glass-border rounded-full hover:bg-glass-hover transition-all">
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ResultsPanel: React.FC<{ result: QueryResult | null; isLoading: boolean }> = ({ result, isLoading }) => {
  if (isLoading) return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-emerald" />
      <span className="ml-3 text-muted-foreground">Searching knowledge graph...</span>
    </div>
  );
  if (!result) return (
    <div className="text-center py-12 text-muted-foreground">
      <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
      <p>Enter a query to explore your research</p>
    </div>
  );
  return (
    <div className="space-y-6">
      <div className="bg-glass rounded-2xl p-6 border border-glass-border">
        <h3 className="font-bold mb-3">Analysis</h3>
        <p className="text-muted-foreground">{result.explanation}</p>
      </div>
      {result.results.core_concepts && (
        <div>
          <h3 className="font-bold mb-3">Core Concepts</h3>
          <div className="flex flex-wrap gap-2">
            {result.results.core_concepts.map((c, i) => (
              <span key={i} className="px-3 py-1.5 bg-emerald/20 text-emerald rounded-full text-sm font-medium">{c}</span>
            ))}
          </div>
        </div>
      )}
      {result.results.papers && result.results.papers.length > 0 && (
        <div>
          <h3 className="font-bold mb-3">Related Papers</h3>
          <div className="space-y-2">
            {result.results.papers.map(p => (
              <div key={p.paper_id} className="p-4 bg-glass rounded-xl border border-glass-border">
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-muted-foreground">{p.year}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {result.memory_context.length > 0 && (
        <div className="bg-purple/10 rounded-2xl p-4 border border-purple/30">
          <h3 className="font-bold text-purple mb-2">From Your Memory</h3>
          <p className="text-sm text-muted-foreground">{result.memory_context.length} relevant memories recalled</p>
        </div>
      )}
    </div>
  );
};

const KnowledgeGraph: React.FC<{ nodes: GraphNode[]; edges: GraphEdge[] }> = ({ nodes, edges }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const width = canvas.offsetWidth, height = canvas.offsetHeight;
    
    nodes.forEach((node, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      const radius = Math.min(width, height) / 2 - 60;
      node.x = width / 2 + Math.cos(angle) * radius;
      node.y = height / 2 + Math.sin(angle) * radius;
    });
    
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.lineWidth = 1;
    edges.forEach(edge => {
      const from = nodes.find(n => n.id === edge.from);
      const to = nodes.find(n => n.id === edge.to);
      if (from && to && from.x && from.y && to.x && to.y) {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      }
    });
    
    nodes.forEach(node => {
      if (!node.x || !node.y) return;
      ctx.fillStyle = node.group === 'concept' ? '#10b981' : '#8b5cf6';
      ctx.beginPath();
      ctx.arc(node.x, node.y, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label.substring(0, 8), node.x, node.y);
    });
  }, [nodes, edges]);
  
  if (nodes.length === 0) return (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      <GitBranch className="w-16 h-16 opacity-50" />
    </div>
  );
  return <canvas ref={canvasRef} className="w-full h-full" />;
};

const UploadModal: React.FC<{ isOpen: boolean; onClose: () => void; onUpload: (f: File) => void; isLoading: boolean }> = ({ isOpen, onClose, onUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  if (!isOpen) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-card rounded-3xl p-8 max-w-md w-full border border-glass-border">
        <h2 className="text-2xl font-bold mb-6">Upload Research Paper</h2>
        <div
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) onUpload(e.dataTransfer.files[0]); }}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragActive ? 'border-emerald bg-emerald/10' : 'border-glass-border'}`}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="font-medium mb-2">Drag and drop your PDF here</p>
          <label className="text-emerald cursor-pointer hover:underline">
            <input type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])} />
            Browse Files
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 bg-glass border border-glass-border rounded-xl font-semibold hover:bg-glass-hover">Cancel</button>
        </div>
        {isLoading && <div className="flex items-center justify-center mt-4 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mr-2" />Processing...</div>}
      </motion.div>
    </motion.div>
  );
};

// Main App
const MemoriaApp: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>(mockPapers);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'query' | 'graph'>('query');
  const [suggestedQueries] = useState(['Find papers combining GNNs with few-shot learning', 'What are emerging themes in memory-augmented models?']);
  
  const graphData: { nodes: GraphNode[]; edges: GraphEdge[] } = {
    nodes: [
      { id: '1', label: 'GNN', group: 'concept' },
      { id: '2', label: 'LLM', group: 'concept' },
      { id: '3', label: 'Memory', group: 'concept' },
      { id: '4', label: 'Meta-learn', group: 'concept' },
      { id: '5', label: 'Few-shot', group: 'concept' },
    ],
    edges: [
      { from: '1', to: '2', label: 'combines' },
      { from: '2', to: '3', label: 'uses' },
      { from: '1', to: '4', label: 'enables' },
      { from: '4', to: '5', label: 'supports' },
    ]
  };

  const handleQuery = async (query: string) => {
    setIsLoading(true);
    try {
      const result = await mockQuery(query);
      setQueryResult(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    const newPaper: Paper = {
      paper_id: Date.now().toString(),
      title: file.name.replace('.pdf', ''),
      year: 2024,
      status: 'processing',
      concepts: []
    };
    setPapers([...papers, newPaper]);
    setIsUploadOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="flex pt-24">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} papers={papers} selectedPaper={selectedPaper} onSelectPaper={setSelectedPaper} onUploadClick={() => setIsUploadOpen(true)} />
        
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-glass rounded-xl border border-glass-border">
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold gradient-text">Research Assistant</h1>
              <div className="flex gap-2">
                <button onClick={() => setActiveTab('query')} className={`px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'query' ? 'bg-emerald text-primary-foreground' : 'bg-glass hover:bg-glass-hover'}`}>
                  <Zap className="w-4 h-4 inline mr-2" />Query
                </button>
                <button onClick={() => setActiveTab('graph')} className={`px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'graph' ? 'bg-emerald text-primary-foreground' : 'bg-glass hover:bg-glass-hover'}`}>
                  <GitBranch className="w-4 h-4 inline mr-2" />Graph
                </button>
              </div>
            </div>

            {activeTab === 'query' ? (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <QueryInterface onQuery={handleQuery} isLoading={isLoading} suggestedQueries={suggestedQueries} />
                  {selectedPaper && (
                    <div className="bg-glass rounded-2xl p-6 border border-glass-border">
                      <h3 className="font-bold mb-2">{selectedPaper.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{selectedPaper.authors?.join(', ')} • {selectedPaper.year}</p>
                      {selectedPaper.concepts && (
                        <div className="flex flex-wrap gap-2">
                          {selectedPaper.concepts.map((c, i) => (
                            <span key={i} className="px-2 py-1 bg-purple/20 text-purple rounded-full text-xs">{c}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="bg-card rounded-2xl border border-glass-border p-6 min-h-[400px]">
                  <ResultsPanel result={queryResult} isLoading={isLoading} />
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-glass-border h-[600px]">
                <KnowledgeGraph nodes={graphData.nodes} edges={graphData.edges} />
              </div>
            )}
          </div>
        </main>
      </div>
      
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUpload={handleUpload} isLoading={false} />
    </div>
  );
};

export default MemoriaApp;
