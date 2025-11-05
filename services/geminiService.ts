
import { GoogleGenAI, Type } from '@google/genai';
import { PulseAnalysis, DashboardInsight, CSuiteRole, ScoreComponent, TakeActionPlan, ImprovementTips, QuizQuestion, EGumpResponse, AIParsedInsights, IpAnalysisReport, ProfessionalAchievement, Mission, User, TeamAlignmentReport, Principal, DiligenceItem, PreliminaryInvestorReport, VaultDocument, SuggestedResponse, DetailedInvestorAnalysis } from '../types';

// --- Gemini API Call ---

const generateGeminiText = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini-generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.generated_text;
  } catch (error) {
    console.error("Failed to generate text from Gemini API:", error);
    // Return a mock response or a more specific error message
    return "Error: Could not connect to the AI service.";
  }
};


// --- Mock Data and Schemas ---

const mockPulseAnalysis: PulseAnalysis = {
  opportunities: ["AI features are currently in mock mode.", "Focus on UI/UX development."],
  threats: ["API key is not configured.", "Full functionality is disabled."]
};

const mockDashboardInsight: DashboardInsight = {
  title: "AI Insights (Mock Mode)",
  points: ["This is a mock insight. Configure API keys for real analysis.", "Development can proceed with mock data."]
};

const mockAIParsedInsights: AIParsedInsights = {
  document_type: 'Mock Document',
  summary: 'This is a mock summary. The actual document has not been analyzed.',
  key_entities: ['mock data', 'development']
};

const mockDiligenceItems: Omit<DiligenceItem, 'status' | 'suggestedResponse' | 'authorId'>[] = [
    { id: 'req-1', category: 'Financials', request: 'Please provide mock financial statements.' },
    { id: 'req-2', category: 'Team', request: 'Please provide a mock team overview.' }
];

const mockSuggestedResponse: SuggestedResponse = {
    confidenceScore: 42,
    responseText: "This is a mock suggested response based on available mock documents.",
    evidence: [{
        documentId: 'doc-1',
        documentName: 'Mock_Pitch_Deck.pdf',
        relevance: 'Contains high-level mock financials.'
    }]
};

const mockPreliminaryInvestorReport: PreliminaryInvestorReport = {
    summary: 'This is a mock preliminary report on a mock investor. All data is fabricated.',
    cautionScore: 10,
    links: [{ title: 'Mock Investor Website', url: 'https://example.com' }]
};

const mockDetailedInvestorAnalysis: DetailedInvestorAnalysis = {
    keyPersonnel: [{ name: 'Mock Partner', title: 'General Partner' }],
    investmentThesis: 'Invests in mock companies at the seed stage.',
    recentInvestments: [{ companyName: 'MockCo', sector: 'MockTech' }],
    publicLinks: [{ title: 'Portfolio', url: 'https://example.com/portfolio' }]
};

const mockTeamAlignmentReport: Omit<TeamAlignmentReport, 'individualReports' | 'teamAmbitionIndex' | 'teamTransparencyIndex'> = {
    alignmentScore: 75,
    executiveSummary: 'This is a mock team alignment report. The team shows strong mock alignment.',
    keySynergies: ['Mock synergy 1', 'Mock synergy 2'],
    areasOfDivergence: ['Mock divergence 1']
};

const mockIpAnalysisReport: IpAnalysisReport = {
    tier: 'free',
    summary: 'This is a mock IP analysis report. The analysis is simulated.',
    strengths: ['Mock strength 1', 'Mock strength 2'],
    weaknesses: ['Mock weakness 1'],
    score: 650,
    patentStatus: 'Pending',
    scoreBreakdown: {
        coreQuality: { total: 250, claimBreadth: 150, novelty: 80, specification: 20 },
        marketViability: { total: 200, marketSize: 100, commercialRelevance: 100 },
        influence: { total: 100, forwardCitations: 70, priorArt: 30 },
        riskFactors: { total: 100, patentStatus: 50, litigationRisk: 50 }
    }
};

const mockTakeActionPlan: TakeActionPlan = {
    estimatedTime: 'Approx. 1-2 hours',
    youtubeSuggestions: [],
    googleAssistance: [],
    outsideGoogle: []
};

const mockImprovementTips: ImprovementTips = {
    tipsText: '* This is a mock tip.\n* Focus on completing the UI.',
    videoSuggestions: []
};

const mockQuiz: QuizQuestion[] = [
    {
        question: "What is the primary purpose of this mock quiz?",
        options: ["Testing", "Development", "User amusement", "All of the above"],
        correctAnswer: "All of the above"
    }
];

