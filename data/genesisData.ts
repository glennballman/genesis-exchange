import { GenesisScoreData, TechStackItem, RoadmapItem, FinancialMetric, MarketMetric, DiligenceRequest, ScoreComponent, User, Investor, ProfessionalAchievement } from '../types';
import { igsService } from '../services/igsService';

// --- Achievements Data ---
const tonyAchievements: ProfessionalAchievement[] = [
    { 
        id: 'ach-tony-1', 
        type: 'Work/Professional',
        role: 'CEO & Chairman',
        organizationName: 'Stark Industries',
        fromState: 'Weapons Manufacturer',
        toState: 'Global Clean Energy Leader & IPO',
        description: 'Led Stark Industries through a transformative pivot from weapons manufacturing to a global clean energy powerhouse, culminating in a landmark IPO.',
        rewards: [],
        isDesignation: false,
        companyLogoUrl: 'https://picsum.photos/seed/StarkIndustries/40/40',
    },
    { 
        id: 'ach-tony-2', 
        type: 'Academic/Intellectual',
        role: 'Lead Inventor',
        organizationName: 'Stark Industries',
        fromState: 'Building-sized Arc Reactor',
        toState: 'Man-portable Arc Reactor',
        description: 'Pioneered the miniaturization of Arc Reactor technology, creating a new paradigm in portable, sustainable energy.',
        rewards: [{ id: 'rew-tony-1', name: 'Patent US-12345', links: ['https://patents.google.com/patent/US12345'], files: [] }],
        isDesignation: false,
        companyLogoUrl: 'https://picsum.photos/seed/StarkIndustries/40/40',
    },
    { 
        id: 'ach-tony-4', 
        type: 'Academic/Intellectual',
        role: 'Student',
        organizationName: 'MIT',
        fromState: 'First Year',
        toState: 'Graduation (Summa Cum Laude)',
        description: 'Graduated summa cum laude from MIT with dual degrees in Physics and Electrical Engineering.',
        rewards: [],
        isDesignation: true,
        governingBody: 'Massachusetts Institute of Technology',
        companyLogoUrl: 'https://picsum.photos/seed/MIT/40/40',
    },
];

const pepperAchievements: ProfessionalAchievement[] = [
    { 
        id: 'ach-pep-1', 
        type: 'Work/Professional',
        role: 'CEO',
        organizationName: 'Stark Industries',
        fromState: 'COO',
        toState: 'CEO of Public Company',
        description: 'Successfully managed global operations and strategic direction for a multi-billion dollar public technology company.',
        rewards: [],
        isDesignation: false,
        companyLogoUrl: 'https://picsum.photos/seed/StarkIndustries/40/40',
    },
    { 
        id: 'ach-pep-2', 
        type: 'Work/Professional',
        role: 'COO/CEO',
        organizationName: 'Stark Industries',
        fromState: 'Domestic Operations',
        toState: 'Global Expansion to 50+ Countries',
        description: 'Oversaw international expansion into over 50 countries, scaling complex operations and growing global revenue streams.',
        rewards: [],
        isDesignation: false,
        companyLogoUrl: 'https://picsum.photos/seed/StarkIndustries/40/40',
    },
];

