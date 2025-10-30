export type AIProvider = 'gemini' | 'openai' | 'anthropic';

function normalizeProvider(value: string | undefined | null): AIProvider {
  const v = (value || '').toLowerCase();
  if (v === 'openai' || v === 'anthropic') return v;
  return 'gemini';
}

export function getDefaultProvider(): AIProvider {
  // Vite exposes env at build-time
  const envProvider = (import.meta as any)?.env?.VITE_AI_PROVIDER as string | undefined;
  return normalizeProvider(envProvider);
}

export function getSelectedProvider(): AIProvider {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('aiProvider');
      return normalizeProvider(saved) || getDefaultProvider();
    }
  } catch {
    // ignore storage errors
  }
  return getDefaultProvider();
}

export function setSelectedProvider(provider: AIProvider): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('aiProvider', provider);
      window.dispatchEvent(new CustomEvent('ai-provider-changed', { detail: { provider } }));
    }
  } catch {
    // ignore storage errors
  }
}
