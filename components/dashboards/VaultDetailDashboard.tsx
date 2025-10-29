import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { vaultStore } from '../../services/vaultStore';
import { VaultDocument, VaultId, Vault } from '../../types';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import DocumentRow from '../vaults/DocumentRow';
import UploadDocumentModal from '../vaults/UploadDocumentModal';
import ShareDocumentModal from '../vaults/ShareDocumentModal';
import VerifyDocumentModal from '../vaults/VerifyDocumentModal';
import VerifyTeamMemberModal from '../vaults/VerifyTeamMemberModal';
import AnalyzeIpModal from '../vaults/AnalyzeIpModal';

const vaultsData: Vault[] = [
    { id: 'ip', name: 'IP Vault', description: 'Patents, trademarks, and trade secrets.', icon: 'ip', color: 'sky' },
    { id: 'financials', name: 'Financials Vault', description: 'P&Ls, cap tables, and funding docs.', icon: 'cfo', color: 'emerald' },
    { id: 'market', name: 'Market & Traction Vault', description: 'TAM reports, customer metrics, GTM plans.', icon: 'market', color: 'amber' },
    { id: 'team', name: 'Team & Ops Vault', description: 'Org charts, SOPs, and key contracts.', icon: 'team', color: 'rose' },
    { id: 'product', name: 'Product/Tech Vault', description: 'Architecture, security audits, roadmaps.', icon: 'cto', color: 'blue' },
    { id: 'legal', name: 'Legal & Risk Vault', description: 'Incorporation docs, litigation, ESG reports.', icon: 'regulation', color: 'indigo' },
    { id: 'exit', name: 'Exit & Strategy Vault', description: 'Exit models, M&A histories, strategic plans.', icon: 'diligence', color: 'purple' },
];

const VaultDetailDashboard: React.FC = () => {
    const { vaultId } = useParams<{ vaultId: VaultId }>();
    const [documents, setDocuments] = useState<VaultDocument[]>([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [sharingDocument, setSharingDocument] = useState<VaultDocument | null>(null);
    const [verifyingDocument, setVerifyingDocument] = useState<VaultDocument | null>(null);
    const [verifyingTeamDocument, setVerifyingTeamDocument] = useState<VaultDocument | null>(null);
    const [analyzingDocument, setAnalyzingDocument] = useState<VaultDocument | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const vaultInfo = vaultsData.find(v => v.id === vaultId);

    const refreshDocuments = () => {
        if (vaultId) {
            setDocuments(vaultStore.getDocuments(vaultId));
        }
    };

    useEffect(() => {
        refreshDocuments();
        // Set up an interval to refresh the view to catch analysis progress
        const interval = setInterval(refreshDocuments, 2000);
        return () => clearInterval(interval);
    }, [vaultId, refreshKey]);

    if (!vaultId || !vaultInfo) {
        return <div>Vault not found.</div>;
    }

    const handleUploadComplete = () => {
        setIsUploadModalOpen(false);
        setRefreshKey(prev => prev + 1);
    };

    const handleModalClose = () => {
        setSharingDocument(null);
        setVerifyingDocument(null);
        setVerifyingTeamDocument(null);
        setAnalyzingDocument(null);
        setRefreshKey(prev => prev + 1);
    };

    return (
        <>
            <div className="space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 bg-${vaultInfo.color}-500/10 rounded-lg`}>
                                <Icon name={vaultInfo.icon as any} className={`w-8 h-8 text-${vaultInfo.color}-400`} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-white">{vaultInfo.name}</h1>
                                <p className="mt-1 text-gray-400">{vaultInfo.description}</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsUploadModalOpen(true)} className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition-colors">
                        <Icon name="dd" className="w-5 h-5" />
                        Upload Documents
                    </button>
                </div>

                <Card className="!p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-slate-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">AI Insights</th>
                                    <th scope="col" className="px-6 py-3">Uploaded</th>
                                    <th scope="col" className="px-6 py-3 text-right">Size</th>
                                    {vaultId === 'ip' && <th scope="col" className="px-6 py-3 text-center">Strength Score</th>}
                                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map(doc => (
                                    <DocumentRow 
                                        key={doc.id} 
                                        document={doc} 
                                        onShare={() => setSharingDocument(doc)}
                                        onVerify={() => {
                                            if (doc.vaultId === 'team') {
                                                setVerifyingTeamDocument(doc);
                                            } else {
                                                setVerifyingDocument(doc);
                                            }
                                        }}
                                        onAnalyze={() => setAnalyzingDocument(doc)}
                                    />
                                ))}
                            </tbody>
                        </table>
                        {documents.length === 0 && (
                            <div className="text-center p-8 text-gray-500">
                                <p>No documents in this vault yet.</p>
                                <p>Click "Upload Documents" to get started.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
            {isUploadModalOpen && (
                <UploadDocumentModal
                    vaultId={vaultId}
                    onClose={() => setIsUploadModalOpen(false)}
                    onUploadComplete={handleUploadComplete}
                />
            )}
            {sharingDocument && (
                <ShareDocumentModal
                    document={sharingDocument}
                    onClose={handleModalClose}
                />
            )}
            {verifyingDocument && (
                <VerifyDocumentModal
                    document={verifyingDocument}
                    onClose={handleModalClose}
                    onVerified={handleModalClose}
                />
            )}
            {verifyingTeamDocument && (
                <VerifyTeamMemberModal
                    document={verifyingTeamDocument}
                    onClose={handleModalClose}
                    onVerified={handleModalClose}
                />
            )}
            {analyzingDocument && (
                <AnalyzeIpModal
                    document={analyzingDocument}
                    onClose={handleModalClose}
                />
            )}
        </>
    );
};

export default VaultDetailDashboard;
