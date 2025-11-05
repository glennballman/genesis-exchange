
import { User, TeamChemistry, Goal } from '../types';
import { scoreDataStore } from './scoreDataStore';
import { igsService } from './igsService';

type Listener = () => void;

interface TeamStoreState {
    team: User[];
    loading: boolean;
    error: string | null;
}

interface TeamStore {
    getState: () => TeamStoreState;
    getTeam: () => User[];
    getTeamChemistry: () => TeamChemistry;
    addUser: (user: Omit<User, 'id' | 'igs'>) => Promise<void>;
    updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
    removeUser: (userId: string) => Promise<void>;
    verifyUser: (userId: string, url: string) => Promise<void>;
    reloadTeam: () => Promise<void>;
    subscribe: (listener: Listener) => () => void;
}

const API_URL = '/api/team'; // Placeholder for the team API endpoint

const createTeamStore = (): TeamStore => {
    let state: TeamStoreState = {
        team: [],
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

    const reloadTeam = async () => {
        state.loading = true;
        state.error = null;
        notify();

        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch team data.');
            const users: User[] = await response.json();
            // The backend should not return the IGS. The frontend calculates it.
            state.team = users.map(u => ({ ...u, igs: igsService.calculateIgs(u) }));
        } catch (e: any) {
            state.error = e.message;
        } finally {
            state.loading = false;
            notify();
        }
    };
    
    // Initial Load
    reloadTeam();

    return {
        subscribe,
        reloadTeam,
        getState: () => state,
        getTeam: () => [...state.team],
        getTeamChemistry: () => {
            return igsService.calculateTeamChemistry(state.team);
        },
        addUser: async (userData) => {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                });
                if (!response.ok) throw new Error('Failed to add user.');
                await reloadTeam(); // Refresh the team list
            } catch (e) {
                console.error("Failed to add user:", e);
                // Optionally handle the error in the UI
            }
        },
        updateUser: async (userId, updates) => {
            try {
                const response = await fetch(`${API_URL}/${userId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates),
                });
                if (!response.ok) throw new Error('Failed to update user.');
                await reloadTeam(); // Refresh the team list
            } catch (e) {
                console.error("Failed to update user:", e);
            }
        },
        removeUser: async (userId) => {
            try {
                const response = await fetch(`${API_URL}/${userId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to remove user.');
                await reloadTeam(); // Refresh the team list
            } catch (e) {
                console.error("Failed to remove user:", e);
            }
        },
        verifyUser: async (userId, url) => {
            try {
                const response = await fetch(`${API_URL}/${userId}/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url }),
                });
                if (!response.ok) throw new Error('Failed to verify user.');
                const { bonus } = await response.json(); 
                
                // Reload team to get verification status
                await reloadTeam();

                // Add bonus points via scoreDataStore
                const user = state.team.find(u => u.id === userId);
                if (user) {
                    scoreDataStore.addTeamMemberVerificationBonus(user.name, bonus);
                }

            } catch (e) {
                console.error("Failed to verify user:", e);
            }
        },
    };
};

export const teamStore = createTeamStore();
