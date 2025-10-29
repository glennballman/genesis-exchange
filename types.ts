export interface Pillar {
  name: string;
  max_points: number;
  details: string;
  current_points: number; // Simulated current score
}

export interface ScoringLayer {
  layer_name: string;
  description: string;
  pillars: Pillar[];
}

export interface Overlay {
  name: string;
  max_points: number;
  details: string;
  current_points: number; // Simulated current score
}

export interface OverlayLayer {
  layer_name: string;
  description: string;
  overlays: Overlay[];
}

export interface InnovationModule {
    name:string;
    details: string;
}

export interface InnovationLayer {
    layer_name: string;
    description: string;
    modules: InnovationModule[];
}

export interface GenesisScoreData {
  name: string;
  max_score: number;
  scoring_layers: ScoringLayer[];
  nuance_overlays: OverlayLayer[];
  innovation_horizon: InnovationLayer[];
}

export interface PulseAnalysis {
  opportunities: string[];
  threats: string[];
}

// Types for C-Suite Dashboards
export type CSuiteRole = 'CTO' | 'CFO' | 'CMO';

export interface TechStackItem {
  name: string;
  category: string;
  status: 'Healthy' | 'At Risk' | 'Deprecated';
}

export interface RoadmapItem {
  quarter: string;
  feature: string;
  status: 'Completed' | 'In Progress' | 'Planned';
}

export interface FinancialMetric {
  month: string;
  revenue: number;
  burn: number;
  runway: number; // in months
}

export interface MarketMetric {
  channel: string;
  cac: number; // Customer Acquisition Cost
  ltv: number; // Lifetime Value
}

export interface DashboardInsight {
  title: string;
  points: string[];
}

// Type for the Intake Wizard
export interface WizardFormData {
    companyName: string;
    industry: string;
    oneLiner: string;
    monthlyRevenue: number;
    monthlyBurn: number;
    missionStatement: string;
}

// --- Intelligent Diligence Engine Types ---
export type DiligenceItemCategory = 'Financials' | 'Legal' | 'Team' | 'IP' | 'Market' | 'Product' | 'Other';
export type DiligenceItemStatus = 'Pending' | 'Suggested' | 'Approved' | 'Deferred' | 'Denied' | 'Awaiting Response';
export type RequestMethod = 'Email' | 'Verbal' | 'Genesis Platform';

export interface SuggestedEvidence {
    documentId: string;
    documentName: string;
    relevance: string; // AI-generated explanation
}

export interface SuggestedResponse {
    confidenceScore: number;
    responseText: string; // AI-generated summary of the response
    evidence: SuggestedEvidence[];
}

export interface DiligenceItem {
    id: string;
    authorId: string; // ID of the Principal who made the request
    category: DiligenceItemCategory;
    request: string; // The original request text
    status: DiligenceItemStatus;
    suggestedResponse: SuggestedResponse | null;
    finalResponse?: {
        text?: string;
        attachments: string[]; // Array of document IDs
    };
}

export interface PreliminaryInvestorReport {
    summary: string;
    cautionScore: number;
    links: {
        title: string;
        url: string;
    }[];
}

export interface DetailedInvestorAnalysis {
    keyPersonnel: { name: string; title: string; }[];
    investmentThesis: string;
    recentInvestments: { companyName: string; sector: string; }[];
    publicLinks: { title: string; url: string; }[];
}

export interface InvestorProfile {
    status: 'PENDING_VERIFICATION' | 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'GENESIS_PRINCIPAL';
    principalId?: string;
    confirmedUrl?: string;
    preliminaryReport?: PreliminaryInvestorReport;
    detailedAnalysis?: DetailedInvestorAnalysis;
}

export interface LiveAlignmentReport {
    alignmentScore: number;
    narrative: string;
}

export interface DiligencePackage {
    id: string;
    investorName: string;
    investorProfile: InvestorProfile;
    requesterPrincipalId?: string;
    subjectPrincipalId?: string;
    liveAlignmentReport?: LiveAlignmentReport;
    createdAt: string;
    requestMethod: RequestMethod;
    status: 'Draft' | 'Shared' | 'Complete';
    items: DiligenceItem[];
    sharingLink?: string;
    accessPasscode?: string;
}


