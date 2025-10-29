
import { UserProfile, CompletedModule } from '../types';

interface UserProfileStore {
    getProfile: () => UserProfile;
    addCompletedModule: (module: Omit<CompletedModule, 'completedAt'>) => void;
    isModuleCompleted: (moduleId: string) => boolean;
}

const createUserProfileStore = (): UserProfileStore => {
    const profile: UserProfile = {
        gumpPoints: 35000, // Starting points from genesisData
        completedModules: [],
    };

    return {
        getProfile: () => {
            return { ...profile };
        },
        addCompletedModule: (moduleData) => {
            if (!profile.completedModules.some(m => m.moduleId === moduleData.moduleId)) {
                const newModule: CompletedModule = {
                    ...moduleData,
                    completedAt: new Date().toISOString(),
                };
                profile.completedModules.push(newModule);
                profile.gumpPoints += newModule.pointsAwarded;
            }
        },
        isModuleCompleted: (moduleId) => {
            return profile.completedModules.some(m => m.moduleId === moduleId);
        }
    };
};

export const userProfileStore = createUserProfileStore();