// --- User Data ---
let usersData: Omit<User, 'igs'>[] = [
    { 
        id: 'user-tony', 
        name: 'Tony Stark', 
        avatar: 'https://i.pravatar.cc/40?u=tony-stark', 
        role: 'Founder',
        title: 'CEO & Chief Architect',
        summary: 'A visionary inventor and industrialist who transformed a legacy manufacturing empire into a global technology leader in clean energy. Proven experience taking a company from concept to IPO, with deep expertise in hardware engineering and artificial intelligence.',
        personalMission: { statement: 'To build technologies that safeguard humanity and push the boundaries of exploration.', sharingLevel: 'Share with Investors' },
        earnedGumpScore: 38500,
        achievements: tonyAchievements,
        goals: [],
        interests: [
            { id: 'int-tony-1', description: 'Early-Stage AI Startups', investmentTypes: ['Time', 'Money'], sharingLevel: 'Share with Investors' },
            { id: 'int-tony-2', description: 'Robotics & Automation', investmentTypes: ['Time', 'Energy'], sharingLevel: 'Share with My Company' },
        ],
    },
    { 
        id: 'user-pepper', 
        name: 'Pepper Potts', 
        avatar: 'https://i.pravatar.cc/40?u=pepper-potts', 
        role: 'Management',
        title: 'COO',
        summary: 'A seasoned executive with a track record of scaling global operations for a multi-billion dollar public company. Expert in corporate governance, strategic management, and international market expansion.',
        personalMission: { statement: 'To build a sustainable, ethical, and profitable global organization.', sharingLevel: 'Share with My Company' },
        earnedGumpScore: 25000,
        achievements: pepperAchievements,
        goals: [],
        interests: [
            { id: 'int-pep-1', description: 'Art Collecting', investmentTypes: ['Money'], sharingLevel: 'Private' },
            { id: 'int-pep-2', description: 'Mentoring Female Founders', investmentTypes: ['Time', 'Energy'], sharingLevel: 'Share with My Company' },
        ],
    },
    { 
        id: 'user-rhodey', 
        name: 'James Rhodes', 
        avatar: 'https://i.pravatar.cc/40?u=james-rhodes', 
        role: 'Advisor',
        title: 'Government & Defense Liaison',
        summary: '',
        personalMission: { statement: 'To bridge the gap between technological innovation and national security.', sharingLevel: 'Private' },
        earnedGumpScore: 15000,
        achievements: [],
        goals: [],
        interests: [],
    },
    { 
        id: 'user-happy', 
        name: 'Happy Hogan', 
        avatar: 'https://i.pravatar.cc/40?u=happy-hogan', 
        role: 'Team Member',
        title: 'Head of Security',
        summary: '',
        personalMission: { statement: '', sharingLevel: 'Private' },
        earnedGumpScore: 5000,
        achievements: [],
        goals: [],
        interests: [],
    },
];

export let users: User[] = usersData.map(user => ({
    ...user,
    igs: igsService.calculateIgs(user as User),
}));

export const updateUser = (updatedUser: User) => {
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
        users[index] = updatedUser;
        // Also update usersData if needed, for simplicity we're only updating users here
        const dataIndex = usersData.findIndex(u => u.id === updatedUser.id);
        if(dataIndex !== -1) {
            const { igs, ...rest } = updatedUser;
            usersData[dataIndex] = rest;
        }
    }
};

export const addAchievementToUser = (userId: string, achievement: Omit<ProfessionalAchievement, 'id'>) => {
    const user = users.find(u => u.id === userId);
    if(user) {
        const newAchievement: ProfessionalAchievement = {
            ...achievement,
            id: `ach-${userId}-${Date.now()}`
        };
        user.achievements.push(newAchievement);
        const dataIndex = usersData.findIndex(u => u.id === userId);
        if(dataIndex !== -1) {
            usersData[dataIndex].achievements.push(newAchievement);
        }
    }
};


export const currentUser = users[0]; // Assume Tony Stark is the current user

// --- Investor Data ---
export const investors: Investor[] = [
    { id: 'inv-odin', name: 'Odin', firm: 'Odin Capital' },
    { id: 'inv-asgard', name: 'Frigga', firm: 'Asgard Ventures' },
    { id: 'inv-loki', name: 'Loki', firm: 'Loki Equity Partners' },
    { id: 'inv-sequoia', name: 'Roelof Botha', firm: 'Sequoia Capital' },
    { id: 'inv-a16z', name: 'Marc Andreessen', firm: 'Andreessen Horowitz' },
];

// Simulated data based on the provided JSON, with current points added for visualization.
export const genesisScoreData: GenesisScoreData = {
  name: "Genesis Score (v3.0 - 1,000,000 Max Score)",
  max_score: 1000000,
  scoring_layers: [
    {
      layer_name: "Base Pillars (700,000 points total)",
      description: "Scaled v2.5 score for timeless moats, based on traditional diligence categories.",
      pillars: [
        { name: "Team", max_points: 150000, details: "Management experience, education, previous exits, specific roles.", current_points: 125000 },
        { name: "IP", max_points: 100000, details: "Patents (received/pending), trademarks, trade secrets, holder employment.", current_points: 75000 },
        { name: "DD Preparedness", max_points: 150000, details: "Completeness of DD documents (biz plan, investor deck), financial granularity.", current_points: 140000 },
        { name: "Distribution/Market", max_points: 100000, details: "E-commerce presence, product market fit validation, market value, customer base.", current_points: 60000 },
        { name: "Traction/Health", max_points: 150000, details: "Revenue (historical/projected), profitability, cash runway, burn rate.", current_points: 95000 },
        { name: "GUMP (Genesis U Mastery Pillar)", max_points: 50000, details: "Soft skills, vocabulary, investor relations, legal compliance training.", current_points: 35000 }
      ]
    }
  ],
  nuance_overlays: [
    {
      layer_name: "Nuance Overlays (300,000 points total)",
      description: "Dynamic multipliers for specific strategic advantages or contextual relevance.",
      overlays: [
        { name: "Stealth Moat Layer (SML)", max_points: 100000, details: "Quantifies non-public, defensible advantages (e.g., classified grants, security clearances).", current_points: 80000 },
        { name: "Cultural Fluency Layer (CFL / GUMP)", max_points: 100000, details: "Measures mastery of investor-specific cultural cues, soft skills, and vocabulary.", current_points: 45000 },
        { name: "Regulatory Tailwind Layer (RTL)", max_points: 100000, details: "Scores impact of legislative/government changes as positive or negative multipliers.", current_points: 20000 }
      ]
    }
  ],
  innovation_horizon: [
    {
        layer_name: "Innovation Horizon (Potential)",
        description: "Headroom for dynamic, future-proof additions and game-changing technologies.",
        modules: [
          { name: "AI/Compute Wave", details: "Agentic AI, hybrid AI ethics, quantum AI integration." },
          { name: "Quantum/Secure Tech", details: "Quantum-safe encryption, entangled sim readiness." },
          { name: "Reg/Sustain Shifts", details: "SEC 2.0 leverage, carbon audit moats." }
        ]
    }
  ]
};

