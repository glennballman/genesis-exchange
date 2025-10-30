
import React, { useEffect, useState } from 'react';
import { getSelectedProvider, setSelectedProvider } from '../services/aiProvider';

const Header: React.FC = () => {
  const [provider, setProvider] = useState(getSelectedProvider());

  useEffect(() => {
    const handler = (e: Event) => {
      // keep in sync if changed elsewhere
      setProvider(getSelectedProvider());
    };
    window.addEventListener('ai-provider-changed', handler);
    return () => window.removeEventListener('ai-provider-changed', handler);
  }, []);
  const geminiKey = import.meta.env.VITE_API_KEY as string | undefined;
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;

  const isActive =
    (provider === 'gemini' && !!geminiKey) ||
    (provider === 'openai' && !!openaiKey) ||
    (provider === 'anthropic' && !!anthropicKey);

  const providerLabel = provider === 'openai' ? 'OpenAI' : provider === 'anthropic' ? 'Anthropic' : 'Gemini';
  const statusText = `${providerLabel}: ${isActive ? 'Active' : 'Off'}`;
  const statusClasses = isActive
    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    : 'bg-amber-500/10 text-amber-300 border-amber-400/30';

  return (
    <header className="h-20 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div>
            {/* Breadcrumbs or page title could go here */}
        </div>
        <div className="flex items-center space-x-3">
          {/* Action buttons like notifications or search could go here */}
          <span
            title={
              isActive
                ? 'Gemini API key detected from .env'
                : 'No Gemini API key detected. Set VITE_API_KEY in .env to enable AI.'
            }
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${statusClasses}`}
          >
            <span
              className={`mr-2 inline-block h-2 w-2 rounded-full ${
                isActive ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            {statusText}
          </span>
          <select
            aria-label="AI Provider"
            className="bg-gray-800/80 text-gray-200 text-xs rounded-md border border-gray-700 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            value={provider}
            onChange={(e) => {
              const next = e.target.value as 'gemini' | 'openai' | 'anthropic';
              setSelectedProvider(next);
              setProvider(next);
            }}
          >
            <option value="gemini">Gemini</option>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
          </select>
        </div>
    </header>
  );
};

export default Header;
