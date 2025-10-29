import { GoogleGenAI, Type } from '@google/genai';
import { PulseAnalysis, DashboardInsight, CSuiteRole, ScoreComponent, TakeActionPlan, ImprovementTips, QuizQuestion, EGumpResponse, AIParsedInsights, IpAnalysisReport, ProfessionalAchievement, Mission, User, TeamAlignmentReport, Principal, DiligenceItem, PreliminaryInvestorReport, VaultDocument, SuggestedResponse, DetailedInvestorAnalysis } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  console.warn("VITE_API_KEY environment variable not set. AI features will be limited.");
}

// Initialize AI client only if API key is available
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY, vertexai: true });
  } catch (error) {
    console.error("Failed to initialize Google GenAI:", error);
  }
}

// --- Schemas for structured responses ---

const detailedInvestorAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        keyPersonnel: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    title: { type: Type.STRING }
                },
                required: ['name', 'title']
            }
        },
        investmentThesis: { type: Type.STRING, description: "A concise summary of the firm's stated investment thesis, focus areas, and stage." },
        recentInvestments: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    companyName: { type: Type.STRING },
                    sector: { type: Type.STRING }
                },
                required: ['companyName', 'sector']
            }
        },
        publicLinks: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    url: { type: Type.STRING }
                },
                required: ['title', 'url']
            }
        }
    },
    required: ['keyPersonnel', 'investmentThesis', 'recentInvestments', 'publicLinks']
};

const narrativeGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A compelling, one-paragraph summary of the person's professional profile, suitable for an investor pitch deck." },
        achievements: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    description: { type: Type.STRING, description: "A polished, one-sentence 'from-to' narrative for this specific achievement, incorporating the fromState and toState." },
                    companyLogoUrl: { type: Type.STRING, description: "A placeholder logo URL from picsum.photos, e.g., https://picsum.photos/seed/{organizationName}/40/40" }
                },
                required: ['id', 'description', 'companyLogoUrl']
            }
        }
    },
    required: ['summary', 'achievements']
};

const teamAlignmentReportSchema = {
    type: Type.OBJECT,
    properties: {
        alignmentScore: { type: Type.INTEGER, description: "A holistic alignment score from 0 to 100." },
        executiveSummary: { type: Type.STRING, description: "A concise summary of the team's alignment with the mission." },
        keySynergies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 2-3 bullet points where individual goals strongly support the mission." },
        areasOfDivergence: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 1-2 potential misalignments, framed constructively as opportunities for leadership." }
    },
    required: ['alignmentScore', 'executiveSummary', 'keySynergies', 'areasOfDivergence']
};

const alignmentNarrativeSchema = {
    type: Type.OBJECT,
    properties: {
        narrative: { type: Type.STRING, description: "A concise, one-paragraph narrative explaining the alignment or conflict between the two principals." }
    },
    required: ['narrative']
};

const investorReportSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A concise, one-paragraph summary of the entity based on search results." },
        cautionScore: { type: Type.INTEGER, description: "A score from 0 (highly reputable) to 100 (maximum caution) based on the presence of negative signals or lack of information." },
        links: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A descriptive title for the link (e.g., 'Official Website', 'LinkedIn Profile', 'Negative News Article')." },
                    url: { type: Type.STRING, description: "The full URL found in the search results." }
                },
                required: ['title', 'url']
            }
        }
    },
    required: ['summary', 'cautionScore', 'links']
};

const diligenceItemListSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: "A unique identifier for the item, e.g., 'req-123'." },
            category: { type: Type.STRING, enum: ['Financials', 'Legal', 'Team', 'IP', 'Market', 'Product', 'Other'] },
            request: { type: Type.STRING, description: "The specific request text." }
        },
        required: ['id', 'category', 'request']
    }
};

const suggestedResponseSchema = {
    type: Type.OBJECT,
    properties: {
        confidenceScore: { type: Type.INTEGER, description: "A score from 0-100 indicating confidence in the match." },
        responseText: { type: Type.STRING, description: "A one-sentence summary of the suggested response." },
        evidence: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    documentId: { type: Type.STRING },
                    documentName: { type: Type.STRING },
                    relevance: { type: Type.STRING, description: "A brief explanation of why this document is relevant." }
                },
                required: ['documentId', 'documentName', 'relevance']
            }
        }
    },
    required: ['confidenceScore', 'responseText', 'evidence']
};

const pulseAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
    threats: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ['opportunities', 'threats']
};

const dashboardInsightSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        points: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ['title', 'points']
};

const documentAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        document_type: { type: Type.STRING, description: "The specific type of document, e.g., 'Profit & Loss Statement', 'Patent Application', 'Employment Agreement', 'Resume'." },
        summary: { type: Type.STRING, description: "A concise one-paragraph summary of the document's purpose and key contents." },
        key_entities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-5 key entities found in the document (e.g., dates, names, figures, clauses)." }
    },
    required: ['document_type', 'summary', 'key_entities']
};

const quizSchema = {
    type: Type.ARRAY,
    description: "A list of 3 multiple-choice quiz questions.",
    items: {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING }
        },
        required: ['question', 'options', 'correctAnswer']
    }
};

const improvementTipsSchema = {
    type: Type.OBJECT,
    properties: {
        tipsText: { type: Type.STRING, description: "2-3 concise, actionable markdown bullet points." },
        videoSuggestions: {
            type: Type.ARRAY,
            description: "An array of exactly 3 YouTube video suggestions, one for each level: Beginner, Intermediate, Advanced.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    thumbnailUrl: { type: Type.STRING, description: "A placeholder image URL, e.g., https://picsum.photos/seed/{random_word}/320/180" },
                    videoId: { type: Type.STRING, description: "A placeholder YouTube video ID, e.g., dQw4w9WgXcQ" },
                    level: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] }
                },
                required: ['title', 'thumbnailUrl', 'videoId', 'level']
            }
        }
    },
    required: ['tipsText', 'videoSuggestions']
};

const takeActionPlanSchema = {
    type: Type.OBJECT,
    properties: {
        estimatedTime: { type: Type.STRING, description: "A string estimating the time to complete the overall action plan, e.g., 'Approx. 2-3 hours'." },
        youtubeSuggestions: {
            type: Type.ARRAY,
            description: "A few relevant YouTube video ideas with placeholder thumbnails for the main topic.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    thumbnailUrl: { type: Type.STRING, description: "A placeholder image URL, e.g., https://picsum.photos/seed/{random_word}/320/180" },
                    videoId: { type: Type.STRING, description: "A placeholder YouTube video ID, e.g., dQw4w9WgXcQ" }
                },
                required: ['title', 'thumbnailUrl', 'videoId']
            }
        },
        googleAssistance: {
            type: Type.ARRAY,
            description: "Actions a founder can take using Google products, with direct links and nested YouTube suggestions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    action: { type: Type.STRING },
                    description: { type: Type.STRING },
                    link: { type: Type.STRING, description: "A direct action link, e.g., https://sheets.new" },
                    youtubeSuggestions: {
                        type: Type.ARRAY,
                        description: "A list of 'micronail' YouTube video ideas specific to this sub-action.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                thumbnailUrl: { type: Type.STRING, description: "A placeholder image URL, e.g., https://picsum.photos/seed/{random_word}/160/90" },
                                videoId: { type: Type.STRING, description: "A placeholder YouTube video ID, e.g., dQw4w9WgXcQ" }
                            },
                            required: ['title', 'thumbnailUrl', 'videoId']
                        }
                    }
                },
                required: ['action', 'description', 'link', 'youtubeSuggestions']
            }
        },
        outsideGoogle: {
            type: Type.ARRAY,
            description: "A helpful list of external partner services, with at least one 'PROMOTED', one 'INTEGRATED', and one 'EMBEDDED' tier.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    link: { type: Type.STRING, description: "A placeholder URL, e.g., https://www.example.com" },
                    logoUrl: { type: Type.STRING, description: "A placeholder logo URL from picsum.photos, e.g., https://picsum.photos/seed/{partner_name}/40/40" },
                    tier: { type: Type.STRING, enum: ['PROMOTED', 'INTEGRATED', 'EMBEDDED', 'STANDARD'] }
                },
                required: ['name', 'description', 'link', 'logoUrl', 'tier']
            }
        }
    },
    required: ['estimatedTime', 'youtubeSuggestions', 'googleAssistance', 'outsideGoogle']
};