// Type for Score Calculation Detail
export interface ScoreComponent {
    category: string;
    item: string;
    points: number;
    max_points: number;
    details: string;
}

// Types for Action Plans and Saved Insights
export interface YoutubeSuggestion {
    title: string;
    thumbnailUrl: string;
    videoId: string;
    level?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface ActionItem {
    action: string;
    description: string;
    link: string;
    youtubeSuggestions: YoutubeSuggestion[];
}

export interface Partner {
    name: string;
    description: string;
    link: string;
    logoUrl: string;
    tier: 'PROMOTED' | 'INTEGRATED' | 'EMBEDDED' | 'STANDARD';
}

export interface TakeActionPlan {
    estimatedTime: string;
    youtubeSuggestions: YoutubeSuggestion[];
    googleAssistance: ActionItem[];
    outsideGoogle: Partner[];
}

export interface SavedInsight {
    id: string;
    concept: string;
    aiSummary: string;
    takeActionPlan?: TakeActionPlan;
    ipAnalysisReport?: IpAnalysisReport;
    timestamp: string;
}

export interface ImprovementTips {
    tipsText: string;
    videoSuggestions: YoutubeSuggestion[];
}

// --- Individual GUMP Score (IGS) System ---
export type AchievementType = 'Work/Professional' | 'Athletic' | 'Academic/Intellectual' | 'Artistic' | 'Spiritual' | 'Community/Humanity/Charitable';
export type MemberRole = 'Founder' | 'Management' | 'Team Member' | 'Board Member' | 'Advisor';

export interface Reward {
    id: string;
    name: string;
    links: string[];
    files: { name: string; url: string }[];
}

export interface ProfessionalAchievement {
    id: string;
    type: AchievementType;
    role: string;
    organizationName: string;
    organizationUrl?: string;
    description: string; // User-editable, AI-assisted
    fromState: string;
    toState: string;
    accomplishmentUrl?: string;
    accomplishmentFile?: { name: string; url: string };
    rewards: Reward[];
    isDesignation: boolean;
    designationName?: string;
    governingBody?: string;
    designationLinks?: string[];
    designationFiles?: { name: string; url: string }[];
    companyLogoUrl?: string; // Added for team slide generator
}

export type GoalTimeline = 'Short-Term (This Year)' | 'Medium-Term (1-3 Years)' | 'Long-Term (3+ Years)';
export type GoalSharingLevel = 'Private' | 'Share with My Company' | 'Share with Investors';

export interface Goal {
    id: string;
    category: AchievementType;
    description: string;
    targetDate: GoalTimeline;
    sharingLevel: GoalSharingLevel;
}

export type InvestmentType = 'Time' | 'Energy' | 'Money';

export interface Interest {
    id: string;
    description: string;
    investmentTypes: InvestmentType[];
    sharingLevel: GoalSharingLevel;
}

export interface IndividualGumpScore {
    total: number;
    provenExecution: {
        total: number;
        exits: number;
        scaling: number;
        capitalGovernance: number;
    };
    pillarsOfPotential: {
        total: number;
        disciplineGrit: number;
        intellectualHorsepower: number;
        ambition: number;
    };
}

export interface TeamChemistry {
    multiplier: number; // e.g., 1.15 for a 15% boost
    factors: {
        description: string;
        boost: string; // e.g., "+10%"
    }[];
}

// --- Mission & Alignment Engine ---
export type PrincipalType = 'USER' | 'COMPANY' | 'PROJECT' | 'VC_FUND' | 'INSTITUTION';

export interface Principal {
    id: string;
    type: PrincipalType;
    name: string;
    missionStatement: string;
    values: string[];
    exclusions: string[];
    teamMembers?: User[];
    parentPrincipalId?: string;
    childPrincipals?: Principal[];
}

export interface AlignmentMatch {
    target: Principal;
    financialAlignmentScore: number;
    advisoryAlignmentScore: number;
    narrative: string;
    conflict: boolean;
}

export interface Mission {
    id: string;
    name: string;
    statement: string;
    parentId?: string | null;
    ownerId: string; // User ID of the mission owner
}

export interface IndividualAlignmentReport {
    userId: string;
    userName: string;
    missionAlignmentScore: number;
    ambitionIndex: number;
    transparencyIndex: number;
    executiveSummary: string;
    keySynergies: string[];
    alignmentGaps: string[];
    conversationStarters: string[];
}

export interface TeamAlignmentReport {
    teamAlignmentScore: number;
    teamAmbitionIndex: number;
    teamTransparencyIndex: number;
    executiveSummary: string;
    keySynergies: string[];
    areasOfDivergence: string[];
    individualReports: IndividualAlignmentReport[];
}

// --- Core User & Team Types ---
export interface User {
    id: string;
    name: string;
    avatar: string;
    role: MemberRole;
    title: string; // e.g., "CEO & Chairman"
    summary: string; // New AI-generated overall summary
    personalMission: {
        statement: string;
        sharingLevel: GoalSharingLevel;
    };
    earnedGumpScore: number; // For Genesis U modules
    igs?: IndividualGumpScore; // The new detailed score
    achievements: ProfessionalAchievement[];
    goals: Goal[];
    interests: Interest[];
    resumeFileName?: string;
    verification?: {
        source: string;
        url: string;
        verifiedAt: string;
    };
}

export interface DelegationEntry {
    delegatedFrom: User;
    delegatedTo: User;
    timestamp: string;
}

export type ActionPlanStatus = 'Todo' | 'In Progress' | 'Done';

export interface ActionPlanItem {
    id: string;
    concept: string;
    scoreComponent: ScoreComponent;
    aiSummary: string;
    takeActionPlan: TakeActionPlan;
    improvementTips: ImprovementTips;
    status: ActionPlanStatus;
    assignedTo: User;
    delegationHistory: DelegationEntry[];
    createdAt: string;
    gumpPointsAvailable: number;
}

// Types for Genesis U Learning Modules
export interface CompletedModule {
    moduleId: string;
    title: string;
    pointsAwarded: number;
    completedAt: string;
}

export interface UserProfile {
    gumpPoints: number;
    completedModules: CompletedModule[];
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

// Type for Historical Score Data
export interface ScoreSnapshot {
    date: string;
    score: number;
}

// Type for eGUMP
export interface EGumpResponse {
    estimatedGumpScore: number;
    rationale: string[];
}

// Types for DD Vaults
export type VaultId = 'ip' | 'financials' | 'market' | 'team' | 'product' | 'legal' | 'exit';

export interface Vault {
    id: VaultId;
    name: string;
    description: string;
    icon: string;
    color: string;
}

export interface AIParsedInsights {
    document_type: string;
    summary: string;
    key_entities: string[];
}

export type PatentStatus = 'Issued' | 'Pending' | 'Expired' | 'Unknown';

export interface IpAnalysisScoreBreakdown {
    coreQuality: {
        total: number;
        claimBreadth: number;
        novelty: number;
        specification: number;
    };
    marketViability: {
        total: number;
        marketSize: number;
        commercialRelevance: number;
    };
    influence: {
        total: number;
        forwardCitations: number;
        priorArt: number;
    };
    riskFactors: {
        total: number;
        patentStatus: number;
        litigationRisk: number;
    };
}

export type IpAnalysisTier = 'free' | 'premium' | 'international';

export interface IpAnalysisReport {
    tier: IpAnalysisTier;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    score: number; // out of 1000
    patentStatus: PatentStatus;
    scoreBreakdown: IpAnalysisScoreBreakdown;
}

export interface VaultDocument {
    id: string;
    name: string;
    vaultId: VaultId;
    uploadedAt: string;
    size: string;
    insights: AIParsedInsights | null;
    verification?: {
        source: string;
        url: string;
        verifiedAt: string;
    };
    ipAnalysis?: {
        status: 'in_progress' | 'complete' | 'error';
        report?: IpAnalysisReport;
        error?: string;
    };
}

// Types for Access Orbits (Permissions)
export interface Investor {
    id: string;
    name: string;
    firm: string;
}

export type PermissionLevel = 'FULL_ACCESS' | 'VIEW_ONLY' | 'VIEW_WITH_REDACTIONS';

export interface DocumentPermission {
    id: string;
    documentId: string;
    investorId: string;
    level: PermissionLevel;
    expiresAt?: string;
}
