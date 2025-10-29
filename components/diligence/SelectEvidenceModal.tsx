import React, { useState, useEffect, useRef } from 'react';
import { vaultStore } from '../../services/vaultStore';
import { VaultDocument, Vault, VaultId } from '../../types';
import { permissionsStore } from '../../services/permissionsStore';
import { Icon } from '../ui/Icon';

interface SelectEvidenceModalProps {
    onClose: () => void;
    onSelect: (document: VaultDocument) => void;
    currentEvidenceIds: string[];
    requestText: string;
}

const vaultsData: Vault[] = [
    { id: 'ip', name: 'IP Vault', description: 'Patents, trademarks, and trade secrets.', icon: 'ip', color: 'sky' },
    { id: 'financials', name: 'Financials Vault', description: 'P&Ls, cap tables, and funding docs.', icon: 'cfo', color: 'emerald' },
    { id: 'market', name: 'Market & Traction Vault', description: 'TAM reports, customer metrics, GTM plans.', icon: 'market', color: 'amber' },
    { id: 'team', name: 'Team & Ops Vault', description: 'Org charts, SOPs, and key contracts.', icon: 'team', color: 'rose' },
    { id: 'product', name: 'Product/Tech Vault', description: 'Architecture, security audits, roadmaps.', icon: 'cto', color: 'blue' },
    { id: 'legal', name: 'Legal & Risk Vault', description: 'Incorporation docs, litigation, ESG reports.', icon: 'regulation', color: 'indigo' },
    { id: 'exit', name: 'Exit & Strategy Vault', description: 'Exit models, M&A histories, strategic plans.', icon: 'diligence', color: 'purple' },
];

const DocumentItem: React.FC<{ doc: VaultDocument; onSelect: (doc: VaultDocument) => void; }> = ({ doc, onSelect }) => {
    const [isShared, setIsShared] = useState(false);

    useEffect(() => {
        const permissions = permissionsStore.getPermissionsForDocument(doc.id);
        setIsShared(permissions.length > 0);
    }, [doc.id]);

    return (
        <li>
            <button onClick={() => onSelect(doc)} className="w-full text-left flex items-center justify-between gap-3 p-3 bg-slate-700/30 rounded-md hover:bg-slate-700/60 transition-colors">
                <div className="flex items-center gap-3 truncate">
                    <Icon name="dd" className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <div className="truncate">
                        <p className="font-mono text-sm text-gray-200 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-400">{doc.insights?.document_type || 'Document'}</p>
                    </div>
                </div>
                {isShared && (
                    <div className="flex-shrink-0 flex items-center gap-1 text-xs text-blue-300 bg-blue-500/10 px-2 py-1 rounded-full">
                        <Icon name="share" className="w-3 h-3" />
                        <span>Shared</span>
                    </div>
                )}
            </button>
        </li>
    );
};

const UploadForm: React.FC<{ onUploadAndSelect: (doc: VaultDocument) => void }> = ({ onUploadAndSelect }) => {
    const [file, setFile] = useState<File | null>(null);
    const [vaultId, setVaultId] = useState<VaultId>('financials');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        const newDoc = await vaultStore.addDocument(vaultId, file);
        setIsUploading(false);
        onUploadAndSelect(newDoc);
    };

    return (
        <div className="p-4 bg-slate-800/50 border-t border-slate-700 space-y-3">
            <h4 className="text-sm font-semibold text-white">Upload New Document</h4>
            <div className="grid grid-cols-2 gap-2">
                <label className="text-xs px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-gray-300 cursor-pointer hover:bg-slate-600 text-center truncate">
                    {file ? file.name : 'Choose File...'}
                    <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                </label>
                <select value={vaultId} onChange={e => setVaultId(e.target.value as VaultId)} className="w-full text-xs px-3 py-2 bg-slate-700 border border-slate-600 rounded-md">
                    {vaultsData.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
            </div>
            <button onClick={handleUpload} disabled={!file || isUploading} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 disabled:bg-gray-600">
                {isUploading ? 'Uploading...' : 'Upload & Select'}
            </button>
        </div>
    );
};

const SelectEvidenceModal: React.FC<SelectEvidenceModalProps> = ({ onClose, onSelect, currentEvidenceIds, requestText }) => {
    const [allDocs, setAllDocs] = useState<VaultDocument[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openVault, setOpenVault] = useState<VaultId | null>(null);
    const [showUpload, setShowUpload] = useState(false);

    useEffect(() => {
        setAllDocs(vaultStore.getAllDocuments());
    }, []);

    const filteredDocs = allDocs.filter(doc => 
        !currentEvidenceIds.includes(doc.id) &&
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedDocs = vaultsData.map(vault => ({
        ...vault,
        documents: filteredDocs.filter(doc => doc.vaultId === vault.id)
    })).filter(vault => vault.documents.length > 0 || searchTerm);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-700 flex-shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-semibold text-white">Select Evidence</h2>
                            <p className="text-sm text-gray-400 italic">For request: "{requestText}"</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-gray-400 hover:text-white">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                </header>
                <div className="overflow-y-auto p-4 space-y-2 flex-grow">
                    {groupedDocs.map(vault => (
                        <div key={vault.id} className="bg-slate-900/50 rounded-lg">
                            <button 
                                onClick={() => setOpenVault(openVault === vault.id ? null : vault.id)}
                                className="w-full flex justify-between items-center p-3 text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <Icon name={vault.icon as any} className={`w-5 h-5 text-${vault.color}-400`} />
                                    <span className="font-semibold text-white">{vault.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs bg-slate-700 text-gray-300 px-2 py-0.5 rounded-full">{vault.documents.length}</span>
                                    <Icon name="info" className={`w-5 h-5 text-gray-400 transition-transform ${openVault === vault.id ? 'rotate-180' : ''}`} />
                                </div>
                            </button>
                            {openVault === vault.id && (
                                <div className="p-3 border-t border-slate-700">
                                    <ul className="space-y-2">
                                        {vault.documents.map(doc => (
                                            <DocumentItem key={doc.id} doc={doc} onSelect={onSelect} />
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                     {filteredDocs.length === 0 && !showUpload && (
                        <div className="text-center text-gray-500 py-10">
                            <p>No matching documents found.</p>
                        </div>
                    )}
                </div>
                <div className="p-2 border-t border-slate-700 flex-shrink-0">
                    <button onClick={() => setShowUpload(!showUpload)} className="w-full text-center text-sm font-semibold text-cyan-400 hover:bg-slate-700/50 py-2 rounded-md">
                        {showUpload ? 'Cancel Upload' : 'Or, Upload New Document...'}
                    </button>
                </div>
                {showUpload && <UploadForm onUploadAndSelect={onSelect} />}
            </div>
        </div>
    );
};

export default SelectEvidenceModal;
