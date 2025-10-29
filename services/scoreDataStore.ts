import { ScoreComponent } from '../types';
import { scoreCalculationData } from '../data/genesisData';

interface ScoreDataStore {
    getScoreComponents: () => ScoreComponent[];
    addVerificationBonus: (documentName: string, points: number) => void;
    addTeamMemberVerificationBonus: (memberName: string, points: number) => void;
    addIpAnalysisBonus: (documentName: string, analysisScore: number) => void;
}

const createScoreDataStore = (): ScoreDataStore => {
    // Initialize with the static data
    const components: ScoreComponent[] = [...scoreCalculationData];

    return {
        getScoreComponents: () => {
            return [...components];
        },
        addVerificationBonus: (documentName, points) => {
            const bonusItemIdentifier = `Verified Document: ${documentName}`;
            // Prevent adding duplicate bonuses
            if (components.some(c => c.item === bonusItemIdentifier)) {
                return;
            }

            const bonusComponent: ScoreComponent = {
                category: 'IP',
                item: bonusItemIdentifier,
                points: points,
                max_points: points,
                details: 'Document authenticity verified against a public database.',
            };
            components.push(bonusComponent);
        },
        addTeamMemberVerificationBonus: (memberName, points) => {
            const bonusItemIdentifier = `Verified Profile: ${memberName}`;
            // Prevent adding duplicate bonuses
            if (components.some(c => c.item === bonusItemIdentifier)) {
                return;
            }

            const bonusComponent: ScoreComponent = {
                category: 'Team',
                item: bonusItemIdentifier,
                points: points,
                max_points: points,
                details: 'Team member profile verified via a public professional network.',
            };
            components.push(bonusComponent);
        },
        addIpAnalysisBonus: (documentName, analysisScore) => {
            const bonusItemIdentifier = `IP Analysis: ${documentName}`;
            if (components.some(c => c.item === bonusItemIdentifier)) {
                // Update existing score if re-analyzed
                const index = components.findIndex(c => c.item === bonusItemIdentifier);
                components[index].points = analysisScore;
                components[index].details = `AI-powered strength analysis score (${analysisScore}/1000).`;
                return;
            }
            
            const bonusComponent: ScoreComponent = {
                category: 'IP',
                item: bonusItemIdentifier,
                points: analysisScore,
                max_points: 1000,
                details: `AI-powered strength analysis score (${analysisScore}/1000).`,
            };
            components.push(bonusComponent);
        }
    };
};

export const scoreDataStore = createScoreDataStore();
