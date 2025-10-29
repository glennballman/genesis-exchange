import React from 'react';
import { IndividualAlignmentReport } from '../../types';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';

const StatGauge: React.FC<{ value: string; label: string; color: string }> = ({ value, label, color }) => (
    <div className="text-center">
        <div className={`text-4xl font-bold text-${color}-400`}>{value}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
    </div>
);

const IndividualAlignmentReportView: React.FC<{ report: IndividualAlignmentReport; onClose: () => void; }> = ({ report, onClose }) => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                 <button onClick={onClose} className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Back to Team Alignment
                </button>
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Individual Alignment Deep Dive</h1>
                <p className="mt-1 text-gray-400">For: <span className="font-semibold text-white">{report.userName}</span></p>
            </div>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <StatGauge value={`${report.missionAlignmentScore}%`} label="Mission Alignment" color="green" />
                    <StatGauge value={`${report.ambitionIndex}/100`} label="Ambition Index" color="amber" />
                    <StatGauge value={`${report.transparencyIndex}%`} label="Transparency Index" color="sky" />
                </div>
            </Card>

            <Card>
                <h3 className="text-lg font-semibold text-white mb-2">AI Executive Summary</h3>
                <p className="text-sm text-gray-400 italic p-3 bg-slate-900/50 rounded-md border-l-2 border-slate-600">{report.executiveSummary}</p>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-white mb-3">Key Synergies</h3>
                    <ul className="space-y-3">
                        {report.keySynergies.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                <Icon name="logo" className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
                 <Card>
                    <h3 className="text-lg font-semibold text-white mb-3">Alignment Gaps & Opportunities</h3>
                    <ul className="space-y-3">
                        {report.alignmentGaps.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                <Icon name="info" className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>

            <Card>
                <h3 className="text-lg font-semibold text-white mb-3">AI-Generated Conversation Starters</h3>
                <ul className="space-y-3">
                    {report.conversationStarters.map((item, i) => (
                        <li key={i} className="text-sm text-gray-300 p-3 bg-slate-800/50 rounded-md">
                           <span className="font-semibold text-gray-200">To discuss {item.split(':')[0]}:</span> "{item.split(':')[1]}"
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export default IndividualAlignmentReportView;
