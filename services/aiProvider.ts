type AIProvider = 'gemini' | 'openai' | 'anthropic';

const STORAGE_KEY = 'genesis_exchange_ai_provider';

const providerLabels: Record<AIProvider, string> = {
  gemini: 'Gemini',
  openai: 'OpenAI',
  anthropic: 'Anthropic'
};

const providerEnvKeys: Record<AIProvider, string> = {
  gemini: 'VITE_API_KEY',
  openai: 'VITE_OPENAI_API_KEY',
  anthropic: 'VITE_ANTHROPIC_API_KEY'
};

const getEnvValue = (key: string | undefined): string | undefined => {
  if (!key) return undefined;
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
};

const getDefaultProvider = (): AIProvider => {
  const envProvider = (import.meta.env.VITE_AI_PROVIDER as AIProvider | undefined)?.toLowerCase();
  return envProvider === 'openai' || envProvider === 'anthropic' ? envProvider : 'gemini';
};

const readStorageProvider = (): AIProvider | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'gemini' || stored === 'openai' || stored === 'anthropic') {
      return stored;
    }
  } catch (error) {
    console.warn('Unable to read AI provider from storage', error);
  }
  return null;
};

let currentProvider: AIProvider = readStorageProvider() ?? getDefaultProvider();
const listeners = new Set<(provider: AIProvider) => void>();

export const getCurrentProvider = (): AIProvider => currentProvider;

export const setCurrentProvider = (provider: AIProvider) => {
  if (currentProvider === provider) return;
  currentProvider = provider;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, provider);
    } catch (error) {
      console.warn('Unable to persist AI provider selection', error);
    }
  }
  listeners.forEach((listener) => listener(currentProvider));
};

export const subscribeToProvider = (listener: (provider: AIProvider) => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getProviderLabel = (provider: AIProvider): string => providerLabels[provider];

export const providerHasKey = (provider: AIProvider): boolean => {
  const envKey = providerEnvKeys[provider];
  return Boolean(getEnvValue(envKey));
};

export const getProviderEnvKey = (provider: AIProvider): string => providerEnvKeys[provider];

export const listProviders = (): AIProvider[] => ['gemini', 'openai', 'anthropic'];

export type { AIProvider };