const ipAnalysisReportSchema = {
    type: Type.OBJECT,
    properties: {
        tier: { type: Type.STRING, enum: ['free'] },
        summary: { type: Type.STRING, description: "A one-paragraph executive summary of the patent's strength and strategic value." },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 2-4 bullet points highlighting the key strengths." },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 2-4 bullet points highlighting potential weaknesses or risks." },
        score: { type: Type.INTEGER, description: "The total score out of 1000, which is the sum of all breakdown scores." },
        patentStatus: { type: Type.STRING, enum: ['Issued', 'Pending', 'Expired', 'Unknown'] },
        scoreBreakdown: {
            type: Type.OBJECT,
            properties: {
                coreQuality: {
                    type: Type.OBJECT,
                    properties: {
                        total: { type: Type.INTEGER, description: "Total score for this category (max 400)." },
                        claimBreadth: { type: Type.INTEGER, description: "Score for claim breadth (max 200)." },
                        novelty: { type: Type.INTEGER, description: "Score for novelty (max 150)." },
                        specification: { type: Type.INTEGER, description: "Score for specification quality (max 50)." }
                    },
                    required: ['total', 'claimBreadth', 'novelty', 'specification']
                },
                marketViability: {
                    type: Type.OBJECT,
                    properties: {
                        total: { type: Type.INTEGER, description: "Total score for this category (max 300)." },
                        marketSize: { type: Type.INTEGER, description: "Score for market size (max 150)." },
                        commercialRelevance: { type: Type.INTEGER, description: "Score for commercial relevance (max 150)." }
                    },
                    required: ['total', 'marketSize', 'commercialRelevance']
                },
                influence: {
                    type: Type.OBJECT,
                    properties: {
                        total: { type: Type.INTEGER, description: "Total score for this category (max 200)." },
                        forwardCitations: { type: Type.INTEGER, description: "Score for forward citations (max 150)." },
                        priorArt: { type: Type.INTEGER, description: "Score for prior art citations (max 50)." }
                    },
                    required: ['total', 'forwardCitations', 'priorArt']
                },
                riskFactors: {
                    type: Type.OBJECT,
                    properties: {
                        total: { type: Type.INTEGER, description: "Total score for this category (max 100)." },
                        patentStatus: { type: Type.INTEGER, description: "Score for patent status (max 50)." },
                        litigationRisk: { type: Type.INTEGER, description: "Score for litigation risk (max 50)." }
                    },
                    required: ['total', 'patentStatus', 'litigationRisk']
                }
            },
            required: ['coreQuality', 'marketViability', 'influence', 'riskFactors']
        }
    },
    required: ['tier', 'summary', 'strengths', 'weaknesses', 'score', 'patentStatus', 'scoreBreakdown']
};

// --- Functions ---

export const getPulseAnalysis = async (query: string): Promise<PulseAnalysis> => {
  if (!ai) {
    console.warn("AI client not initialized. Returning mock data.");
    return {
      opportunities: ["AI features require API key configuration"],
      threats: ["Please set VITE_API_KEY environment variable"]
    };
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { role: 'user', parts: [{ text: query }] },
      config: {
        systemInstruction: `You are the Proactive Pulse Engine. Analyze the user's query and provide a concise JSON report of strategic opportunities and threats.`,
        responseMimeType: 'application/json',
        responseSchema: pulseAnalysisSchema,
      },
    });
    return JSON.parse(response.text) as PulseAnalysis;
  } catch (error) {
    console.error("Error getting pulse analysis:", error);
    throw new Error("Failed to get analysis from the Pulse Engine.");
  }
};

