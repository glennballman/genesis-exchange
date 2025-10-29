import React, { useState, useEffect } from 'react';
import { DiligencePackage, LiveAlignmentReport, Principal, InvestorProfile, DetailedInvestorAnalysis } from '../../types';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { companyPrincipal, vcFundPrincipals } from '../../data/principals';
import { missionService } from '../../services/missionService';
import { alignmentService } from '../../services/alignmentService';
import { diligenceService } from '../../services/diligenceService';

const ConfirmationCard: React.FC<{ pkg: DiligencePackage, onUpdate: () => void }> = ({ pkg, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [manualUrl, setManualUrl] = useState('');
    const profile = pkg.investorProfile;

    const handleConfirm = () => {
        const urlToConfirm = profile.preliminaryReport?.links.find(l => l.title === 'Official Website')?.url;
        if (urlToConfirm) {
            diligenceService.confirmInvestorAndAnalyze(pkg.id, urlToConfirm);
            onUpdate();
        } else {
            setIsEditing(true); // Force manual entry if no website was found
        }
    };

    const handleManualLink = () => {
        if (!manualUrl) return;
        diligenceService.confirmInvestorAndAnalyze(pkg.id, manualUrl);
        setIsEditing(false);
        onUpdate();
    };

    if (!profile.preliminaryReport) {
        return (
             <Card className={`border-blue-500/30 !p-4`}>
                <div className="flex items-center gap-4 animate-pulse">
                    <Icon name="pulse" className="w-8 h-8 text-blue-400" />
                    <div>
                        <h3 className="text-lg font-semibold text-white">Performing Background Check...</h3>
                        <p className="text-sm text-gray-400">The AI is conducting a preliminary check on {pkg.investorName}.</p>
                    </div>
                </div>
            </Card>
        )
    }
    
    const cautionScore = profile.preliminaryReport.cautionScore;
    const colorClass = cautionScore > 75 ? 'red' : cautionScore > 40 ? 'yellow' : 'green';

    return (
        <Card className={`border-${colorClass}-500/30 !p-4`}>
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <Icon name="info" className={`w-8 h-8 text-${colorClass}-400`} />
                    <div>
                        <h3 className="text-lg font-semibold text-white">Investor Verification</h3>
                        <p className="text-sm text-gray-400">Preliminary AI check for "{pkg.investorName}"</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-3xl font-bold text-${colorClass}-400`}>{cautionScore}/100</div>
                    <div className="text-xs text-gray-400">Caution Score</div>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-sm text-gray-300 italic">{profile.preliminaryReport.summary}</p>
                <div className="mt-3 border-t border-slate-700 pt-3">
                    {isEditing ? (
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-300">Manually Link to Investor Website</label>
                            <div className="flex gap-2">
                                <input type="url" placeholder="https://investor-website.com" value={manualUrl} onChange={e => setManualUrl(e.target.value)} className="w-full text-xs px-3 py-2 bg-slate-700 border border-slate-600 rounded-md" />
                                <button onClick={handleManualLink} className="px-3 py-1.5 bg-cyan-600 text-white rounded-md text-xs font-semibold">Confirm & Analyze</button>
                                <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 bg-slate-600 text-white rounded-md text-xs font-semibold">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-400">Is this the correct entity?</p>
                            <div className="flex items-center gap-2">
                                <button onClick={handleConfirm} className="text-xs font-semibold text-green-400 hover:underline">Yes, Confirm</button>
                                <span className="text-gray-600">|</span>
                                <button onClick={() => setIsEditing(true)} className="text-xs font-semibold text-yellow-400 hover:underline">No, Link Manually</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

const ConfirmedInvestorView: React.FC<{ pkg: DiligencePackage }> = ({ pkg }) => {
    const analysis = pkg.investorProfile.detailedAnalysis;
    return (
        <>
            <Card className="!p-4">
                <div className="flex items-center gap-4">
                    <Icon name="verified" className="w-8 h-8 text-green-400" />
                    <div>
                        <h3 className="text-lg font-semibold text-white">{pkg.investorName}</h3>
                        <a href={pkg.investorProfile.confirmedUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline truncate">{pkg.investorProfile.confirmedUrl}</a>
                    </div>
                </div>
            </Card>
            {!analysis ? (
                <Card>
                    <div className="flex items-center gap-4 animate-pulse">
                        <Icon name="pulse" className="w-8 h-8 text-blue-400" />
                        <div>
                            <h3 className="text-lg font-semibold text-white">Analyzing Website...</h3>
                            <p className="text-sm text-gray-400">The AI is performing a deep analysis of the confirmed website.</p>
                        </div>
                    </div>
                </Card>
            ) : (
                <Card>
                    <h3 className="text-lg font-semibold text-white mb-3">AI Website Analysis</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-300">Investment Thesis</h4>
                            <p className="text-sm text-gray-400 italic p-2 bg-slate-800/50 rounded-md">{analysis.investmentThesis}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-300">Key Personnel</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {analysis.keyPersonnel.map(p => <span key={p.name} className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded-full">{p.name} ({p.title})</span>)}
                            </div>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-300">Recent Investments</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {analysis.recentInvestments.map(inv => <span key={inv.companyName} className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded-full">{inv.companyName}</span>)}
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </>
    );
};

const AlignmentWorkspace: React.FC<{ pkg: DiligencePackage; onUpdate: () => void; }> = ({ pkg, onUpdate }) => {
    const { status } = pkg.investorProfile;

    if (status === 'GENESIS_PRINCIPAL') {
        const principal = vcFundPrincipals.find(p => p.id === pkg.investorProfile.principalId);
        return (
            <div className="p-6">
                <Card className={`border-green-500/30 !p-4`}>
                    <div className="flex items-center gap-4">
                        <Icon name="verified" className="w-8 h-8 text-green-400" />
                        <div>
                            <h3 className="text-lg font-semibold text-white">{principal?.name || pkg.investorName}</h3>
                            <p className="text-sm text-gray-400">Verified Genesis Principal</p>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    if (status === 'PENDING_VERIFICATION' || status === 'PENDING_CONFIRMATION') {
        return (
            <div className="p-6">
                <ConfirmationCard pkg={pkg} onUpdate={onUpdate} />
            </div>
        );
    }

    if (status === 'CONFIRMED') {
        return (
            <div className="p-6 space-y-6">
                <ConfirmedInvestorView pkg={pkg} />
            </div>
        );
    }

    return null;
};

export default AlignmentWorkspace;
