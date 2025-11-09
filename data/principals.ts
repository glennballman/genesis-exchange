import { Principal, User } from '../types';
import { users } from './users';

export const companyPrincipal: Principal = {
    id: 'company-genesis',
    type: 'COMPANY',
    name: 'Genesis Exchange',
    missionStatement: 'To make humanity a multi-planetary species by funding deep-tech ventures.',
    values: ['Innovation', 'Rigor', 'Ambition', 'Integrity'],
    exclusions: [],
    teamMembers: users,
};

export const vcFundPrincipals: Principal[] = [
    {
        id: 'vc-a16z',
        type: 'VC_FUND',
        name: 'Andreessen Horowitz',
        missionStatement: 'We believe in a future where technology is built by and for everyone.',
        values: ['Founder-Friendly', 'Long-Term Vision', 'Technical Excellence'],
        exclusions: ['Gambling', 'Tobacco'],
        childPrincipals: [
            { id: 'vc-a16z-infra', type: 'VC_FUND', name: 'Infrastructure Fund', missionStatement: 'To invest in foundational technologies that will underpin the next generation of the internet and enterprise software.', values: [], exclusions: [] },
            { id: 'vc-a16z-bio', type: 'VC_FUND', name: 'Bio+Health Fund', missionStatement: 'To invest in companies at the intersection of biology and engineering.', values: [], exclusions: [] },
        ]
    },
    {
        id: 'vc-sequoia',
        type: 'VC_FUND',
        name: 'Sequoia Capital',
        missionStatement: 'We help the daring build legendary companies from idea to IPO and beyond.',
        values: ['Endurance', 'Market Leadership', 'Boldness'],
        exclusions: [],
        childPrincipals: [
             { id: 'vc-sequoia-growth', type: 'VC_FUND', name: 'Growth Fund', missionStatement: 'To partner with companies with massive market potential and proven traction.', values: [], exclusions: [] },
             { id: 'vc-sequoia-seed', type: 'VC_FUND', name: 'Seed Fund', missionStatement: 'To be the first believers in the next generation of iconic companies.', values: [], exclusions: [] },
        ]
    },
    {
        id: 'vc-lux',
        type: 'VC_FUND',
        name: 'Lux Capital',
        missionStatement: 'To back contrarian thinkers and scientists solving the world\'s most pressing problems at the edge of what\'s possible.',
        values: ['Rebellion', 'Scientific Breakthrough', 'Patience'],
        exclusions: ['Social Media', 'Ad-Tech'],
        childPrincipals: []
    },
    {
        id: 'vc-social',
        type: 'VC_FUND',
        name: 'Social Capital',
        missionStatement: 'To advance humanity by solving the world\'s hardest problems through technology, focusing on climate, health, and education.',
        values: ['Impact', 'Data-Driven', 'First Principles'],
        exclusions: ['Fossil Fuels', 'Weapons Manufacturing'],
        childPrincipals: []
    },
];
