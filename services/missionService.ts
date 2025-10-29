import { Mission, TeamAlignmentReport, User, Principal } from '../types';
import { generateTeamAlignmentReport } from './geminiService';
import { companyPrincipal } from '../data/principals';

const companyMission: Principal = companyPrincipal;

const projectMissions: Principal[] = [
    {
        id: 'mission-propulsion',
        type: 'PROJECT',
        name: 'Raptor Engine Program',
        missionStatement: 'Develop a fully reusable, methane-powered rocket engine capable of Mars landing.',
        parentPrincipalId: 'company-genesis',
        values: ['Innovation', 'Speed', 'First Principles'],
        exclusions: [],
    },
    {
        id: 'mission-lifesupport',
        type: 'PROJECT',
        name: 'Project Eden',
        missionStatement: 'Create a self-sustaining habitat with closed-loop life support for long-duration space missions.',
        parentPrincipalId: 'company-genesis',
        values: ['Sustainability', 'Rigor', 'Safety'],
        exclusions: [],
    },
    {
        id: 'mission-funding',
        type: 'PROJECT',
        name: 'Series A Fundraising',
        missionStatement: 'Secure $20M in funding to scale operations and begin prototype manufacturing.',
        parentPrincipalId: 'company-genesis',
        values: ['Capital Efficiency', 'Growth'],
        exclusions: [],
    },
];

interface MissionService {
    getCompanyMission: () => Principal;
    getProjectMissions: () => Principal[];
    generateTeamAlignmentReport: (mission: Principal, team: User[]) => Promise<TeamAlignmentReport>;
}

const createMissionService = (): MissionService => {
    return {
        getCompanyMission: () => companyMission,
        getProjectMissions: () => projectMissions,
        generateTeamAlignmentReport: async (mission, team) => {
            // In a real app, you might filter the team or pass more context
            return await generateTeamAlignmentReport(mission, team);
        }
    };
};

export const missionService = createMissionService();