// --- "Fake AI" Functions ---

export const getPulseAnalysis = async (query: string): Promise<PulseAnalysis> => {
  console.log(`Mock AI: getPulseAnalysis called with query: ${query}`);
  const prompt = `Analyze the following query and provide a pulse analysis in JSON format: ${query}`;
  const result = await generateGeminiText(prompt);
  try {
    return JSON.parse(result) as PulseAnalysis;
  } catch (e) {
    return mockPulseAnalysis;
  }
};

export const getDashboardInsights = async (role: CSuiteRole): Promise<DashboardInsight> => {
    console.log(`Mock AI: getDashboardInsights called for role: ${role}`);
    const prompt = `Generate dashboard insights for a ${role} in JSON format.`
    const result = await generateGeminiText(prompt);
    try {
        return JSON.parse(result) as DashboardInsight;
    } catch (e) {
        return mockDashboardInsight;
    }
};

export const analyzeDocument = async (documentName: string): Promise<AIParsedInsights> => {
    console.log(`Mock AI: analyzeDocument called for document: ${documentName}`);
    const prompt = `Analyze the document named ${documentName} and provide insights in JSON format.`
    const result = await generateGeminiText(prompt);
    try {
        return JSON.parse(result) as AIParsedInsights;
    } catch (e) {
        if (documentName.toLowerCase().includes('resume')) {
            return { ...mockAIParsedInsights, document_type: 'Resume' };
        }
        return mockAIParsedInsights;
    }
};

export const parseDiligenceRequestList = async (text: string): Promise<Omit<DiligenceItem, 'status' | 'suggestedResponse' | 'authorId'>[]> => {
    console.log(`Mock AI: parseDiligenceRequestList called with text.`);
    const prompt = `Parse the following text and extract diligence requests in JSON format: ${text}`;
    const result = await generateGeminiText(prompt);
    try {
        return JSON.parse(result) as Omit<DiligenceItem, 'status' | 'suggestedResponse' | 'authorId'>[];
    } catch (e) {
        return mockDiligenceItems;
    }
};

export const findEvidenceForRequest = async (requestText: string, availableDocs: VaultDocument[]): Promise<SuggestedResponse> => {
    console.log(`Mock AI: findEvidenceForRequest called for request: ${requestText}`);
    const prompt = `Find evidence for the request '${requestText}' from the available documents and provide a response in JSON format.`
    const result = await generateGeminiText(prompt);
    try {
        return JSON.parse(result) as SuggestedResponse;
    } catch (e) {
        return mockSuggestedResponse;
    }
};

export const generateInvestorPreliminaryReport = async (investorName: string): Promise<PreliminaryInvestorReport> => {
    console.log(`Mock AI: generateInvestorPreliminaryReport called for investor: ${investorName}`);
    const prompt = `Generate a preliminary investor report for ${investorName} in JSON format.`
    const result = await generateGeminiText(prompt);
    try {
        return JSON.parse(result) as PreliminaryInvestorReport;
    } catch (e) {
        return mockPreliminaryInvestorReport;
    }
};

export const analyzePrincipalWebsite = async (url: string): Promise<DetailedInvestorAnalysis> => {
    console.log(`Mock AI: analyzePrincipalWebsite called for URL: ${url}`);
    const prompt = `Analyze the principal website at ${url} and provide a detailed investor analysis in JSON format.`
    const result = await generateGeminiText(prompt);
    try {
        return JSON.parse(result) as DetailedInvestorAnalysis;
    } catch (e) {
        return mockDetailedInvestorAnalysis;
    }
};

export const generateAlignmentNarrative = async (source: Principal, target: Principal, conflict: boolean): Promise<string> => {
    console.log(`Mock AI: generateAlignmentNarrative called.`);
    const prompt = `Generate an alignment narrative between ${source.name} and ${target.name} in JSON format. Conflict: ${conflict}`;
    const result = await generateGeminiText(prompt);
    try {
        return result;
    } catch (e) {
        return conflict 
        ? "This is a mock narrative explaining a conflict."
        : "This is a mock narrative explaining a strong alignment.";
    }
};

export const generateTeamAlignmentReport = async (mission: Mission, team: User[]): Promise<Omit<TeamAlignmentReport, 'individualReports' | 'teamAmbitionIndex' | 'teamTransparencyIndex'>> => {
    console.log(`Mock AI: generateTeamAlignmentReport called.`);
    const prompt = `Generate a team alignment report for a team with the mission '${mission.statement}' in JSON format.`
    const result = await generateGeminiText(prompt);
    try {
        return JSON.parse(result) as Omit<TeamAlignmentReport, 'individualReports' | 'teamAmbitionIndex' | 'teamTransparencyIndex'>;
    } catch (e) {
        return mockTeamAlignmentReport;
    }
};

