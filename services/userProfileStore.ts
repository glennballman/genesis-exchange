
import { UserProfile, CompletedModule } from '../types';

interface UserProfileStore {
    getProfile: () => Promise<UserProfile>;
    addCompletedModule: (module: Omit<CompletedModule, 'completedAt'>) => Promise<void>;
    isModuleCompleted: (moduleId: string) => Promise<boolean>;
}

const createUserProfileStore = (): UserProfileStore => {
    let profile: UserProfile | null = null;

    const fetchProfile = async (): Promise<UserProfile> => {
        if (profile) {
            return profile;
        }
        try {
            const response = await fetch('/api/user-profile');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            profile = await response.json();
            return profile as UserProfile;
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            // Return a default profile or handle the error as needed
            return {
                gumpPoints: 0,
                completedModules: [],
            };
        }
    };

    return {
        getProfile: fetchProfile,
        addCompletedModule: async (moduleData) => {
            const currentProfile = await fetchProfile();
            if (!currentProfile.completedModules.some(m => m.moduleId === moduleData.moduleId)) {
                const newModule: CompletedModule = {
                    ...moduleData,
                    completedAt: new Date().toISOString(),
                };
                currentProfile.completedModules.push(newModule);
                currentProfile.gumpPoints += newModule.pointsAwarded;
                // Here you might want to send the updated profile to the server
            }
        },
        isModuleCompleted: async (moduleId) => {
            const currentProfile = await fetchProfile();
            return currentProfile.completedModules.some(m => m.moduleId === moduleId);
        }
    };
};

export const userProfileStore = createUserProfileStore();
