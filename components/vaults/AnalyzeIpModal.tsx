import React, { useState, useEffect } from 'react';
import { VaultDocument, IpAnalysisReport, IpAnalysisScoreBreakdown } from '../../types';
import { vaultStore } from '../../services/vaultStore';
import { analyzePatentStrength } from '../../services/geminiService';
import { insightStore } from '../../services/insightStore';
import { Icon } from '../ui/Icon';
import UpgradeOptions from '../insights/UpgradeOptions';

interface AnalyzeIpModalProps {
    document: VaultDocument;
    onClose: () => void;
}

const loadingMessages = [
    "Accessing public patent records...",
    "Evaluating claim novelty and breadth...",
    "Cross-referencing prior art databases...",
    "Analyzing citation velocity and influence...",
    "Assessing commercial viability and market landscape...",
    "Compiling final report...",
];

const RadialGauge: React.FC<{ score: number; maxScore: number; label: string; colorClass: string }> = ({ score, maxScore, label, colorClass }) => {
    const percentage = score / maxScore;
    const circumference = 2 * Math.PI * 45; // 2 * pi * radius
    const strokeDashoffset = circumference - percentage * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-slate-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    <circle
                        className={colorClass}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${colorClass}`}>{score}</span>
                    <span className="text-xs text-gray-400">/ {maxScore}</span>
                </div>
            </div>
            <span className="mt-2 text-sm font-semibold text-gray-300">{label}</span>
        </div>
    );
};

const BreakdownItem: React.FC<{ label: string; score: number; maxScore: number }> = ({ label, score, maxScore }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="font-mono text-white">{score} / {maxScore}</span>
    </div>
);

const AnalyzeIpModal: React.FC<AnalyzeIpModalProps> = ({ document, onClose }) => {
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'complete' | 'error'>('idle');
    const [report, setReport] = useState<IpAnalysisReport | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (document.ipAnalysis?.status === 'complete' && document.ipAnalysis.report) {
            setReport(document.ipAnalysis.report);
            setStatus('complete');
        } else if (document.ipAnalysis?.status === 'error') {
            setError(document.ipAnalysis.error || 'An unknown error occurred during a previous analysis.');
            setStatus('error');
        }
    }, [document]);

    useEffect(() => {
        let interval: number;
        if (status === 'analyzing') {
            let i = 0;
            interval = window.setInterval(() => {
                i = (i + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[i]);
            }, 2500);
        }
        return () => clearInterval(interval);
    }, [status]);

    const handleStartAnalysis = async () => {
        if (!document.verification) return;
        setStatus('analyzing');
        setError(null);
        vaultStore.startIpAnalysis(document.id);

        try {
            const result = await analyzePatentStrength(document.name, document.verification.url);
            vaultStore.completeIpAnalysis(document.id, result);
            setReport(result);
            setStatus('complete');
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            vaultStore.failIpAnalysis(document.id, errorMessage);
            setError(errorMessage);
            setStatus('error');
        }
    };

    const handleSaveReport = () => {
        if (report) {
            insightStore.addIpAnalysisInsight(document.name, report);
            setIsSaved(true);
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'idle':
                return (
                    <>
                        <div className="p-6 text-center">
                            <Icon name="analyze" className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white">Analyze IP Strength</h3>
                            <p className="text-gray-300 mt-2">
                                Use the Genesis AI to perform a deep analysis of this patent's strength. The AI will act as a patent attorney, reviewing the public record to assess its novelty, claim breadth, and commercial viability based on a 1000-point scale.
                            </p>
                        </div>
                        <footer className="p-4 border-t border-slate-700 flex justify-end gap-3">
                            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white">Cancel</button>
                            <button onClick={handleStartAnalysis} className="px-4 py-2 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-500">
                                Start Free Analysis
                            </button>
                        </footer>
                    </>
                );
            case 'analyzing':
                return (
                    <div className="p-10 text-center">
                        <div className="animate-spin h-12 w-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-6"></div>
                        <h3 className="text-xl font-semibold text-white">Analysis in Progress...</h3>
                        <p className="text-gray-300 mt-2 transition-opacity duration-500">{loadingMessage}</p>
                    </div>
                );
            case 'error':
                return (
                     <>
                        <div className="p-6 text-center">
                            <Icon name="info" className="w-16 h-16 text-red-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white">Analysis Failed</h3>
                            <p className="text-red-300 mt-2 bg-red-500/10 p-3 rounded-md">{error}</p>
                        </div>
                        <footer className="p-4 border-t border-slate-700 flex justify-end gap-3">
                            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white">Close</button>
                            <button onClick={handleStartAnalysis} className="px-4 py-2 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-500">
                                Try Again
                            </button>
                        </footer>
                    </>
                );
            case 'complete':
                if (!report) return null;
                const b = report.scoreBreakdown;
                return (
                    <>
                        <div className="p-6 space-y-6">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-white">IP Strength Analysis Report</h3>
                                <div className="flex items-center justify-center gap-4 mt-1">
                                    <p className="text-sm text-gray-400">Patent Status: <span className="font-semibold text-cyan-300">{report.patentStatus}</span></p>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full capitalize">{report.tier} Tier</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-1 flex flex-col items-center justify-center bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                                    <h4 className="text-lg font-semibold text-purple-300 mb-2">Total Strength Score</h4>
                                    <RadialGauge score={report.score} maxScore={1000} label="Overall Score" colorClass="text-purple-400" />
                                    <p className="text-xs text-center text-gray-400 mt-4">{report.summary}</p>
                                </div>
                                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-3">
                                        <h4 className="font-semibold text-cyan-300">Core Quality ({b.coreQuality.total}/400)</h4>
                                        <BreakdownItem label="Claim Breadth" score={b.coreQuality.claimBreadth} maxScore={200} />
                                        <BreakdownItem label="Novelty" score={b.coreQuality.novelty} maxScore={150} />
                                        <BreakdownItem label="Specification" score={b.coreQuality.specification} maxScore={50} />
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-3">
                                        <h4 className="font-semibold text-green-300">Market Viability ({b.marketViability.total}/300)</h4>
                                        <BreakdownItem label="Market Size" score={b.marketViability.marketSize} maxScore={150} />
                                        <BreakdownItem label="Commercial Relevance" score={b.marketViability.commercialRelevance} maxScore={150} />
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-3">
                                        <h4 className="font-semibold text-amber-300">Influence ({b.influence.total}/200)</h4>
                                        <BreakdownItem label="Forward Citations" score={b.influence.forwardCitations} maxScore={150} />
                                        <BreakdownItem label="Prior Art" score={b.influence.priorArt} maxScore={50} />
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-3">
                                        <h4 className="font-semibold text-red-300">Risk Factors ({b.riskFactors.total}/100)</h4>
                                        <BreakdownItem label="Patent Status" score={b.riskFactors.patentStatus} maxScore={50} />
                                        <BreakdownItem label="Litigation Risk" score={b.riskFactors.litigationRisk} maxScore={50} />
                                    </div>
                                </div>
                            </div>

                            <UpgradeOptions currentTier={report.tier} />
                        </div>
                        <footer className="p-4 border-t border-slate-700 flex justify-between items-center">
                            <button onClick={handleSaveReport} disabled={isSaved} className="flex items-center gap-2 text-sm font-semibold text-amber-300 hover:text-amber-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Icon name="saved" className="w-4 h-4" />
                                {isSaved ? 'Saved to Insights' : 'Save Report'}
                            </button>
                            <button onClick={onClose} className="px-6 py-2 text-sm font-semibold text-white bg-slate-600 rounded-md hover:bg-slate-500">
                                Close
                            </button>
                        </footer>
                    </>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-white">IP Analysis</h2>
                        <p className="text-sm text-gray-400 truncate">{document.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <div className="overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AnalyzeIpModal;
