import { SavedInsight, TakeActionPlan, IpAnalysisReport } from '../types';

interface InsightStore {
    addInsight: (insight: { concept: string; aiSummary: string; takeActionPlan?: TakeActionPlan }) => void;
    addIpAnalysisInsight: (documentName: string, report: IpAnalysisReport) => void;
    getInsights: () => SavedInsight[];
}

const createInsightStore = (): InsightStore => {
    const insights: SavedInsight[] = [];

    return {
        addInsight: (insightData) => {
            // Prevent duplicates
            if (insights.some(i => i.concept === insightData.concept)) {
                console.log("Insight for this concept already saved.");
                // Overwrite with new data if it exists
                const index = insights.findIndex(i => i.concept === insightData.concept);
                insights[index] = { ...insights[index], ...insightData };
                return;
            }
            
            const newInsight: SavedInsight = {
                ...insightData,
                id: `insight-${Date.now()}`,
                timestamp: new Date().toISOString(),
            };
            insights.unshift(newInsight); // Add to the beginning of the array
        },
        addIpAnalysisInsight: (documentName, report) => {
            const concept = `IP Analysis: ${documentName}`;
            if (insights.some(i => i.concept === concept)) {
                console.log("IP Analysis for this document already saved.");
                return;
            }

            const aiSummary = `A detailed AI-powered strength analysis report for the patent "${documentName}".`;

            const newInsight: SavedInsight = {
                id: `ip-insight-${Date.now()}`,
                concept,
                aiSummary,
                ipAnalysisReport: report, // Store the full report object
                timestamp: new Date().toISOString(),
            };
            insights.unshift(newInsight);
        },
        getInsights: () => {
            return [...insights]; // Return a copy
        },
    };
};

export const insightStore = createInsightStore();
