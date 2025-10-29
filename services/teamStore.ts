import { User, TeamChemistry, ProfessionalAchievement } from '../types';
import { users } from '../data/genesisData';
import { scoreDataStore } from './scoreDataStore';
import { igsService } from './igsService';

interface TeamStore {
    addUser: (user: User) => void;
    updateUser: (userId: string, updates: Partial<User>) => void;
    removeUser: (userId: string) => void;
    getTeam: () => User[];
    getTeamChemistry: () => TeamChemistry;
    verifyUser: (userId: string, url: string) => void;
}

const createTeamStore = (): TeamStore => {
    const team: User[] = [...users];

    return {
        addUser: (user) => {
            if (!team.some(member => member.id === user.id)) {
                // Recalculate IGS when adding
                const userWithIgs = { ...user, igs: igsService.calculateIgs(user.achievements) };
                team.push(userWithIgs);
            }
        },
        updateUser: (userId, updates) => {
            const index = team.findIndex(member => member.id === userId);
            if (index > -1) {
                const updatedUser = { ...team[index], ...updates };
                // Always recalculate IGS on update
                updatedUser.igs = igsService.calculateIgs(updatedUser.achievements);
                team[index] = updatedUser;
            }
        },
        removeUser: (userId) => {
            const index = team.findIndex(member => member.id === userId);
            if (index > -1) {
                team.splice(index, 1);
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
            }
        }
    };
};

export const teamStore = createTeamStore();
