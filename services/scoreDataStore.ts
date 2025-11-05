
import { ScoreComponent } from '../types';

type Listener = () => void;

interface ScoreDataStoreState {
    components: ScoreComponent[];
    loading: boolean;
    error: string | null;
}

interface ScoreDataStore {
    getState: () => ScoreDataStoreState;
    getScoreComponents: () => ScoreComponent[];
    addVerificationBonus: (documentName: string, points: number) => Promise<void>;
    addTeamMemberVerificationBonus: (memberName: string, points: number) => Promise<void>;
    addIpAnalysisBonus: (documentName: string, analysisScore: number) => Promise<void>;
    reloadScoreComponents: () => Promise<void>;
    subscribe: (listener: Listener) => () => void;
}

const API_URL = '/api/score-components'; // Placeholder for the score components API endpoint

const createScoreDataStore = (): ScoreDataStore => {
    let state: ScoreDataStoreState = {
        components: [],
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

    const reloadScoreComponents = async () => {
        state.loading = true;
        state.error = null;
        notify();

        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch score components.');
            const components: ScoreComponent[] = await response.json();
            state.components = components;
        } catch (e: any) {
            state.error = e.message;
        } finally {
            state.loading = false;
            notify();
        }
    };
    
    // Initial Load
    reloadScoreComponents();

    return {
        subscribe,
        reloadScoreComponents,
        getState: () => state,
        getScoreComponents: () => [...state.components],
        addVerificationBonus: async (documentName, points) => {
            try {
                const response = await fetch(`${API_URL}/verification-bonus`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ documentName, points }),
                });
                if (!response.ok) throw new Error('Failed to add verification bonus.');
                await reloadScoreComponents(); // Refresh the score components
            } catch (e) {
                console.error("Failed to add verification bonus:", e);
            }
        },
        addTeamMemberVerificationBonus: async (memberName, points) => {
            try {
                const response = await fetch(`${API_URL}/team-verification-bonus`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ memberName, points }),
                });
                if (!response.ok) throw new Error('Failed to add team member verification bonus.');
                await reloadScoreComponents(); // Refresh the score components
            } catch (e) {
                console.error("Failed to add team member verification bonus:", e);
            }
        },
        addIpAnalysisBonus: async (documentName, analysisScore) => {
            try {
                const response = await fetch(`${API_URL}/ip-analysis-bonus`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ documentName, analysisScore }),
                });
                if (!response.ok) throw new Error('Failed to add IP analysis bonus.');
                await reloadScoreComponents(); // Refresh the score components
            } catch (e) {
                console.error("Failed to add IP analysis bonus:", e);
            }
        }
    };
};

export const scoreDataStore = createScoreDataStore();