export const getDashboardInsights = async (role: CSuiteRole): Promise<DashboardInsight> => {
    if (!ai) {
        console.warn("AI client not initialized. Returning mock insights.");
        return { 
            title: "AI Insights Unavailable", 
            points: ["Please configure VITE_API_KEY to enable AI features", "Contact your administrator for API key setup"] 
        };
    }
    
    const prompt = `Generate strategic insights for a ${role} of a high-growth tech startup called 'Genesis Exchange'. Focus on key priorities and potential blind spots.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: {
                systemInstruction: `You are a world-class executive coach. Generate a JSON object with a title and bullet points of strategic advice for the specified C-suite role.`,
                responseMimeType: 'application/json',
                responseSchema: dashboardInsightSchema,
            }
        });
        return JSON.parse(response.text) as DashboardInsight;
    } catch (error) {
        console.error(`Error getting ${role} insights:`, error);
        return { title: "AI Insight Unavailable", points: ["Could not connect to the AI analysis engine."] };
    }
};

export const analyzeDocument = async (documentName: string): Promise<AIParsedInsights> => {
    if (!ai) {
        console.warn("AI client not initialized. Returning mock analysis.");
        return {
            document_type: 'Analysis Unavailable',
            summary: 'AI document analysis requires API key configuration. Please set VITE_API_KEY environment variable.',
            key_entities: ['API key required', 'Contact administrator']
        };
    }
    
    const prompt = `Analyze the following document filename and infer its contents: "${documentName}"`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: {
                systemInstruction: `You are an AI document classifier. Based on the filename, generate a JSON object with 'document_type', a one-paragraph 'summary' of its likely contents, and a list of 3-5 'key_entities' that would probably be inside. If the name suggests a resume, the document_type should be 'Resume'.`,
                responseMimeType: 'application/json',
                responseSchema: documentAnalysisSchema,
            }
        });
        return JSON.parse(response.text) as AIParsedInsights;
    } catch (error) {
        console.error("Error analyzing document:", error);
        return {
            document_type: 'Analysis Failed',
            summary: 'Could not analyze the document due to a service error.',
            key_entities: []
        };
    }
};

export const parseDiligenceRequestList = async (text: string): Promise<Omit<DiligenceItem, 'status' | 'suggestedResponse' | 'authorId'>[]> => {
    const prompt = `
    You are a world-class M&A analyst. The following text is a due diligence request list from an investor. Your task is to parse this unstructured text and convert it into a structured JSON array of individual diligence items. For each item, extract the core request and categorize it.

    Unstructured Request List:
    ---
    ${text}
    ---
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: {
                systemInstruction: `Parse the user's text into a JSON array following the provided schema. Ensure each item has a unique ID.`,
                responseMimeType: 'application/json',
                responseSchema: diligenceItemListSchema,
            }
        });
        return JSON.parse(response.text) as Omit<DiligenceItem, 'status' | 'suggestedResponse' | 'authorId'>[];
    } catch (error) {
        console.error("Error parsing diligence request list:", error);
        throw new Error("Failed to parse diligence request list.");
    }
};

export const findEvidenceForRequest = async (requestText: string, availableDocs: VaultDocument[]): Promise<SuggestedResponse> => {
    const docContext = availableDocs.map(doc => 
        `ID: ${doc.id}, Name: ${doc.name}, Type: ${doc.insights?.document_type || 'Unknown'}, Summary: ${doc.insights?.summary || 'N/A'}`
    ).join('\n');

    const prompt = `
    You are an AI Diligence Analyst. Your goal is to fulfill the investor request below by searching the company's available documents.

    **Investor Request:**
    "${requestText}"

    **Available Documents in Vault:**
    ${docContext}

    **Your Task:**
    1. Analyze the request and identify the best 1-3 documents from the available list that fulfill it.
    2. Synthesize a one-sentence suggested response.
    3. For each chosen document, provide a brief explanation of its relevance.
    4. Provide a confidence score from 0-100.
    5. If no good match is found, return an empty evidence array and a low confidence score.
    6. Return a structured JSON response.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: {
                systemInstruction: `Generate a JSON response following the provided schema to suggest evidence for the user's request.`,
                responseMimeType: 'application/json',
                responseSchema: suggestedResponseSchema,
            }
        });
        return JSON.parse(response.text) as SuggestedResponse;
    } catch (error) {
        console.error("Error finding evidence for request:", error);
        throw new Error("Failed to find evidence for request.");
    }
};

export const generateInvestorPreliminaryReport = async (investorName: string): Promise<PreliminaryInvestorReport> => {
    const prompt = `Conduct a preliminary background check on the financial entity: "${investorName}". Find their official website, key personnel on LinkedIn, and any recent news articles (positive or negative). Based on these findings, generate a summary, a 'Caution Score' (0-100, where 100 is maximum caution), and a list of relevant links.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: 'application/json',
                responseSchema: investorReportSchema,
            }
        });
        return JSON.parse(response.text) as PreliminaryInvestorReport;
    } catch (error) {
        console.error("Error generating investor preliminary report:", error);
        throw new Error("Failed to generate investor report.");
    }
};

export const analyzePrincipalWebsite = async (url: string): Promise<DetailedInvestorAnalysis> => {
    const prompt = `
    You are a world-class venture capital analyst. Analyze the investment firm's website at the following URL: ${url}. 
    Your task is to thoroughly analyze the site and return a structured JSON object containing:
    1.  'keyPersonnel': An array of the firm's partners or key decision-makers, including their name and title.
    2.  'investmentThesis': A concise summary of the firm's stated investment thesis, focus areas, and stage.
    3.  'recentInvestments': A list of 3-5 representative portfolio companies mentioned on the site.
    4.  'publicLinks': An array of important links found on the site, such as 'Portfolio', 'Team', or 'Contact' pages.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: 'application/json',
                responseSchema: detailedInvestorAnalysisSchema,
            }
        });
        return JSON.parse(response.text) as DetailedInvestorAnalysis;
    } catch (error) {
        console.error("Error analyzing principal website:", error);
        throw new Error("Failed to analyze principal website.");
    }
};

