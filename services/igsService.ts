import { ProfessionalAchievement, IndividualGumpScore, User, TeamChemistry, Goal } from '../types';

const MAX_SCORES = {
    PROVEN_EXECUTION: 500,
    EXITS: 200,
    SCALING: 150,
    CAPITAL_GOVERNANCE: 150,
    
    PILLARS_OF_POTENTIAL: 500,
    DISCIPLINE_GRIT: 175,
    INTELLECTUAL_HORSEPOWER: 175,
    AMBITION: 100,
    LEADERSHIP_EMPATHY: 50, // Reduced as it's harder to quantify directly
};

const calculateAmbitionScore = (goals: Goal[]): number => {
    if (!goals || goals.length === 0) return 0;

    let score = 0;
    // Presence of Goals
    score += 40;

    const timelines = new Set(goals.map(g => g.targetDate));
    // Timeline Specificity
    if (timelines.size > 1) score += 20;
    if (timelines.size > 2) score += 10;

    const categories = new Set(goals.map(g => g.category));
    // Domain Diversity
    if (categories.size > 1) score += 20;
    if (categories.size > 2) score += 10;

    return Math.min(score, MAX_SCORES.AMBITION);
};

const calculateIgs = (user: User): IndividualGumpScore => {
    const score: IndividualGumpScore = {
        total: 0,
        provenExecution: { total: 0, exits: 0, scaling: 0, capitalGovernance: 0 },
        pillarsOfPotential: { total: 0, disciplineGrit: 0, intellectualHorsepower: 0, ambition: 0 },
    };

    // Pillar B: Pillars of Potential
    score.pillarsOfPotential.ambition = calculateAmbitionScore(user.goals || []);

    const achievements = user.achievements || [];
    achievements.forEach(ach => {
        switch (ach.type) {
            case 'Work/Professional':
                if (ach.toState && (ach.toState.toLowerCase().includes('ipo') || ach.toState.toLowerCase().includes('acquisition'))) {
                    score.provenExecution.exits += 100;
                }
                if (ach.role && (ach.role.toLowerCase().includes('ceo') || ach.role.toLowerCase().includes('founder'))) {
                    score.provenExecution.capitalGovernance += 25;
                }
                break;
            case 'Athletic':
            case 'Artistic':
                score.pillarsOfPotential.disciplineGrit += 50; // Base points for any such achievement
                break;
            case 'Academic/Intellectual':
                if (ach.isDesignation) {
                    score.pillarsOfPotential.intellectualHorsepower += 50;
                } else {
                    score.pillarsOfPotential.intellectualHorsepower += 25;
                }
                if (ach.rewards && ach.rewards.some(r => r.name.toLowerCase().includes('patent'))) {
                    score.pillarsOfPotential.intellectualHorsepower += ach.rewards.length * 25;
                }
                break;
            case 'Community/Humanity/Charitable':
                 // This is more for narrative, but we can give some points
                 score.pillarsOfPotential.disciplineGrit += 10;
                 break;
        }
    });

    // Cap scores
    score.provenExecution.exits = Math.min(score.provenExecution.exits, MAX_SCORES.EXITS);
    score.provenExecution.scaling = Math.min(score.provenExecution.scaling, MAX_SCORES.SCALING);
    score.provenExecution.capitalGovernance = Math.min(score.provenExecution.capitalGovernance, MAX_SCORES.CAPITAL_GOVERNANCE);
    
    score.pillarsOfPotential.disciplineGrit = Math.min(score.pillarsOfPotential.disciplineGrit, MAX_SCORES.DISCIPLINE_GRIT);
    score.pillarsOfPotential.intellectualHorsepower = Math.min(score.pillarsOfPotential.intellectualHorsepower, MAX_SCORES.INTELLECTUAL_HORSEPOWER);

    // Calculate totals
    score.provenExecution.total = score.provenExecution.exits + score.provenExecution.scaling + score.provenExecution.capitalGovernance;
    score.pillarsOfPotential.total = score.pillarsOfPotential.disciplineGrit + score.pillarsOfPotential.intellectualHorsepower + score.pillarsOfPotential.ambition;

    score.total = score.provenExecution.total + score.pillarsOfPotential.total;

    return score;
};

const calculateTeamChemistry = (team: User[]): TeamChemistry => {
    const chemistry: TeamChemistry = { multiplier: 1.0, factors: [] };
    const roles = new Set(team.map(m => m.role));

    if (roles.has('Founder') && (roles.has('Management') || team.some(m => m.title.includes('CTO') || m.title.includes('CFO')))) {
        chemistry.multiplier += 0.10;
        chemistry.factors.push({ description: "Strong role diversity", boost: "+10%" });
    }

    const pastCompanies = new Map<string, string[]>();
    team.forEach(member => {
        const achievements = member.achievements || []; // FIX: Ensure achievements is an array
        achievements.forEach(ach => {
            if (ach.type === 'Work/Professional' && ach.toState && (ach.toState.toLowerCase().includes('ipo') || ach.toState.toLowerCase().includes('acquisition'))) {
                const members = pastCompanies.get(ach.organizationName) || [];
                if (!members.includes(member.name)) members.push(member.name);
                pastCompanies.set(ach.organizationName, members);
            }
        });
    });

    pastCompanies.forEach((members, company) => {
        if (members.length > 1) {
            chemistry.multiplier += 0.15;
            chemistry.factors.push({ description: `Shared exit at ${company}`, boost: "+15%" });
        }
    });
    
    chemistry.multiplier = Math.min(chemistry.multiplier, 1.5);

    return chemistry;
};

export const igsService = {
    calculateIgs,
    calculateTeamChemistry,
};
