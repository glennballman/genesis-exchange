import React from 'react';
import { IpAnalysisReport } from '../../types';
import UpgradeOptions from './UpgradeOptions';

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

interface IpAnalysisReportCardProps {
    report: IpAnalysisReport;
}

const IpAnalysisReportCard: React.FC<IpAnalysisReportCardProps> = ({ report }) => {
    const b = report.scoreBreakdown;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-center gap-4">
                <p className="text-sm text-gray-400">Patent Status: <span className="font-semibold text-cyan-300">{report.patentStatus}</span></p>
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full capitalize">{report.tier} Tier</span>
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
    );
};

export default IpAnalysisReportCard;
