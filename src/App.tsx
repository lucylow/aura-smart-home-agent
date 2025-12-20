// aura-project/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DeviceControlPage } from './pages/DeviceControlPage';
import { ScenesPage } from './pages/ScenesPage';
import { AutomationsPage } from './pages/AutomationsPage';
import { ExecutionHistoryPage } from './pages/ExecutionHistoryPage';
import { VoiceSetupPage } from './pages/VoiceSetupPage';
import { SettingsPage } from './pages/SettingsPage';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            {/* Landing Page Route */}
            <Route path="/" element={<LandingPage />} />

            {/* Application Routes with Layout */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/devices" element={<DeviceControlPage />} />
              <Route path="/scenes" element={<ScenesPage />} />
              <Route path="/automations" element={<AutomationsPage />} />
              <Route path="/history" element={<ExecutionHistoryPage />} />
              <Route path="/voice-setup" element={<VoiceSetupPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
