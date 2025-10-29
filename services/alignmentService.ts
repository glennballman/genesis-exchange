import { Goal, TeamAlignmentReport, User, Mission, IndividualAlignmentReport, Principal, LiveAlignmentReport } from '../types';
import { generateTeamAlignmentReport, generateIndividualAlignmentReport, generateAlignmentNarrative } from './geminiService';
import { discoveryService } from './discoveryService';

const calculateAmbitionIndex = (goals: Goal[]): number => {
    if (!goals || goals.length === 0) return 0;
    let score = 0;
    score += Math.min(goals.length * 10, 40);
    const timelines = new Set(goals.map(g => g.targetDate));
    if (timelines.size > 1) score += 20;
    if (timelines.size > 2) score += 10;
    const categories = new Set(goals.map(g => g.category));
    if (categories.size > 1) score += 20;
    if (categories.size > 2) score += 10;
    return Math.min(score, 100);
};

const calculateTransparencyIndex = (goals: Goal[]): number => {
    if (!goals || goals.length === 0) return 0;
    const sharedCount = goals.filter(g => g.sharingLevel !== 'Private').length;
    return Math.round((sharedCount / goals.length) * 100);
};

const getTeamAlignmentReport = async (mission: Mission, team: User[]): Promise<TeamAlignmentReport> => {
    const individualReports: IndividualAlignmentReport[] = await Promise.all(
        team.map(user => getIndividualAlignmentReport(user, mission.statement))
    );

    const teamAlignmentScore = Math.round(individualReports.reduce((sum, r) => sum + r.missionAlignmentScore, 0) / individualReports.length);
    const teamAmbitionIndex = Math.round(individualReports.reduce((sum, r) => sum + r.ambitionIndex, 0) / individualReports.length);
    const teamTransparencyIndex = Math.round(individualReports.reduce((sum, r) => sum + r.transparencyIndex, 0) / individualReports.length);

    const aiSummary = await generateTeamAlignmentReport(mission, team);

    return {
        ...aiSummary,
        teamAlignmentScore,
        teamAmbitionIndex,
        teamTransparencyIndex,
        individualReports,
    };
};

const getIndividualAlignmentReport = async (user: User, companyMission: string): Promise<IndividualAlignmentReport> => {
    const ambitionIndex = calculateAmbitionIndex(user.goals || []);
    const transparencyIndex = calculateTransparencyIndex(user.goals || []);
    
    const aiReport = await generateIndividualAlignmentReport(user, companyMission);

    return {
        ...aiReport,
        ambitionIndex,
        transparencyIndex,
    };
};

const getLiveAlignmentReport = async (source: Principal, target: Principal): Promise<LiveAlignmentReport> => {
    // This re-uses the logic from discoveryService for consistency
    const { financialScore, conflict } = discoveryService.calculateAlignmentScores(source, target);
    const narrative = await generateAlignmentNarrative(source, target, conflict);

    return {
        alignmentScore: financialScore, // Using financial score as the primary metric here
        narrative: narrative,
    };
};


export const alignmentService = {
    calculateAmbitionIndex,
    calculateTransparencyIndex,
    getTeamAlignmentReport,
    getIndividualAlignmentReport,
    getLiveAlignmentReport,
};
