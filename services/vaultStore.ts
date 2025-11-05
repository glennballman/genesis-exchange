
import { VaultDocument, VaultId, AIParsedInsights, IpAnalysisReport } from '../types';
import { analyzeDocument } from './geminiService';
import { scoreDataStore } from './scoreDataStore';
import { teamStore } from './teamStore';

type Listener = () => void;

interface VaultStoreState {
    documents: VaultDocument[];
    loading: boolean;
    error: string | null;
}

interface VaultStore {
    getState: () => VaultStoreState;
    getDocumentsByVault: (vaultId: VaultId) => VaultDocument[];
    addDocument: (vaultId: VaultId, file: File) => Promise<void>;
    updateDocumentInsights: (docId: string, insights: AIParsedInsights) => Promise<void>;
    verifyDocument: (documentId: string, url: string) => Promise<void>;
    verifyTeamDocument: (documentId: string, userId: string, url: string) => Promise<void>;
    startIpAnalysis: (documentId: string) => Promise<void>;
    completeIpAnalysis: (documentId: string, report: IpAnalysisReport) => Promise<void>;
    failIpAnalysis: (documentId: string, error: string) => Promise<void>;
    subscribe: (listener: Listener) => () => void;
    reloadDocuments: () => Promise<void>;
}

// Placeholder for backend API URL
const API_URL = '/api/vault';

const createVaultStore = (): VaultStore => {
    let state: VaultStoreState = {
        documents: [],
        loading: true,
        error: null,
    };
    let listeners: Listener[] = [];

    const notify = () => {
        listeners.forEach(listener => listener());
    };

    const subscribe = (listener: Listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    };

    const reloadDocuments = async () => {
        state.loading = true;
        state.error = null;
        notify();
        try {
            const response = await fetch(`${API_URL}/documents`);
            if (!response.ok) throw new Error('Failed to fetch documents.');
            const documents: VaultDocument[] = await response.json();
            state.documents = documents;
        } catch (e: any) {
            state.error = e.message;
        } finally {
            state.loading = false;
            notify();
        }
    };
    
    // Initial load
    reloadDocuments();

    return {
        subscribe,
        reloadDocuments,
        getState: () => state,
        getDocumentsByVault: (vaultId: VaultId) => {
            return state.documents.filter(doc => doc.vaultId === vaultId);
        },
        addDocument: async (vaultId, file) => {
            // This is a simplified example. A real implementation would use FormData for file upload.
            const tempId = `temp-${Date.now()}`;
            const newDoc: Omit<VaultDocument, 'id'> = {
                name: file.name,
                vaultId,
                uploadedAt: new Date().toISOString(),
                size: `${(file.size / 1024).toFixed(1)}KB`,
                insights: null,
            };
            
            // Optimistic update
            state.documents.unshift({ ...newDoc, id: tempId });
            notify();

            try {
                // Replace with actual API call for file upload
                const response = await fetch(`${API_URL}/documents`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ vaultId, fileName: file.name, size: file.size }),
                });

                if (!response.ok) throw new Error('Failed to add document.');
                
                // Refresh data from server to get the real ID and details
                await reloadDocuments();

                // Trigger async analysis on the backend (the backend should handle this post-upload)

            } catch (e) {
                console.error(e);
                // Rollback optimistic update on failure
                state.documents = state.documents.filter(d => d.id !== tempId);
                notify();
            }
        },
        updateDocumentInsights: async (docId, insights) => {
            try {
                await fetch(`${API_URL}/documents/${docId}/insights`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(insights),
                });
                const index = state.documents.findIndex(d => d.id === docId);
                if (index !== -1) {
                    state.documents[index].insights = insights;
                    notify();
                }
            } catch (e) {
                console.error("Failed to update insights:", e);
            }
        },
        verifyDocument: async (documentId, url) => {
            try {
                const response = await fetch(`${API_URL}/documents/${documentId}/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url }),
                });
                if (!response.ok) throw new Error('Verification failed');
                const { verification, bonus } = await response.json();

                const index = state.documents.findIndex(d => d.id === documentId);
                if (index !== -1) {
                    state.documents[index].verification = verification;
                    scoreDataStore.addVerificationBonus(state.documents[index].name, bonus);
                    notify();
                }
            } catch (e) {
                console.error("Verification failed:", e);
            }
        },
        // This method now has a dependency on the main teamStore for the user verification part
        verifyTeamDocument: async (documentId, userId, url) => {
             try {
                // The backend should handle both document and user verification in one transaction
                const response = await fetch(`${API_URL}/documents/${documentId}/verify-team`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, url }),
                });
                 if (!response.ok) throw new Error('Team verification failed');
                 await reloadDocuments(); // Refresh vault docs
                 await teamStore.reloadTeam(); // Refresh team to reflect verification
            } catch (e) {
                console.error("Team verification failed:", e);
            }
        },
        startIpAnalysis: async (documentId) => {
            // In a real app, this would trigger a backend process
            try {
                await fetch(`${API_URL}/documents/${documentId}/ip-analysis`, { method: 'POST' });
                const index = state.documents.findIndex(d => d.id === documentId);
                if (index > -1) {
                    state.documents[index].ipAnalysis = { status: 'in_progress' };
                    notify();
                }
            } catch(e) {
                console.error("Failed to start IP analysis:", e);
            }
        },
        // These would likely be called via a webhook or a polling mechanism from the backend
        completeIpAnalysis: async (documentId, report) => {
            const index = state.documents.findIndex(d => d.id === documentId);
            if (index > -1) {
                state.documents[index].ipAnalysis = { status: 'complete', report };
                scoreDataStore.addIpAnalysisBonus(state.documents[index].name, report.score);
                notify();
            }
        },
        failIpAnalysis: async (documentId, error) => {
             const index = state.documents.findIndex(d => d.id === documentId);
            if (index > -1) {
                state.documents[index].ipAnalysis = { status: 'error', error };
                notify();
            }
        },
    };
};

export const vaultStore = createVaultStore();
