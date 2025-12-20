// aura-project/src/components/AppLayout.tsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Home, Zap, Settings, Clock, Mic, Lock, Lightbulb, LayoutDashboard } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Devices', path: '/devices', icon: Lightbulb },
  { name: 'Scenes', path: '/scenes', icon: Zap },
  { name: 'Automations', path: '/automations', icon: Clock },
  { name: 'History', path: '/history', icon: Clock },
  { name: 'Voice Setup', path: '/voice-setup', icon: Mic },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-4 flex flex-col">
        <div className="text-2xl font-bold text-teal-600 mb-8">A.U.R.A.</div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-colors duration-150"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-4 border-t">
          <Link
            to="/"
            className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-150"
          >
            <Home className="w-5 h-5 mr-3" />
            Landing Page
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
