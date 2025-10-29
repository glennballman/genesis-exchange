
import React from 'react';
import { DiligenceRequest, DiligenceStatus } from '../../types';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { performConflictCheck, synthesizeDiligenceReport } from '../../services/geminiService';
import { vaultStore } from '../../services/vaultStore';
import { permissionsStore } from '../../services/permissionsStore';

interface DiligenceRequestCardProps {
    request: DiligenceRequest;
    onUpdate: (id: string, updates: Partial<DiligenceRequest>) => void;
}

const StatusBadge: React.FC<{ status: DiligenceStatus }> = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5";
    const styles: { [key in DiligenceStatus]: string } = {
        'Pending Founder Approval': "bg-yellow-500/10 text-yellow-300",
        'Probing Conflicts': "bg-blue-500/10 text-blue-300 animate-pulse",
        'Founder Approved': "bg-green-500/10 text-green-300",
        'Founder Denied': "bg-red-500/10 text-red-300",
        'Synthesizing Report': "bg-cyan-500/10 text-cyan-300 animate-pulse",
        'Complete': "bg-gray-500/10 text-gray-300",
        'Error': "bg-red-900/20 text-red-400",
    };
    return <span className={`${baseClasses} ${styles[status]}`}>{status}</span>;
};

const DiligenceRequestCard: React.FC<DiligenceRequestCardProps> = ({ request, onUpdate }) => {
    const { id, investorId, investorName, investorAvatar, query, status, conflictCheckResult, synthesizedReport, timestamp } = request;

    const handleProbe = async () => {
        onUpdate(id, { status: 'Probing Conflicts' });
        try {
            const result = await performConflictCheck(investorName);
            onUpdate(id, { conflictCheckResult: result, status: 'Pending Founder Approval' });
        } catch (e) {
            onUpdate(id, { status: 'Error', conflictCheckResult: 'Conflict check failed.' });
        }
    };

    const handleApprove = async () => {
        onUpdate(id, { status: 'Synthesizing Report' });
        try {
            const allDocs = vaultStore.getAllDocuments();
            const investorPermissions = permissionsStore.getPermissionsForInvestor(investorId);

            let dataContext = "You have access to the following AI-parsed insights:\n\n";
            let needsRedaction = false;
            let documentsAccessed = 0;

            investorPermissions.forEach(perm => {
                const doc = allDocs.find(d => d.id === perm.documentId);
                if (doc && doc.insights) {
                    documentsAccessed++;
                    dataContext += `--- Document: ${doc.name} ---\n`;
                    dataContext += `Type: ${doc.insights.document_type}\n`;
                    dataContext += `Summary: ${doc.insights.summary}\n`;
                    dataContext += `Key Entities: ${doc.insights.key_entities.join(', ')}\n\n`;
                    if (perm.level === 'VIEW_WITH_REDACTIONS') {
                        needsRedaction = true;
                    }
                }
            });

            if (documentsAccessed === 0) {
                onUpdate(id, { synthesizedReport: "### Report Generation Failed\n\nThis investor does not have permission to view any documents relevant to this query. Please grant access via the DD Vaults.", status: 'Error' });
                return;
            }

            const report = await synthesizeDiligenceReport(query, dataContext, needsRedaction);
            onUpdate(id, { synthesizedReport: report, status: 'Complete' });
        } catch (e) {
            onUpdate(id, { status: 'Error', synthesizedReport: 'Report synthesis failed.' });
        }
    };

    const handleDeny = () => {
        onUpdate(id, { status: 'Founder Denied' });
    };

    const isProcessing = status === 'Probing Conflicts' || status === 'Synthesizing Report';

    return (
        <Card className="!p-0">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <img src={investorAvatar} alt={investorName} className="w-12 h-12 rounded-full border-2 border-gray-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-white">{investorName}</h3>
                            <p className="text-sm text-gray-400">Sent {new Date(timestamp).toLocaleString()}</p>
                        </div>
                    </div>
                    <StatusBadge status={status} />
                </div>
                <p className="mt-4 text-gray-300 italic border-l-2 border-slate-600 pl-4">"{query}"</p>
            </div>

            {conflictCheckResult && (
                <div className={`px-6 py-3 ${conflictCheckResult.startsWith('**Warning:**') ? 'bg-red-900/20' : 'bg-green-900/20'}`}>
                    <p className={`text-sm ${conflictCheckResult.startsWith('**Warning:**') ? 'text-red-300' : 'text-green-300'}`}>
                        <span className="font-bold">Conflict Probe:</span> {conflictCheckResult.replace(/\*\*/g, '')}
                    </p>
                </div>
            )}

            {status === 'Pending Founder Approval' && (
                <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex flex-wrap justify-end gap-3">
                    <button onClick={handleProbe} disabled={isProcessing} className="px-4 py-2 text-sm font-semibold text-blue-300 bg-blue-500/10 rounded-md hover:bg-blue-500/20 disabled:opacity-50 transition">
                        Probe Conflicts
                    </button>
                    <button onClick={handleDeny} disabled={isProcessing} className="px-4 py-2 text-sm font-semibold text-red-300 bg-red-500/10 rounded-md hover:bg-red-500/20 disabled:opacity-50 transition">
                        Deny
                    </button>
                    <button onClick={handleApprove} disabled={isProcessing} className="px-4 py-2 text-sm font-semibold text-green-300 bg-green-500/10 rounded-md hover:bg-green-500/20 disabled:opacity-50 transition">
                        Approve & Release Data
                    </button>
                </div>
            )}

            {synthesizedReport && (
                <div className="p-6 border-t border-slate-700">
                    <h4 className="text-md font-semibold text-white mb-3">Synthesized Report from DD Orchestrator</h4>
                    <div className="prose prose-sm prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: synthesizedReport.replace(/\n/g, '<br />').replace(/### (.*?)/g, '<h3 class="text-white font-semibold">$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
            )}
        </Card>
    );
};

export default DiligenceRequestCard;