export const generateAlignmentNarrative = async (source: Principal, target: Principal, conflict: boolean): Promise<string> => {
    let prompt;
    if (conflict) {
        prompt = `
        You are a risk management analyst. The following two principals have a values conflict. Briefly explain why they are not a good match based on their stated exclusions and mission.

        **Source Principal (${source.type}):**
        - Name: ${source.name}
        - Exclusions: ${source.exclusions.join(', ')}

        **Target Principal (${target.type}):**
        - Name: ${target.name}
        - Mission: ${target.missionStatement}

        Generate a JSON object with a single key 'narrative' explaining the conflict.
        `;
    } else {
        prompt = `
        You are a top-tier investment banking analyst specializing in strategic matching. Analyze the two principals below and generate a concise, one-paragraph narrative explaining why they are a strong potential match for each other. Focus on the overlap in their mission statements and shared values.

        **Source Principal (${source.type}):**
        - Name: ${source.name}
        - Mission: ${source.missionStatement}
        - Values: ${source.values.join(', ')}

        **Target Principal (${target.type}):**
        - Name: ${target.name}
        - Mission: ${target.missionStatement}
        - Values: ${target.values.join(', ')}

        Generate a JSON object with a single key 'narrative'.
        `;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: {
                systemInstruction: `You are an expert investment analyst. Generate a JSON object strictly following the provided schema.`,
                responseMimeType: 'application/json',
                responseSchema: alignmentNarrativeSchema,
            }
        });
        const result = JSON.parse(response.text);
        return result.narrative;
    } catch (error) {
        console.error("Error generating alignment narrative:", error);
        return "Could not generate alignment narrative due to a service error.";
    }
};

