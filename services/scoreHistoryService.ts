
import { ScoreSnapshot } from '../types';

type Listener = () => void;

interface ScoreHistoryState {
    history: ScoreSnapshot[];
    loading: boolean;
    error: string | null;
}

interface ScoreHistoryService {
    getState: () => ScoreHistoryState;
    getHistory: () => ScoreSnapshot[];
    reloadHistory: () => Promise<void>;
    subscribe: (listener: Listener) => () => void;
}

const API_URL = '/api/score-history'; // Placeholder for the score history API endpoint

const createScoreHistoryService = (): ScoreHistoryService => {
    let state: ScoreHistoryState = {
        history: [],
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

    const reloadHistory = async () => {
        state.loading = true;
        state.error = null;
        notify();

        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch score history.');
            const history: ScoreSnapshot[] = await response.json();
            state.history = history;
        } catch (e: any) {
            state.error = e.message;
        } finally {
            state.loading = false;
            notify();
        }
    };
    
    // Initial Load
    reloadHistory();

    return {
        subscribe,
        reloadHistory,
        getState: () => state,
        getHistory: () => [...state.history],
    };
};

export const scoreHistoryService = createScoreHistoryService();
