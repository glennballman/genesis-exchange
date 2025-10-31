
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Sidebar from './Sidebar';
import {
  getCurrentProvider,
  getProviderEnvKey,
  getProviderLabel,
  providerHasKey,
  subscribeToProvider,
  type AIProvider
} from '../../services/aiProvider';

const AppLayout: React.FC = () => {
  const [provider, setProvider] = useState<AIProvider>(() => getCurrentProvider());
  const [hasKey, setHasKey] = useState(() => providerHasKey(getCurrentProvider()));

  useEffect(() => {
    const unsubscribe = subscribeToProvider((nextProvider) => {
      setProvider(nextProvider);
      setHasKey(providerHasKey(nextProvider));
    });
    return unsubscribe;
  }, []);

  const envKey = getProviderEnvKey(provider);
  const providerLabel = getProviderLabel(provider);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {!hasKey && (
          <div className="bg-amber-500/10 border-b border-amber-400/30 text-amber-300 px-4 sm:px-6 lg:px-8 py-2 text-sm">
            <span className="font-semibold">AI unavailable:</span> {providerLabel} features require <code className="px-1 rounded bg-amber-400/10 border border-amber-400/30">{envKey}</code> in your
            <code className="ml-1 px-1 rounded bg-amber-400/10 border border-amber-400/30">.env</code>. Core dashboards still work.
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
