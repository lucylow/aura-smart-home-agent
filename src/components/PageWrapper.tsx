import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navigation } from './Navigation';

interface PageWrapperProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, title, description }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-28 pb-16 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground font-mono">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="font-semibold text-foreground">{title}</span>
          </nav>
          
          {/* Page Header */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black gradient-text">{title}</h1>
            {description && (
              <p className="text-lg text-muted-foreground max-w-3xl">{description}</p>
            )}
          </div>
          
          {/* Page Content */}
          <div className="pt-8">
            {children}
          </div>
        </motion.div>
      </main>
    </div>
  );
};
