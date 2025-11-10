
import React, { useState, useEffect } from 'react';
import { VaultDocument, DocumentPermission, PermissionLevel, Investor } from '../../types';
import { permissionsStore } from '../../services/permissionsStore';
import { Icon } from '../ui/Icon';

interface ShareDocumentModalProps {
    document: VaultDocument;
    onClose: () => void;
}

const ShareDocumentModal: React.FC<ShareDocumentModalProps> = ({ document, onClose }) => {
    const [permissions, setPermissions] = useState<DocumentPermission[]>([]);
    const [investors, setInvestors] = useState<Investor[]>([]);
    const [selectedInvestor, setSelectedInvestor] = useState<string>('');
    const [selectedLevel, setSelectedLevel] = useState<PermissionLevel>('VIEW_ONLY');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInvestors = async () => {
        try {
            const response = await fetch('/api/investors');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setInvestors(data);
            if (data.length > 0) {
                setSelectedInvestor(data[0].id);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const refreshPermissions = () => {
        setPermissions(permissionsStore.getPermissionsForDocument(document.id));
    };

    useEffect(() => {
        fetchInvestors();
        refreshPermissions();
    }, [document.id]);

    const handleGrantAccess = () => {
        if (!selectedInvestor) return;
        permissionsStore.addPermission(document.id, selectedInvestor, selectedLevel);
        refreshPermissions();
    };

    const handleRevoke = (permissionId: string) => {
        permissionsStore.revokePermission(permissionId);
        refreshPermissions();
    };

    const getInvestorName = (investorId: string) => {
        return investors.find(inv => inv.id === investorId)?.name || 'Unknown Investor';
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Share Document</h2>
                        <p className="text-sm text-gray-400">{document.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <div className="p-6 space-y-6">
                     {loading && <p>Loading investors...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && (
                        <div>
                            <h3 className="text-md font-semibold text-white mb-2">Grant New Access</h3>
                            <div className="flex flex-col sm:flex-row gap-2 items-center bg-slate-900/50 p-3 rounded-lg">
                                <select value={selectedInvestor} onChange={(e) => setSelectedInvestor(e.target.value)} className="w-full sm:w-1/2 px-3 py-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none">
                                    {investors.map(inv => <option key={inv.id} value={inv.id}>{inv.name} ({inv.firm})</option>)}
                                </select>
                                <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value as PermissionLevel)} className="w-full sm:w-1/3 px-3 py-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none">
                                    <option value="VIEW_ONLY">View Only</option>
                                    <option value="VIEW_WITH_REDACTIONS">View with Redactions</option>
                                    <option value="FULL_ACCESS">Full Access</option>
                                </select>
                                <button onClick={handleGrantAccess} className="w-full sm:w-auto flex-grow px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500">
                                    Grant Access
                                </button>
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-md font-semibold text-white mb-2">Active Permissions</h3>
                        {permissions.length > 0 ? (
                            <ul className="space-y-2">
                                {permissions.map(perm => (
                                    <li key={perm.id} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-md">
                                        <div>
                                            <p className="font-semibold text-gray-200">{getInvestorName(perm.investorId)}</p>
                                            <p className="text-xs text-gray-400">{perm.level.replace(/_/g, ' ')}</p>
                                        </div>
                                        <button onClick={() => handleRevoke(perm.id)} className="p-2 rounded-md hover:bg-red-500/20 text-red-400">
                                            <Icon name="trash" className="w-5 h-5" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">This document has not been shared with anyone.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareDocumentModal;