// --- C-Suite Specific Data ---

export const ctoData = {
  techStack: [
    { name: 'React Native (Expo)', category: 'Frontend', status: 'Healthy' },
    { name: 'Next.js', category: 'Web Frontend', status: 'Healthy' },
    { name: 'Node.js/Express', category: 'Backend', status: 'Healthy' },
    { name: 'PostgreSQL (Cloud SQL)', category: 'Database', status: 'Healthy' },
    { name: 'Vertex AI', category: 'AI/ML', status: 'Healthy' },
    { name: 'Legacy PHP Service', category: 'Backend', status: 'Deprecated' },
  ] as TechStackItem[],
  roadmap: [
    { quarter: 'Q4 2025', feature: 'Master DD Orchestrator v1.0', status: 'Completed' },
    { quarter: 'Q1 2026', feature: 'Social Investor Flow (Aisha\'s Water Well)', status: 'In Progress' },
    { quarter: 'Q1 2026', feature: 'Quantum-Safe Encryption PoC', status: 'In Progress' },
    { quarter: 'Q2 2026', feature: 'AI/Compute Wave Module Integration', status: 'Planned' },
  ] as RoadmapItem[],
  securityAudit: {
    score: 92,
    lastScan: '2025-10-25',
    vulnerabilities: 3,
  }
};

export const cfoData = {
  financials: [
    { month: 'Jul', revenue: 50000, burn: 80000, runway: 24 },
    { month: 'Aug', revenue: 55000, burn: 82000, runway: 22 },
    { month: 'Sep', revenue: 65000, burn: 85000, runway: 20 },
    { month: 'Oct', revenue: 75000, burn: 88000, runway: 18 },
    { month: 'Nov (Proj)', revenue: 90000, burn: 90000, runway: 17 },
    { month: 'Dec (Proj)', revenue: 110000, burn: 92000, runway: 16 },
  ] as FinancialMetric[],
  capTable: {
    founders: 60,
    investors: 25,
    esop: 15,
  }
};

export const cmoData = {
  marketMetrics: [
    { channel: 'Organic Search', cac: 50, ltv: 450 },
    { channel: 'Paid Social', cac: 120, ltv: 380 },
    { channel: 'Referrals', cac: 15, ltv: 600 },
    { channel: 'Content Marketing', cac: 75, ltv: 550 },
  ] as MarketMetric[],
  gtmPlan: [
    { initiative: 'APAC Market Entry', status: 'In Progress', progress: 60 },
    { initiative: 'Enterprise Tier Launch', status: 'Completed', progress: 100 },
    { initiative: 'Community Ambassador Program', status: 'Planned', progress: 0 },
  ]
};

