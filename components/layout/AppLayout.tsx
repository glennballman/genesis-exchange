
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Sidebar from './Sidebar';

const AppLayout: React.FC = () => {
  const apiKey = import.meta.env.VITE_API_KEY as string | undefined;
  const isAiUnavailable = !apiKey;
  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {isAiUnavailable && (
          <div className="bg-amber-500/10 border-b border-amber-400/30 text-amber-300 px-4 sm:px-6 lg:px-8 py-2 text-sm">
            <span className="font-semibold">AI unavailable:</span> Set <code className="px-1 rounded bg-amber-400/10 border border-amber-400/30">VITE_API_KEY</code> in your <code className="px-1 rounded bg-amber-400/10 border border-amber-400/30">.env</code> to enable Gemini features. Core dashboards still work.
          </div>
        )}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-b from-gray-900 to-slate-900 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
