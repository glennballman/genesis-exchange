
import React, { useEffect, useState } from 'react';
import {
  getCurrentProvider,
  getProviderEnvKey,
  getProviderLabel,
  listProviders,
  providerHasKey,
  setCurrentProvider,
  subscribeToProvider,
  type AIProvider
} from '../services/aiProvider';

const providerOptions = listProviders();

const Header: React.FC = () => {
  const [provider, setProvider] = useState<AIProvider>(() => getCurrentProvider());

  useEffect(() => {
    return subscribeToProvider((nextProvider) => setProvider(nextProvider));
  }, []);

  const handleProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextProvider = event.target.value as AIProvider;
    setCurrentProvider(nextProvider);
  };

  const providerLabel = getProviderLabel(provider);
  const hasKey = providerHasKey(provider);
  const envKey = getProviderEnvKey(provider);

  return (
    <header className="h-20 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span className="uppercase tracking-[0.2em] text-emerald-400">Genesis Exchange</span>
        <span className="text-gray-600">/</span>
        <span className="text-gray-300">Command Center</span>
      </div>

      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${hasKey ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-amber-400/40 bg-amber-400/10 text-amber-200'}`}>
          <span>{providerLabel}</span>
          <span className="opacity-75">{hasKey ? 'Active' : 'Off'}</span>
        </div>

        <label className="inline-flex items-center gap-2 text-xs text-gray-400">
          Provider
          <select
            value={provider}
            onChange={handleProviderChange}
            className="bg-gray-900/70 border border-gray-700 rounded-md px-2 py-1 text-gray-200 focus:outline-none focus:border-emerald-400"
          >
            {providerOptions.map((option) => (
              <option key={option} value={option}>
                {getProviderLabel(option)}
              </option>
            ))}
          </select>
        </label>

        {!hasKey && (
          <span className="text-xs text-amber-300">
            Set {envKey} in your <code className="px-1 rounded bg-amber-400/10 border border-amber-400/30">.env</code>
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
