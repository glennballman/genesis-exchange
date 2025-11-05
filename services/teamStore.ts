
import { User, TeamChemistry } from '../types';
import { users } from '../data/genesisData';
import { scoreDataStore } from './scoreDataStore';
import { igsService } from './igsService';

type Listener = () => void;

interface TeamStore {
    addUser: (user: User) => void;
    updateUser: (userId: string, updates: Partial<User>) => void;
    removeUser: (userId: string) => void;
    getTeam: () => User[];
    getTeamChemistry: () => TeamChemistry;
    verifyUser: (userId: string, url: string) => void;
    subscribe: (listener: Listener) => () => void;
}

const createTeamStore = (): TeamStore => {
    let team: User[] = [...users.map(u => ({ ...u, igs: igsService.calculateIgs(u.achievements) }))];
    let listeners: Listener[] = [];

    const notify = () => {
        listeners.forEach(listener => listener());
    };

    const subscribe = (listener: Listener) => {
        listeners.push(listener);
        // Return an unsubscribe function
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    };

    return {
        addUser: (user) => {
            if (!team.some(member => member.id === user.id)) {
                const userWithIgs = { ...user, igs: igsService.calculateIgs(user.achievements) };
                team.push(userWithIgs);
                notify();
            }
        },
        updateUser: (userId, updates) => {
            const index = team.findIndex(member => member.id === userId);
            if (index > -1) {
                const updatedUser = { ...team[index], ...updates };
                updatedUser.igs = igsService.calculateIgs(updatedUser.achievements);
                team[index] = updatedUser;
                notify();
            }
        },
        removeUser: (userId) => {
            const index = team.findIndex(member => member.id === userId);
            if (index > -1) {
                team.splice(index, 1);
                notify();
            }
        },
        getTeam: () => {
            return [...team];
        },
        getTeamChemistry: () => {
            return igsService.calculateTeamChemistry(team);
        },
        verifyUser: (userId, url) => {
            const index = team.findIndex(member => member.id === userId);
            if (index > -1) {
                const user = team[index];
                let source = 'Online Profile';
                if (url.includes('linkedin.com')) {
                    source = 'LinkedIn';
                } else if (url.includes('github.com')) {
                    source = 'GitHub';
                }

                user.verification = {
                    source,
                    url,
                    verifiedAt: new Date().toISOString(),
                };
                team[index] = user;

                const verificationBonus = 2500;
                scoreDataStore.addTeamMemberVerificationBonus(user.name, verificationBonus);
                notify();
            }
        },
        subscribe,
    };
};

export const teamStore = createTeamStore();