export const generateIndividualAlignmentReport = async (user: User, companyMission: string): Promise<Omit<IndividualAlignmentReport, 'ambitionIndex' | 'transparencyIndex'>> => {
    console.log(`Mock AI: generateIndividualAlignmentReport for user: ${user.name}`);
    const prompt = `Generate an individual alignment report for ${user.name} with the company mission '${companyMission}' in JSON format.`
    const result = await generateGeminiText(prompt);
    try {
        return JSON.parse(result) as Omit<IndividualAlignmentReport, 'ambitionIndex' | 'transparencyIndex'>;
    } catch (e) {
        const missionAlignmentScore = 50 + Math.floor(Math.random() * 50);
        return {
            userId: user.id,
            userName: user.name,
            missionAlignmentScore,
            executiveSummary: `Mock analysis shows a ${missionAlignmentScore > 80 ? 'strong' : 'moderate'} alignment.`,
            keySynergies: ["A personal goal aligns with the company's high-performance culture."],
            alignmentGaps: ["Long-term career path could be more clearly mapped to the company's future state."],
            conversationStarters: ["A goal: 'I noticed your goal to learn more about X. How do you see that fitting into your work here?'"]
        };
    }
};

export const generateProfileSummaryAndNarratives = async (name: string, title: string, achievements: ProfessionalAchievement[], links: { type: string, url: string }[]): Promise<{ summary: string; achievements: ProfessionalAchievement[] }> => {
    console.log(`Mock AI: generateProfileSummaryAndNarratives for: ${name}`);
    const prompt = `Generate a profile summary and narratives for ${name}, the ${title}, in JSON format.`
    const result = await generateGeminiText(prompt);
    try {
        return JSON.parse(result) as { summary: string; achievements: ProfessionalAchievement[] };
    } catch (e) {
        const updatedAchievements = achievements.map(ach => ({
            ...ach,
            description: `This is a mock narrative for the achievement: ${ach.description}`,
            companyLogoUrl: `https://picsum.photos/seed/${ach.organizationName}/40/40`
        }));
        return {
            summary: `This is a mock professional summary for ${name}, who is the ${title}.`,
            achievements: updatedAchievements,
        };
    }
};

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
    console.log(`Mock AI: generateQuiz for topic: ${topic}`);
    const prompt = `Generate a quiz on the topic of ${topic} in JSON format.`
    const result = await generateGeminiText(prompt);
    try {
        return JSON.parse(result) as QuizQuestion[];
    } catch (e) {
        return mockQuiz;
    }
};

export const getConceptSummary = async (concept: string): Promise<string> => {
    console.log(`Mock AI: getConceptSummary for concept: ${concept}`);
    const prompt = `Provide a summary and actionable steps for the concept '${concept}' in JSON format.`
    const result = await generateGeminiText(prompt);
    try {
        return result;
    } catch (e) {
        return "### Mock Summary\nThis is a mock summary of the concept.\n\n### Mock Actionable Steps\n- Step 1\n- Step 2";
    }
};

export const getTakeActionPlan = async (item: ScoreComponent): Promise<TakeActionPlan> => {
    console.log(`Mock AI: getTakeActionPlan for item: ${item.item}`);
    const prompt = `Generate a take action plan for the score component '${item.item}' in JSON format.`
    const result = await generateGeminiText(prompt);
    try {
        return JSON.parse(result) as TakeActionPlan;
    } catch (e) {
        return mockTakeActionPlan;
    }
};

export const getImprovementTips = async (item: ScoreComponent): Promise<ImprovementTips> => {
    console.log(`Mock AI: getImprovementTips for item: ${item.item}`);
    const prompt = `Generate improvement tips for the score component '${item.item}' in JSON format.`
    const result = await generateGeminiText(prompt);
    try {
        return JSON.parse(result) as ImprovementTips;
    } catch (e) {
        return mockImprovementTips;
    }
};

export const analyzePatentStrength = async (documentName: string, documentUrl: string): Promise<IpAnalysisReport> => {
    console.log(`Mock AI: analyzePatentStrength for document: ${documentName}`);
    const prompt = `Analyze the patent strength of the document ${documentName} at ${documentUrl} and provide a report in JSON format.`
    const result = await generateGeminiText(prompt);
    try {
        return JSON.parse(result) as IpAnalysisReport;
    } catch (e) {
        return mockIpAnalysisReport;
    }
};
