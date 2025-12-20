// aura-project/src/pages/LandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
      <h1 className="text-6xl font-extrabold text-teal-400 mb-4">A.U.R.A.</h1>
      <p className="text-2xl mb-8 text-gray-300">Cloud-Based Smart Home Executive AI Agent</p>
      <p className="text-lg text-center max-w-2xl mb-12">
        A.U.R.A. orchestrates your entire smart home through natural language, context awareness, and intelligent multi-agent planning.
      </p>
      <Link
        to="/dashboard"
        className="px-8 py-4 bg-teal-500 text-white text-xl font-semibold rounded-full shadow-lg hover:bg-teal-600 transition-colors duration-300 transform hover:scale-105"
      >
        Launch Dashboard
      </Link>
      <div className="mt-12 text-gray-500 text-sm">
        <p>Frontend Mockup powered by Lovable & Supabase (Mock Data)</p>
      </div>
    </div>
  );
};
