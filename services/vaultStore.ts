import { VaultDocument, VaultId, AIParsedInsights, IpAnalysisReport } from '../types';
import { analyzeDocument } from './geminiService';
import { scoreDataStore } from './scoreDataStore';
import { teamStore } from './teamStore';

interface VaultStore {
    getDocuments: (vaultId: VaultId) => VaultDocument[];
    getAllDocuments: () => VaultDocument[];
    addDocument: (vaultId: VaultId, file: File) => Promise<VaultDocument>;
    updateDocumentInsights: (docId: string, insights: AIParsedInsights) => void;
    verifyDocument: (documentId: string, url: string) => void;
    verifyTeamDocument: (documentId: string, userId: string, url: string) => void;
    startIpAnalysis: (documentId: string) => void;
    completeIpAnalysis: (documentId: string, report: IpAnalysisReport) => void;
    failIpAnalysis: (documentId: string, error: string) => void;
}

const initialDocuments: VaultDocument[] = [
    { id: 'doc-1', name: 'Q3-2025-P&L-Statement.xlsx', vaultId: 'financials', uploadedAt: new Date().toISOString(), size: '24KB', insights: null },
    { id: 'doc-2', name: 'Provisional-Patent-App-12345.pdf', vaultId: 'ip', uploadedAt: new Date().toISOString(), size: '1.2MB', insights: null },
    { id: 'doc-3', name: 'Employee-Handbook-v2.pdf', vaultId: 'team', uploadedAt: new Date().toISOString(), size: '450KB', insights: null },
    { id: 'doc-4', name: 'Series-A-Term-Sheet.docx', vaultId: 'legal', uploadedAt: new Date().toISOString(), size: '88KB', insights: null },
];

const createVaultStore = (): VaultStore => {
    const documents: VaultDocument[] = [...initialDocuments];

    // Simulate initial analysis for mock data
    documents.forEach(async (doc) => {
        if (!doc.insights) {
            const insights = await analyzeDocument(doc.name);
            const index = documents.findIndex(d => d.id === doc.id);
            if (index > -1) {
                documents[index].insights = insights;
            }
        }
    });

    return {
        getDocuments: (vaultId: VaultId) => {
            return documents.filter(doc => doc.vaultId === vaultId);
        },
        getAllDocuments: () => {
            return [...documents];
        },
        addDocument: async (vaultId: VaultId, file: File) => {
            const newDoc: VaultDocument = {
                id: `doc-${Date.now()}`,
                name: file.name,
                vaultId,
                uploadedAt: new Date().toISOString(),
                size: `${(file.size / 1024).toFixed(1)}KB`,
                insights: null, // Initially null, will be updated
            };
            documents.unshift(newDoc);
            
            // Asynchronously get AI insights and update the document, but don't wait for it
            analyzeDocument(file.name).then(insights => {
                const index = documents.findIndex(d => d.id === newDoc.id);
                if (index > -1) {
                    documents[index].insights = insights;
                }
            });

            return newDoc;
        },
        updateDocumentInsights: (docId, insights) => {
            const index = documents.findIndex(d => d.id === docId);
            if (index > -1) {
                documents[index].insights = insights;
            }
        },
        verifyDocument: (documentId, url) => {
            const index = documents.findIndex(d => d.id === documentId);
            if (index > -1) {
                const doc = documents[index];
                let source = 'Public Record';
                if (url.includes('patents.google.com')) {
                    source = 'Google Patents';
                } else if (url.includes('uspto.gov')) {
                    source = 'USPTO';
                }

                doc.verification = {
                    source,
                    url,
                    verifiedAt: new Date().toISOString(),
                };
                documents[index] = doc;

                // Add bonus points
                const verificationBonus = 5000;
                scoreDataStore.addVerificationBonus(doc.name, verificationBonus);
            }
        },
        verifyTeamDocument: (documentId, userId, url) => {
            const index = documents.findIndex(d => d.id === documentId);
            if (index > -1) {
                const doc = documents[index];
                let source = 'Online Profile';
                if (url.includes('linkedin.com')) {
                    source = 'LinkedIn';
                }

                doc.verification = {
                    source,
                    url,
                    verifiedAt: new Date().toISOString(),
                };
                documents[index] = doc;

                // Now, verify the user in the team store, which also handles the score bonus
                teamStore.verifyUser(userId, url);
            }
        },
        startIpAnalysis: (documentId) => {
            const index = documents.findIndex(d => d.id === documentId);
            if (index > -1) {
                documents[index].ipAnalysis = { status: 'in_progress' };
            }
        },
        completeIpAnalysis: (documentId, report) => {
            const index = documents.findIndex(d => d.id === documentId);
            if (index > -1) {
                documents[index].ipAnalysis = { status: 'complete', report };
                scoreDataStore.addIpAnalysisBonus(documents[index].name, report.score);
            }
        },
        failIpAnalysis: (documentId, error) => {
            const index = documents.findIndex(d => d.id === documentId);
            if (index > -1) {
                documents[index].ipAnalysis = { status: 'error', error };
            }
        },
    };
};

export const vaultStore = createVaultStore();