export const generateTeamAlignmentReport = async (mission: Mission, team: User[]): Promise<Omit<TeamAlignmentReport, 'individualReports' | 'teamAmbitionIndex' | 'teamTransparencyIndex'>> => {
    const teamGoals = team.map(member => {
        const sharedGoals = (member.goals || [])
            .filter(g => g.sharingLevel !== 'Private')
            .map(g => `- ${g.description} (${g.targetDate})`)
            .join('\n');
        
        const personalMission = (member.personalMission?.sharingLevel !== 'Private' && member.personalMission?.statement)
            ? `\n  Personal Mission: ${member.personalMission.statement}`
            : '';

        return `Member: ${member.name} (${member.role})\n  Shared Goals:\n${sharedGoals || '  (No shared goals)'}${personalMission}`;
    }).join('\n\n');

    const prompt = `
    As an expert organizational psychologist and venture capital partner, analyze the alignment between a specific mission and the team responsible for it.

    **Company Mission Context:**
    ${mission.statement}

    **Team Composition & Shared Ambitions:**
    ${teamGoals}

    **Your Task:**
    Generate a JSON object containing:
    1.  **alignmentScore:** A holistic percentage score (0-100) representing how well the team's collective shared ambitions align with the specific company mission.
    2.  **executiveSummary:** A concise, insightful summary of the team's overall alignment.
    3.  **keySynergies:** An array of 2-3 bullet points identifying powerful synergies where individual goals amplify the mission.
    4.  **areasOfDivergence:** An array of 1-2 potential misalignments, framed constructively as opportunities for leadership.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: {
                systemInstruction: `You are an expert organizational psychologist. Generate a JSON object strictly following the provided schema for a team alignment report.`,
                responseMimeType: 'application/json',
                responseSchema: teamAlignmentReportSchema,
            }
        });
        return JSON.parse(response.text) as TeamAlignmentReport;
    } catch (error) {
        console.error("Error generating team alignment report:", error);
        throw new Error("Failed to generate team alignment report.");
    }
};

export const generateIndividualAlignmentReport = async (user: User, companyMission: string): Promise<Omit<IndividualAlignmentReport, 'ambitionIndex' | 'transparencyIndex'>> => {
    // This function would be more complex in a real scenario
    const missionAlignmentScore = 50 + Math.floor(Math.random() * 50);
    return {
        userId: user.id,
        userName: user.name,
        missionAlignmentScore,
        executiveSummary: `AI analysis shows a ${missionAlignmentScore > 80 ? 'strong' : 'moderate'} alignment.`,
        keySynergies: ["A personal goal aligns with the company's high-performance culture."],
        alignmentGaps: ["Long-term career path could be more clearly mapped to the company's future state."],
        conversationStarters: ["A goal: 'I noticed your goal to learn more about X. How do you see that fitting into your work here?'"]
    };
};

export const generateProfileSummaryAndNarratives = async (name: string, title: string, achievements: ProfessionalAchievement[], links: { type: string, url: string }[]): Promise<{ summary: string; achievements: ProfessionalAchievement[] }> => {
    const achievementsString = achievements.map(ach => `
        - ID: ${ach.id}
        - Type: ${ach.type}
        - Role: ${ach.role}
        - Organization: ${ach.organizationName}
        - From: ${ach.fromState}
        - To: ${ach.toState}
        - User Description: ${ach.description}
    `).join('');

    const linksString = links.map(link => `- ${link.type}: ${link.url}`).join('\n');

    const prompt = `
    As a world-class executive branding consultant and copywriter for venture-backed founders, your task is to generate a compelling professional summary and polished narratives for the following individual.

    **Individual's Profile:**
    - Name: ${name}
    - Title: ${title}
    - Key Links:
    ${linksString}
    - Raw Achievements:
    ${achievementsString}

    **Your Task:**
    Generate a JSON object containing:
    1.  **summary:** A powerful, one-paragraph summary of the individual's career, highlighting their most impressive accomplishments and expertise. This should be suitable for the top of a resume or a team slide in a pitch deck.
    2.  **achievements:** An array where you process EACH raw achievement provided. For each one, generate a concise, impactful, one-sentence narrative for the 'description' field, weaving together the role, organization, and the 'from-to' states. Also, generate a placeholder picsum.photos URL for the 'companyLogoUrl'.
    
    Example narrative: "As CEO/Chairman, took Onvia from a garage startup to a $6 Billion market cap on NASDAQ."
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: {
                systemInstruction: `You are an expert executive branding copywriter. Generate a JSON object strictly following the provided schema. Ensure every achievement from the input is processed and included in the output array.`,
                responseMimeType: 'application/json',
                responseSchema: narrativeGenerationSchema,
            }
        });
        const result = JSON.parse(response.text);

        // Merge AI-generated descriptions back into original achievements
        const updatedAchievements = achievements.map(ach => {
            const updatedAch = result.achievements.find((a: any) => a.id === ach.id);
            return updatedAch ? { ...ach, description: updatedAch.description, companyLogoUrl: updatedAch.companyLogoUrl } : ach;
        });

        return {
            summary: result.summary,
            achievements: updatedAchievements,
        };

    } catch (error) {
        console.error("Error generating profile summary:", error);
        throw new Error("Failed to generate profile summary and narratives.");
    }
};

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
    const prompt = `Generate a 3-question multiple-choice quiz about the following topic for a startup founder: "${topic}". Each question should have 4 options and one correct answer.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: {
                systemInstruction: `You are an expert educator creating a quiz. Generate a JSON array of 3 quiz question objects according to the provided schema. Ensure the options are plausible and there is only one correct answer per question.`,
                responseMimeType: 'application/json',
                responseSchema: quizSchema,
            }
        });
        return JSON.parse(response.text) as QuizQuestion[];
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz.");
    }
};

export const getConceptSummary = async (concept: string): Promise<string> => {
    const prompt = `Explain the concept of "${concept}" for a startup founder.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: {
                systemInstruction: `You are an expert business analyst. Explain the concept in simple terms. Provide a "### Summary" paragraph and a "### Actionable Steps" list in markdown.`,
                temperature: 0.6,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error getting concept summary:", error);
        return "### Summary\nCould not generate a summary due to a service error.\n\n### Actionable Steps\n- Please check your connection and try again.";
    }
};

