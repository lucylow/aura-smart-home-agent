import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Zap, Lightbulb, BookOpen, Shield, Menu, X, ChevronDown, ChevronRight, 
  Award, Github, Twitter 
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  subItems?: { id: string; label: string; path: string }[];
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', path: '/', icon: <Brain className="w-5 h-5" /> },
  { id: 'app', label: 'Research App', path: '/app', icon: <Zap className="w-5 h-5" /> },
  { 
    id: 'demo', 
    label: 'Live Demo', 
    path: '/demo', 
    icon: <Zap className="w-5 h-5" />,
    subItems: [
      { id: 'demo-research', label: 'Research Query', path: '/demo/research' },
      { id: 'demo-graph', label: 'Neo4j Graph', path: '/demo/graph' },
      { id: 'demo-memory', label: 'MemMachine', path: '/demo/memory' }
    ]
  },
  { 
    id: 'agents', 
    label: 'Agent Orchestra', 
    path: '/agents', 
    icon: <Lightbulb className="w-5 h-5" />,
    subItems: [
      { id: 'agents-pi', label: 'Principal Investigator', path: '/agents/pi' },
      { id: 'agents-lit', label: 'Literature Agent', path: '/agents/literature' },
      { id: 'agents-hypothesis', label: 'Hypothesis Agent', path: '/agents/hypothesis' }
    ]
  },
  { id: 'docs', label: 'Documentation', path: '/docs', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'api', label: 'API', path: '/api', icon: <Shield className="w-5 h-5" /> }
];

export const Navigation: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const hasActiveSubItem = (item: NavItem) => 
    item.subItems?.some(sub => isActive(sub.path)) || false;

  const handleNav = (path: string) => {
    if (path.startsWith('#')) {
      document.getElementById(path.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(path);
    }
    setHoveredItem('');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="lg:hidden fixed top-6 right-6 z-50 p-3 bg-glass backdrop-blur-xl rounded-2xl border border-glass-border hover:bg-glass-hover transition-all shadow-card"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Desktop Nav */}
      <motion.nav className="hidden lg:block fixed top-0 left-1/2 transform -translate-x-1/2 pt-6 z-40">
        <div className="bg-glass backdrop-blur-2xl rounded-3xl px-6 py-4 border border-glass-border shadow-card">
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.id} className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem('')}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNav(item.path)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                    isActive(item.path) || hasActiveSubItem(item)
                      ? 'bg-gradient-to-r from-emerald to-cyan text-primary-foreground shadow-glow'
                      : 'text-muted-foreground hover:text-foreground hover:bg-glass-hover'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.subItems && <ChevronDown className={`w-4 h-4 transition-transform ${hoveredItem === item.id ? 'rotate-180' : ''}`} />}
                </motion.button>
                <AnimatePresence>
                  {hoveredItem === item.id && item.subItems && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 bg-card backdrop-blur-2xl rounded-2xl p-3 border border-glass-border shadow-card min-w-[200px]"
                    >
                      {item.subItems.map((sub) => (
                        <motion.button
                          key={sub.id}
                          whileHover={{ x: 4 }}
                          onClick={() => handleNav(sub.path)}
                          className={`w-full flex items-center space-x-2 px-4 py-2 rounded-xl transition-all text-left ${
                            isActive(sub.path) 
                              ? 'bg-emerald/20 text-emerald' 
                              : 'hover:bg-glass-hover text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <ChevronRight className="w-4 h-4" />
                          <span>{sub.label}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="lg:hidden fixed top-0 right-0 h-full w-80 bg-card/95 backdrop-blur-2xl border-l border-glass-border z-40"
          >
            <div className="p-8 pt-24 space-y-6">
              <h2 className="text-2xl font-black gradient-text">Memoria Scholae</h2>
              <nav className="space-y-3">
                {navItems.map((item) => (
                  <div key={item.id}>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { handleNav(item.path); setMobileOpen(false); }}
                      className={`w-full flex items-center space-x-4 p-4 rounded-2xl border transition-all ${
                        isActive(item.path) || hasActiveSubItem(item)
                          ? 'bg-gradient-to-r from-emerald/20 to-cyan/20 border-emerald/50'
                          : 'border-glass-border hover:bg-glass-hover'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${isActive(item.path) ? 'bg-emerald/20' : 'bg-glass'}`}>
                        {item.icon}
                      </div>
                      <span className="font-semibold flex-1 text-left">{item.label}</span>
                      {item.subItems && <ChevronRight className={`w-5 h-5 ${isActive(item.path) ? 'text-emerald' : ''}`} />}
                    </motion.button>
                    {item.subItems && (
                      <div className="ml-8 mt-2 space-y-1">
                        {item.subItems.map((sub) => (
                          <motion.button
                            key={sub.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { handleNav(sub.path); setMobileOpen(false); }}
                            className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${
                              isActive(sub.path) ? 'text-emerald bg-emerald/10' : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {sub.label}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              <div className="pt-6 border-t border-glass-border">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground mb-4">
                  <Award className="w-5 h-5 text-yellow" />
                  <span>AI Agents Hackathon SFO28</span>
                </div>
                <div className="flex space-x-3">
                  <motion.a href="#" whileTap={{ scale: 0.95 }} className="p-3 bg-glass rounded-xl border border-glass-border hover:bg-glass-hover transition-all">
                    <Github className="w-5 h-5" />
                  </motion.a>
                  <motion.a href="#" whileTap={{ scale: 0.95 }} className="p-3 bg-glass rounded-xl border border-glass-border hover:bg-glass-hover transition-all">
                    <Twitter className="w-5 h-5" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