// --- Due Diligence Data ---
export const initialDiligenceRequests: DiligenceRequest[] = [
    {
        id: 'dd-req-001',
        investorId: 'inv-odin',
        investorName: 'Odin Capital',
        investorAvatar: 'https://i.pravatar.cc/40?u=odin',
        query: 'Biotech Moat Deep-Dive: Show me the core IP, related team expertise, and any regulatory tailwinds for Project Chimera.',
        status: 'Pending Founder Approval',
        conflictCheckResult: null,
        synthesizedReport: null,
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
        id: 'dd-req-002',
        investorId: 'inv-asgard',
        investorName: 'Asgard Ventures',
        investorAvatar: 'https://i.pravatar.cc/40?u=asgard',
        query: 'What is the current burn rate, cash runway, and latest fundraising valuation?',
        status: 'Complete',
        conflictCheckResult: 'No conflicts found.',
        synthesizedReport: `### Financial Snapshot & Valuation\n\n**Key Metrics:**\n- **Current Monthly Burn Rate:** $88,000\n- **Cash Runway:** 18 months based on current projections.\n- **Most Recent Valuation:** $25M post-money from the Seed+ round.\n\n**Commentary:**\nThe company demonstrates a controlled burn relative to its revenue growth. The runway provides ample time to hit key milestones before the next fundraising round.`,
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
];

// --- Score Calculation Data ---
export const scoreCalculationData: ScoreComponent[] = [
    // Team
    { category: 'Team', item: 'Founder Experience (2x exits)', points: 50000, max_points: 75000, details: 'Previous successful exits are highly valued.' },
    { category: 'Team', item: 'CTO (VP at Public Co)', points: 10000, max_points: 20000, details: 'Experience scaling technology at a large organization.' },
    { category: 'Team', item: 'Lead Scientist (PhD)', points: 7000, max_points: 15000, details: 'Deep domain expertise in a core area.' },
    { category: 'Team', item: 'Team-IP Linkage Bonus', points: 18000, max_points: 25000, details: 'Multiplicative boost (15%) for key team members holding core IP.' },
    { category: 'Team', item: 'Advisory Board (3x Industry Vets)', points: 40000, max_points: 40000, details: 'Strong network and guidance from established experts.' },
    // IP
    { category: 'IP', item: 'Patent Received (USPTO-112345)', points: 50000, max_points: 60000, details: 'Core technology patent granted.' },
    { category: 'IP', item: 'Patent Pending (USPTO-67890)', points: 15000, max_points: 20000, details: 'Secondary method patent filed.' },
    { category: 'IP', item: 'Trademark (Genesis Exchange®)', points: 10000, max_points: 10000, details: 'Brand identity secured.' },
    // DD Preparedness
    { category: 'DD Preparedness', item: 'Investor Deck (v3.1)', points: 40000, max_points: 40000, details: 'Document complete and AI-vetted.' },
    { category: 'DD Preparedness', item: 'Business Plan (2025-2029)', points: 40000, max_points: 40000, details: 'Document complete and AI-vetted.' },
    { category: 'DD Preparedness', item: 'Financial Projections (5-year)', points: 60000, max_points: 70000, details: 'Granular, multi-scenario model uploaded.' },
    // Distribution/Market
    { category: 'Distribution/Market', item: 'Product Market Fit Validation', points: 40000, max_points: 80000, details: 'Survey data shows strong positive sentiment.' },
    { category: 'Distribution/Market', item: 'E-commerce Presence', points: 20000, max_points: 20000, details: 'Active subscription funnels and public website.' },
    // Traction/Health
    { category: 'Traction/Health', item: 'Revenue (Historical)', points: 35000, max_points: 50000, details: 'Based on last 6 months of actual revenue.' },
    { category: 'Traction/Health', item: 'Revenue (Projected)', points: 40000, max_points: 50000, details: 'Based on 12-month forward-looking projections.' },
    { category: 'Traction/Health', item: 'Positive Unit Economics', points: 20000, max_points: 50000, details: 'LTV > 3x CAC.' },
    // GUMP
    { category: 'GUMP', item: 'Genesis U Mastery', points: 35000, max_points: 100000, details: 'Aggregated score from all team members\' completed knowledge modules.' },
    // SML
    { category: 'Stealth Moat Layer', item: 'Classified Grant (DARPA)', points: 60000, max_points: 100000, details: 'Non-public funding source secured.' },
    { category: 'Stealth Moat Layer', item: 'Security Clearances (Team)', points: 20000, max_points: 50000, details: 'Key personnel hold active clearances.' },
    // CFL
    { category: 'Cultural Fluency Layer', item: 'AI-Simulated Dialogue Prep', points: 32500, max_points: 50000, details: 'High score on simulated investor Q&A.' },
    { category: 'Cultural Fluency Layer', item: 'Vocabulary Mastery', points: 12500, max_points: 50000, details: 'Demonstrated understanding of complex terms like "piggyback rights".' },
    // RTL
    { category: 'Regulatory Tailwind Layer', item: 'SEC 2.0 Leverage', points: 20000, max_points: 100000, details: 'Positive impact from recent regulatory changes.' },
];
