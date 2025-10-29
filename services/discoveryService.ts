import { Principal, PrincipalType, AlignmentMatch } from '../types';
import { companyPrincipal, vcFundPrincipals } from '../data/principals';
import { generateAlignmentNarrative } from './geminiService';

export const calculateAlignmentScores = (source: Principal, target: Principal): { financialScore: number, advisoryScore: number, conflict: boolean } => {
    if (checkForExclusion(source, target) || checkForExclusion(target, source)) {
        return { financialScore: 0, advisoryScore: 0, conflict: true };
    }

    let baseScore = 20;
    const sourceValues = new Set(source.values);
    target.values.forEach(value => {
        if (sourceValues.has(value)) baseScore += 15;
    });

    const sourceWords = new Set(source.missionStatement.toLowerCase().split(' '));
    const targetWords = new Set(target.missionStatement.toLowerCase().split(' '));
    sourceWords.forEach(word => {
        if (targetWords.has(word)) baseScore += 2;
    });

    let financialScore = baseScore;
    let advisoryScore = baseScore;

    const targetTeamInterests = target.teamMembers?.flatMap(m => m.interests || []) || [];
    
    targetTeamInterests.forEach(interest => {
        if (source.missionStatement.toLowerCase().includes(interest.description.toLowerCase())) {
            if (interest.investmentTypes.includes('Money')) {
                financialScore += 20;
            }
            if (interest.investmentTypes.includes('Time') || interest.investmentTypes.includes('Energy')) {
                advisoryScore += 20;
            }
        }
    });

    return { 
        financialScore: Math.min(financialScore, 99), 
        advisoryScore: Math.min(advisoryScore, 99), 
        conflict: false 
    };
};

const checkForExclusion = (source: Principal, target: Principal): boolean => {
    const targetMission = target.missionStatement.toLowerCase();
    // Defensive check to ensure exclusions array exists
    const exclusions = source.exclusions || [];
    return exclusions.some(exclusion => targetMission.includes(exclusion.toLowerCase()));
};

const findMatches = async (sourcePrincipal: Principal, targetType: PrincipalType): Promise<AlignmentMatch[]> => {
    let targets: Principal[] = [];
    if (targetType === 'VC_FUND') {
        targets = vcFundPrincipals;
    }

    const matches = await Promise.all(
        targets.map(async (target) => {
            const { financialScore, advisoryScore, conflict } = calculateAlignmentScores(sourcePrincipal, target);
            const narrative = await generateAlignmentNarrative(sourcePrincipal, target, conflict);
            return {
                target,
                financialAlignmentScore: financialScore,
                advisoryAlignmentScore: advisoryScore,
                narrative,
                conflict,
            };
        })
    );

    return matches.sort((a, b) => Math.max(b.financialAlignmentScore, b.advisoryAlignmentScore) - Math.max(a.financialAlignmentScore, a.advisoryAlignmentScore));
};

export const discoveryService = {
    findMatches,
    getCurrentCompanyPrincipal: () => companyPrincipal,
    calculateAlignmentScores, // Export for use in other services
};
