
import { GoogleGenAI, Type } from '@google/genai';
import { PulseAnalysis, DashboardInsight, CSuiteRole, ScoreComponent, TakeActionPlan, ImprovementTips, QuizQuestion, EGumpResponse, AIParsedInsights, IpAnalysisReport, ProfessionalAchievement, Mission, User, TeamAlignmentReport, Principal, DiligenceItem, PreliminaryInvestorReport, VaultDocument, SuggestedResponse, DetailedInvestorAnalysis, IndividualGumpScore } from '../types';

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
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const data = await response.json();
    if (!data.generated_text) {
        throw new Error("Received empty or invalid response from AI service.");
    }
    return data.generated_text;
  } catch (error) {
    console.error("Failed to generate text from Gemini API:", error);
    throw error; // Re-throw to be caught by the calling function
  }
};

// --- Helper for cleaning AI responses ---
const cleanAndParseJson = <T>(rawText: string): T => {
    const cleanedText = rawText.replace(/```json\n|```/g, '').trim();
    return JSON.parse(cleanedText) as T;
}

// --- Mock Data and Schemas (used as fallback) ---

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

const mockIndividualGumpScore: IndividualGumpScore = {
    total: 450,
    provenExecution: {
        total: 200,
        exits: 0,
        scaling: 150,
        capitalGovernance: 50,
    },
    pillarsOfPotential: {
        total: 250,
        disciplineGrit: 100,
        intellectualHorsepower: 80,
        ambition: 70,
    },
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

// --- Live AI Functions with Mock Fallbacks ---

export const calculateIGS = async (achievements: ProfessionalAchievement[]): Promise<IndividualGumpScore> => {
    console.log(`AI Service: Calculating IGS for ${achievements.length} achievements.`);
    const achievementText = achievements.map(a => `- ${a.description}`).join('\n');
    const prompt = `
        Analyze the following professional achievements and calculate an Individual GUMP Score (IGS).
        The user has provided the following achievements:
        ${achievementText}
        Please respond with ONLY a JSON object in the following format, with your calculated scores:
        {
            "total": number, "provenExecution": {"total": number, "exits": number, "scaling": number, "capitalGovernance": number},
            "pillarsOfPotential": {"total": number, "disciplineGrit": number, "intellectualHorsepower": number, "ambition": number}
        }
    `;
    try {
        const result = await generateGeminiText(prompt);
        return cleanAndParseJson<IndividualGumpScore>(result);
    } catch (e) {
        console.error("Failed to parse IGS response from AI. Returning mock score.", e);
        return mockIndividualGumpScore;
    }
};

export const getPulseAnalysis = async (query: string): Promise<PulseAnalysis> => {
  console.log(`AI Service: getPulseAnalysis called with query: ${query}`);
  const prompt = `Analyze our application's status based on this query: "${query}" and provide a pulse analysis. Respond in JSON format: {"opportunities": string[], "threats": string[]}`;
  try {
    const result = await generateGeminiText(prompt);
    return cleanAndParseJson<PulseAnalysis>(result);
  } catch (e) {
    console.error("Failed to get pulse analysis from AI. Returning mock data.", e);
    return mockPulseAnalysis;
  }
};

export const getDashboardInsights = async (role: CSuiteRole): Promise<DashboardInsight> => {
    console.log(`AI Service: getDashboardInsights called for role: ${role}`);
    const prompt = `Generate 2-3 key dashboard insights for a ${role} of a tech startup. Respond in JSON format: {"title": string, "points": string[]}`;
    try {
        const result = await generateGeminiText(prompt);
        return cleanAndParseJson<DashboardInsight>(result);
    } catch (e) {
        console.error("Failed to get dashboard insights from AI. Returning mock data.", e);
        return mockDashboardInsight;
    }
};

export const analyzeDocument = async (documentName: string): Promise<AIParsedInsights> => {
    console.log(`AI Service: analyzeDocument called for document: ${documentName}`);
    const prompt = `Analyze the document named "${documentName}" and provide a brief summary and key entities. Respond in JSON format: {"document_type": string, "summary": string, "key_entities": string[]}`;
    try {
        const result = await generateGeminiText(prompt);
        return cleanAndParseJson<AIParsedInsights>(result);
    } catch (e) {
        console.error("Failed to analyze document with AI. Returning mock data.", e);
        if (documentName.toLowerCase().includes('resume')) {
            return { ...mockAIParsedInsights, document_type: 'Resume' };
        }
        return mockAIParsedInsights;
    }
};

export const parseDiligenceRequestList = async (text: string): Promise<Omit<DiligenceItem, 'status' | 'suggestedResponse' | 'authorId'>[]> => {
    console.log(`AI Service: parseDiligenceRequestList called.`);
    const prompt = `Parse the following text which contains a list of due diligence requests from an investor. Extract each distinct request. For each request, assign a category: 'Financials', 'Team', 'IP', 'Traction', 'Market', or 'Other'. Respond with ONLY a JSON array in the format: [{"id": string, "category": string, "request": string}]. The ID should be a short, unique string like 'req-1', 'req-2', etc. Text: ${text}`;
    try {
        const result = await generateGeminiText(prompt);
        return cleanAndParseJson<Omit<DiligenceItem, 'status' | 'suggestedResponse' | 'authorId'>[]>(result);
    } catch (e) {
        console.error("Failed to parse diligence list from AI. Returning mock data.", e);
        return mockDiligenceItems;
    }
};

export const findEvidenceForRequest = async (requestText: string, availableDocs: VaultDocument[]): Promise<SuggestedResponse> => {
    console.log(`AI Service: findEvidenceForRequest called for request: ${requestText}`);
    const docList = availableDocs.map(d => `{"documentId": "${d.id}", "documentName": "${d.name}"}`).join(', ');
    const prompt = `An investor is asking: "${requestText}". I have the following documents in my vault: [${docList}]. First, formulate a concise, direct response to the investor's question based on the document list. Second, identify the top 1-3 most relevant documents from the list as evidence. Respond with ONLY a JSON object in the format: {"confidenceScore": number, "responseText": string, "evidence": [{"documentId": string, "documentName": string, "relevance": string}]}. The confidence score (0-100) should represent how well you can answer the request with the given documents.`;
    try {
        const result = await generateGeminiText(prompt);
        return cleanAndParseJson<SuggestedResponse>(result);
    } catch (e) {
        console.error("Failed to find evidence with AI. Returning mock data.", e);
        return mockSuggestedResponse;
    }
};

export const generateInvestorPreliminaryReport = async (investorName: string): Promise<PreliminaryInvestorReport> => {
    console.log(`AI Service: generateInvestorPreliminaryReport called for investor: ${investorName}`);
    const prompt = `Generate a brief preliminary report on the investment entity "${investorName}". Include a short summary, a "caution score" (0-100, where higher is more cautious), and up to 3 relevant public links (e.g., website, Crunchbase, etc.). Respond with ONLY a JSON object in the format: {"summary": string, "cautionScore": number, "links": [{"title": string, "url": string}]}`;
    try {
        const result = await generateGeminiText(prompt);
        return cleanAndParseJson<PreliminaryInvestorReport>(result);
    } catch (e) {
        console.error("Failed to generate investor report from AI. Returning mock data.", e);
        return mockPreliminaryInvestorReport;
    }
};

export const analyzePrincipalWebsite = async (url: string): Promise<DetailedInvestorAnalysis> => {
    console.log(`AI Service: analyzePrincipalWebsite called for URL: ${url}`);
    const prompt = `Analyze the investor website at ${url}. Extract key personnel (name, title), summarize their investment thesis, list a few recent investments (company name, sector), and find relevant public links. Respond with ONLY a JSON object in the format: {"keyPersonnel": [{"name": string, "title": string}], "investmentThesis": string, "recentInvestments": [{"companyName": string, "sector": string}], "publicLinks": [{"title": string, "url": string}]}`;
    try {
        const result = await generateGeminiText(prompt);
        return cleanAndParseJson<DetailedInvestorAnalysis>(result);
    } catch (e) {
        console.error("Failed to analyze principal website with AI. Returning mock data.", e);
        return mockDetailedInvestorAnalysis;
    }
};

export const generateAlignmentNarrative = async (source: Principal, target: Principal, conflict: boolean): Promise<string> => {
    console.log(`AI Service: generateAlignmentNarrative called.`);
    const prompt = `Generate a short (2-3 sentence) narrative explaining the ${conflict ? 'conflict points' : 'synergies'} between ${source.name} and ${target.name}.`;
    try {
        return await generateGeminiText(prompt);
    } catch (e) {
        console.error("Failed to generate alignment narrative from AI. Returning mock data.", e);
        return conflict 
        ? "This is a mock narrative explaining a conflict."
        : "This is a mock narrative explaining a strong alignment.";
    }
};

export const generateTeamAlignmentReport = async (mission: Mission, team: User[]): Promise<Omit<TeamAlignmentReport, 'individualReports' | 'teamAmbitionIndex' | 'teamTransparencyIndex'>> => {
    console.log(`AI Service: generateTeamAlignmentReport called.`);
    const prompt = `Generate a team alignment report for a team with the mission "${mission.statement}". Provide an executive summary, key synergies, and areas of divergence. Respond in JSON format: {"alignmentScore": number, "executiveSummary": string, "keySynergies": string[], "areasOfDivergence": string[]}`;
    try {
        const result = await generateGeminiText(prompt);
        return cleanAndParseJson<Omit<TeamAlignmentReport, 'individualReports' | 'teamAmbitionIndex' | 'teamTransparencyIndex'>>(result);
    } catch (e) {
        console.error("Failed to generate team alignment report from AI. Returning mock data.", e);
        return mockTeamAlignmentReport;
    }
};

export const generateIndividualAlignmentReport = async (user: User, companyMission: string): Promise<Omit<IndividualAlignmentReport, 'ambitionIndex' | 'transparencyIndex'>> => {
    console.log(`AI Service: generateIndividualAlignmentReport for user: ${user.name}`);
    const prompt = `Generate an individual alignment report for ${user.name} with the company mission "${companyMission}". Provide a summary, synergies, gaps, and conversation starters. Respond in JSON format: {"userId": string, "userName": string, "missionAlignmentScore": number, "executiveSummary": string, "keySynergies": string[], "alignmentGaps": string[], "conversationStarters": string[]}`;
    try {
        const result = await generateGeminiText(prompt);
        return cleanAndParseJson<Omit<IndividualAlignmentReport, 'ambitionIndex' | 'transparencyIndex'>>(result);
    } catch (e) {
        console.error("Failed to generate individual alignment report from AI. Returning mock data.", e);
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
    console.log(`AI Service: generateProfileSummaryAndNarratives for: ${name}`);
    const prompt = `Generate a professional summary and enhance achievement descriptions for ${name}, the ${title}. Respond in JSON format: {"summary": string, "achievements": [{"description": string, "organizationName": string, ...}]}`;
    try {
        const result = await generateGeminiText(prompt);
        return cleanAndParseJson<{ summary: string; achievements: ProfessionalAchievement[] }>(result);
    } catch (e) {
        console.error("Failed to generate profile summary from AI. Returning mock data.", e);
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
    console.log(`AI Service: generateQuiz for topic: ${topic}`);
    const prompt = `Generate a multiple-choice quiz on the topic of ${topic}. Respond in JSON format: [{"question": string, "options": string[], "correctAnswer": string}]`;
    try {
        const result = await generateGeminiText(prompt);
        return cleanAndParseJson<QuizQuestion[]>(result);
    } catch (e) {
        console.error("Failed to generate quiz from AI. Returning mock data.", e);
        return mockQuiz;
    }
};

export const getConceptSummary = async (concept: string): Promise<string> => {
    console.log(`AI Service: getConceptSummary for concept: ${concept}`);
    const prompt = `Provide a summary and actionable steps for the concept '${concept}'. Respond in Markdown format.`;
    try {
        return await generateGeminiText(prompt);
    } catch (e) {
        console.error("Failed to get concept summary from AI. Returning mock data.", e);
        return "### Mock Summary\nThis is a mock summary of the concept.\n\n### Mock Actionable Steps\n- Step 1\n- Step 2";
    }
};

export const getTakeActionPlan = async (item: ScoreComponent): Promise<TakeActionPlan> => {
    console.log(`AI Service: getTakeActionPlan for item: ${item.item}`);
    const prompt = `Generate a "Take Action Plan" for improving the score component '${item.item}'. Include time estimates and resource links. Respond in JSON format: {"estimatedTime": string, "youtubeSuggestions": [], "googleAssistance": [], "outsideGoogle": []}`;
    try {
        const result = await generateGeminiText(prompt);
        return cleanAndParseJson<TakeActionPlan>(result);
    } catch (e) {
        console.error("Failed to get action plan from AI. Returning mock data.", e);
        return mockTakeActionPlan;
    }
};

export const getImprovementTips = async (item: ScoreComponent): Promise<ImprovementTips> => {
    console.log(`AI Service: getImprovementTips for item: ${item.item}`);
    const prompt = `Generate improvement tips for the score component '${item.item}'. Respond in JSON format: {"tipsText": string, "videoSuggestions": []}`;
    try {
        const result = await generateGeminiText(prompt);
        return cleanAndParseJson<ImprovementTips>(result);
    } catch (e) {
        console.error("Failed to get improvement tips from AI. Returning mock data.", e);
        return mockImprovementTips;
    }
};

export const analyzePatentStrength = async (documentName: string, documentUrl: string): Promise<IpAnalysisReport> => {
    console.log(`AI Service: analyzePatentStrength for document: ${documentName}`);
    const prompt = `Analyze the patent strength of the document ${documentName} found at ${documentUrl}. Provide a detailed report. Respond in JSON format: {"tier": string, "summary": string, "strengths": string[], "weaknesses": string[], "score": number, ...}`;
    try {
        const result = await generateGeminiText(prompt);
        return cleanAndParseJson<IpAnalysisReport>(result);
    } catch (e) {
        console.error("Failed to analyze patent strength with AI. Returning mock data.", e);
        return mockIpAnalysisReport;
    }
};
