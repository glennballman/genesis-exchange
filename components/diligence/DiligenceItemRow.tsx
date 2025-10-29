import React, { useState, useEffect } from 'react';
import { DiligenceItem, DiligenceItemStatus, SuggestedEvidence, VaultDocument } from '../../types';
import { Icon } from '../ui/Icon';
import { diligenceService } from '../../services/diligenceService';
import SelectEvidenceModal from './SelectEvidenceModal';
import { companyPrincipal } from '../../data/principals';

interface DiligenceItemRowProps {
    item: DiligenceItem;
    packageId: string;
    onUpdate: () => void;
}

const StatusBadge: React.FC<{ status: DiligenceItemStatus }> = ({ status }) => {
    const styles = {
        Pending: "bg-gray-500/10 text-gray-300",
        Suggested: "bg-blue-500/10 text-blue-300",
        Approved: "bg-green-500/10 text-green-300",
        Deferred: "bg-yellow-500/10 text-yellow-300",
        Denied: "bg-red-500/10 text-red-300",
        'Awaiting Response': "bg-purple-500/10 text-purple-300",
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
};

const DiligenceItemRow: React.FC<DiligenceItemRowProps> = ({ item, packageId, onUpdate }) => {
    const [evidence, setEvidence] = useState<SuggestedEvidence[]>(item.suggestedResponse?.evidence || []);
    const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
    const isFounderRequest = item.authorId === companyPrincipal.id;

    useEffect(() => {
        setEvidence(item.suggestedResponse?.evidence || []);
    }, [item.suggestedResponse]);

    const handleRemoveEvidence = (docId: string) => {
        const newEvidence = evidence.filter(ev => ev.documentId !== docId);
        setEvidence(newEvidence);
        diligenceService.updateItemEvidence(packageId, item.id, newEvidence);
    };

    const handleAddEvidence = (doc: VaultDocument) => {
        const newEvidenceItem: SuggestedEvidence = {
            documentId: doc.id,
            documentName: doc.name,
            relevance: "Manually added by user."
        };
        const newEvidence = [...evidence, newEvidenceItem];
        setEvidence(newEvidence);
        diligenceService.updateItemEvidence(packageId, item.id, newEvidence);
        setIsSelectModalOpen(false);
    };
    
    const handleApprove = () => {
        diligenceService.updateItemStatus(packageId, item.id, 'Approved');
        onUpdate();
    };

    const handleDefer = () => {
        diligenceService.updateItemStatus(packageId, item.id, 'Deferred');
        onUpdate();
    };

    return (
        <>
            <tr className="border-b border-slate-700">
                <td className="px-6 py-4 align-top">
                    <p className="font-medium text-white">{item.request}</p>
                    <p className={`text-xs mt-1 font-semibold ${isFounderRequest ? 'text-purple-400' : 'text-gray-400'}`}>
                        {isFounderRequest ? 'Your Request' : 'Investor Request'}
                    </p>
                </td>
                <td className="px-6 py-4 align-top">
                    {isFounderRequest ? (
                        <div className="text-sm text-gray-400 italic">Awaiting response from investor...</div>
                    ) : item.suggestedResponse ? (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-300 italic">{item.suggestedResponse.responseText}</p>
                            <ul className="space-y-2">
                                {evidence.map(ev => (
                                    <li key={ev.documentId} className="flex items-center justify-between gap-2 text-xs p-2 bg-slate-800 rounded-md group">
                                        <div className="flex items-center gap-2 truncate">
                                            <Icon name="dd" className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                                            <span className="truncate font-mono">{ev.documentName}</span>
                                        </div>
                                        <button onClick={() => handleRemoveEvidence(ev.documentId)} className="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Icon name="trash" className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => setIsSelectModalOpen(true)} className="text-xs font-semibold text-cyan-400 hover:underline">+ Add Evidence</button>
                            <div className="text-xs text-cyan-400 font-semibold pt-2 border-t border-slate-700/50">Confidence: {item.suggestedResponse.confidenceScore}%</div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-yellow-400 animate-pulse">
                            <Icon name="pulse" className="w-4 h-4" />
                            <span>AI is searching your vaults...</span>
                        </div>
                    )}
                </td>
                <td className="px-6 py-4 text-center align-top">
                    <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-4 text-center align-top">
                    <div className="flex flex-col items-center gap-2">
                        {!isFounderRequest && (
                            <>
                                <button onClick={handleApprove} className="text-xs font-semibold text-green-400 hover:underline disabled:opacity-50" disabled={item.status === 'Approved'}>Approve</button>
                                <button onClick={handleDefer} className="text-xs font-semibold text-yellow-400 hover:underline">Defer</button>
                            </>
                        )}
                        <button onClick={() => alert('Live chat feature coming soon!')} className="text-xs font-semibold text-gray-400 hover:underline">Discuss</button>
                    </div>
                </td>
            </tr>
            {isSelectModalOpen && (
                <SelectEvidenceModal
                    onClose={() => setIsSelectModalOpen(false)}
                    onSelect={handleAddEvidence}
                    currentEvidenceIds={evidence.map(e => e.documentId)}
                    requestText={item.request}
                />
            )}
        </>
    );
};

export default DiligenceItemRow;