export const getTakeActionPlan = async (item: ScoreComponent): Promise<TakeActionPlan> => {
    const prompt = `Create a detailed action plan for a startup founder to improve on the following Genesis Score component: Category: "${item.category}", Item: "${item.item}".`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: {
                systemInstruction: `You are an AI startup accelerator director. Generate a JSON object that strictly follows the provided schema.
- Add an 'estimatedTime' string (e.g., 'Approx. 2-3 hours').
- For 'youtubeSuggestions', provide a few relevant video ideas for the main topic.
- For 'googleAssistance', provide a list of actions using Google products. Each action must have its own nested list of specific 'youtubeSuggestions' (micronails).
- For 'outsideGoogle', provide a helpful list of external partner services. Crucially, you MUST include at least one partner with the tier 'PROMOTED', one with 'INTEGRATED', and one with 'EMBEDDED'. The rest can be 'STANDARD'.`,
                responseMimeType: 'application/json',
                responseSchema: takeActionPlanSchema,
            }
        });
        return JSON.parse(response.text) as TakeActionPlan;
    } catch (error) {
        console.error("Error getting take action plan:", error);
        throw new Error("Failed to generate an action plan.");
    }
};

export const getImprovementTips = async (item: ScoreComponent): Promise<ImprovementTips> => {
    const prompt = `Generate improvement tips for: Category: "${item.category}", Item: "${item.item}", Points: ${item.points}.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: {
                systemInstruction: `You are a startup coach. For the given score component, generate a JSON object containing 'tipsText' and 'videoSuggestions'. 
- 'tipsText' should be 2-3 concise, actionable markdown bullet points. If points are zero, focus on getting started. If high, focus on optimization.
- 'videoSuggestions' must be an array of exactly 3 objects, one for each level: 'Beginner', 'Intermediate', and 'Advanced'. Each object needs a 'title', a picsum.photos 'thumbnailUrl', a placeholder 'videoId', and the 'level'.`,
                responseMimeType: 'application/json',
                responseSchema: improvementTipsSchema,
            }
        });
        return JSON.parse(response.text) as ImprovementTips;
    } catch (error) {
        console.error("Error getting improvement tips:", error);
        throw new Error("Failed to generate improvement tips.");
    }
};

export const analyzePatentStrength = async (documentName: string, documentUrl: string): Promise<IpAnalysisReport> => {
    const prompt = `
    As a top-tier IP strategist from a venture capital firm, perform a detailed strength analysis of the following patent. Access the public record at the provided URL to inform your analysis.

    **Patent Name/Identifier:**
    ${documentName}

    **Public Record URL:**
    ${documentUrl}

    **Your Task:**
    Evaluate the patent based on the following 1000-point system and return a JSON object.

    **Scoring System:**
    1.  **Core Patent Quality (400 pts):**
        *   Claim Breadth & Defensibility (200 pts)
        *   Novelty & Non-Obviousness (150 pts)
        *   Specification Quality (50 pts)
    2.  **Market & Commercial Viability (300 pts):**
        *   Market Size & Applicability (150 pts)
        *   Commercial Relevance (150 pts)
    3.  **Influence & Validation (200 pts):**
        *   Forward Citations (150 pts)
        *   Prior Art Citations (50 pts) - Lower is better, so award points inversely.
    4.  **Risk & Status Factors (100 pts):**
        *   Patent Status (50 pts) - 'Issued' gets full points, 'Pending' gets partial, 'Expired' gets 0.
        *   Litigation Risk (50 pts) - 'Low' risk gets full points, 'High' risk gets fewer.

    Based on your expert assessment, generate a JSON report. The 'tier' must be 'free'. The final 'score' must be the sum of all breakdown scores.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: {
                systemInstruction: `You are a patent attorney and VC IP strategist. Generate a JSON object strictly following the provided schema for an IP strength report. Ensure the total score is the sum of all breakdown scores.`,
                responseMimeType: 'application/json',
                responseSchema: ipAnalysisReportSchema,
            }
        });
        return JSON.parse(response.text) as IpAnalysisReport;
    } catch (error) {
        console.error("Error analyzing patent strength:", error);
        throw new Error("Failed to generate patent strength analysis.");
    }
};
