
import { CompletedModule } from '../types';

type Listener = () => void;

interface CompletedModulesState {
    modules: CompletedModule[];
    loading: boolean;
    error: string | null;
}

interface CompletedModulesService {
    getState: () => CompletedModulesState;
    getModules: () => CompletedModule[];
    reloadModules: () => Promise<void>;
    subscribe: (listener: Listener) => () => void;
}

const API_URL = '/api/completed-modules'; // Placeholder for the completed modules API endpoint

const createCompletedModulesService = (): CompletedModulesService => {
    let state: CompletedModulesState = {
        modules: [],
        loading: true,
        error: null,
    };
    let listeners: Listener[] = [];

    const notify = () => {
        listeners.forEach(listener => listener());
    };

    const subscribe = (listener: Listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    };

    const reloadModules = async () => {
        state.loading = true;
        state.error = null;
        notify();

        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch completed modules.');
            const modules: CompletedModule[] = await response.json();
            state.modules = modules;
        } catch (e: any) {
            state.error = e.message;
        } finally {
            state.loading = false;
            notify();
        }
    };
    
    // Initial Load
    reloadModules();

    return {
        subscribe,
        reloadModules,
        getState: () => state,
        getModules: () => [...state.modules],
    };
};

export const completedModulesService = createCompletedModulesService();
