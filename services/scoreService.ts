import { teamStore } from './teamStore';
import { scoreDataStore } from './scoreDataStore';

export const calculateTotalCompanyScore = (): number => {
    const team = teamStore.getTeam();
    const totalGumpScore = team.reduce((sum, member) => sum + member.earnedGumpScore + (member.estimatedGumpScore || 0), 0);
    
    const scoreComponents = scoreDataStore.getScoreComponents();

    const baseScore = scoreComponents
        .filter(item => item.category !== 'GUMP')
        .reduce((sum, item) => sum + item.points, 0);
        
    return baseScore + totalGumpScore;
};
