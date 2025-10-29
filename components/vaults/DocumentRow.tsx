import React, { useState, useEffect } from 'react';
import { VaultDocument } from '../../types';
import { Icon } from '../ui/Icon';
import { permissionsStore } from '../../services/permissionsStore';
import MiniScoreGauge from './MiniScoreGauge';

interface DocumentRowProps {
    document: VaultDocument;
    onShare: () => void;
    onVerify: () => void;
    onAnalyze: () => void;
}

const DocumentRow: React.FC<DocumentRowProps> = ({ document, onShare, onVerify, onAnalyze }) => {
    const [isShared, setIsShared] = useState(false);

    useEffect(() => {
        const permissions = permissionsStore.getPermissionsForDocument(document.id);
        setIsShared(permissions.length > 0);
    }, [document.id]);

    const isPatentOrTrademark = document.insights && (
        document.insights.document_type.toLowerCase().includes('patent') ||
        document.insights.document_type.toLowerCase().includes('trademark')
    );

    const isTeamDocument = document.vaultId === 'team';
    const isVerifiable = isPatentOrTrademark || isTeamDocument;

    const canBeAnalyzed = document.vaultId === 'ip' && document.verification;
    const analysisInProgress = document.ipAnalysis?.status === 'in_progress';
    const analysisComplete = document.ipAnalysis?.status === 'complete';

    return (
        <tr className="border-b border-slate-700 hover:bg-slate-800/40">
            <td className="px-6 py-4 font-medium text-white">
                <div className="flex items-center gap-2">
                    {isShared && <Icon name="team" className="w-4 h-4 text-cyan-400" title="This document is shared" />}
                    <span>{document.name}</span>
                </div>
            </td>
            <td className="px-6 py-4 text-gray-400">
                {document.insights ? (
                    <div>
                        <p className="font-semibold text-gray-300">{document.insights.document_type}</p>
                        <p className="text-xs">{document.insights.summary}</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse">
                        <Icon name="pulse" className="w-4 h-4" />
                        <span>AI Analyzing...</span>
                    </div>
                )}
                {analysisInProgress && (
                    <div className="flex items-center gap-2 text-xs text-purple-400 animate-pulse mt-1">
                        <Icon name="analyze" className="w-4 h-4" />
                        <span>Deep Analysis In Progress...</span>
                    </div>
                )}
            </td>
            <td className="px-6 py-4 text-gray-400">
                {new Date(document.uploadedAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 text-right font-mono text-gray-400">
                {document.size}
            </td>
            {document.vaultId === 'ip' && (
                <td className="px-6 py-4 text-center">
                    {analysisComplete && document.ipAnalysis?.report && (
                        <MiniScoreGauge score={document.ipAnalysis.report.score} maxScore={1000} />
                    )}
                    {analysisInProgress && (
                        <div className="flex justify-center items-center h-10 w-10">
                            <div className="animate-spin h-5 w-5 border-2 border-purple-400 border-t-transparent rounded-full"></div>
                        </div>
                    )}
                </td>
            )}
            <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-1">
                    <button onClick={onShare} className="p-2 rounded-md hover:bg-slate-700 text-gray-400 hover:text-cyan-400" title="Share Document">
                        <Icon name="share" className="w-5 h-5" />
                    </button>
                    {isVerifiable && !document.verification && (
                        <button onClick={onVerify} className="p-2 rounded-md hover:bg-slate-700 text-gray-400 hover:text-green-400" title="Verify Document">
                            <Icon name="verified" className="w-5 h-5" />
                        </button>
                    )}
                    {document.verification && (
                        <a href={document.verification.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md text-green-400" title={`Verified via ${document.verification.source}`}>
                            <Icon name="verified" className="w-5 h-5" />
                        </a>
                    )}
                    {canBeAnalyzed && !document.ipAnalysis && (
                        <button onClick={onAnalyze} className="p-2 rounded-md hover:bg-slate-700 text-gray-400 hover:text-purple-400" title="Analyze IP Strength">
                            <Icon name="analyze" className="w-5 h-5" />
                        </button>
                    )}
                    {analysisComplete && (
                         <button onClick={onAnalyze} className="p-2 rounded-md text-purple-400" title="View IP Analysis Report">
                            <Icon name="analyze" className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default DocumentRow;
