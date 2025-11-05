
import React, { useState, useEffect } from 'react';
import { Principal } from '../../types';
import { alignmentService, AlignmentReport } from '../../services/alignmentService';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';

const AlignmentPillarGauge: React.FC<{
    name: string;
    score: number;
    description: string;
    icon: string;
}> = ({ name, score, description, icon }) => {

    const getScoreColor = () => {
        if (score > 80) return 'text-green-400';
        if (score > 60) return 'text-yellow-400';
        if (score > 40) return 'text-orange-400';
        return 'text-red-400';
    };

    const circumference = 2 * Math.PI * 16;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg">
            <div className="relative w-10 h-10">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle className="text-slate-700" strokeWidth="3" stroke="currentColor" fill="transparent" r="16" cx="18" cy="18" />
                    <circle
                        className={getScoreColor()}
                        strokeWidth="3"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="16"
                        cx="18"
                        cy="18"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Icon name={icon} className={`w-5 h-5 ${getScoreColor()}`} />
                </div>
            </div>
            <div className='flex-1'>
                 <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-white">{name}</h4>
                    <span className={`text-sm font-bold ${getScoreColor()}`}>{score.toFixed(0)}%</span>
                </div>
                <p className="text-xs text-gray-400">{description}</p>
            </div>
        </div>
    );
};


export const LiveAlignmentReportCard: React.FC<{ source: Principal; target: Principal }> = ({ source, target }) => {
    const [report, setReport] = useState<AlignmentReport | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const generateReport = async () => {
            setIsLoading(true);
            try {
                const alignmentReport = await alignmentService.generateAlignmentReport(source, target);
                setReport(alignmentReport);
            } catch (error) {
                console.error("Failed to generate alignment report:", error);
            } finally {
                setIsLoading(false);
            }
        };

        generateReport();
    }, [source, target]);

    if (isLoading) {
        return (
            <Card>
                <div className="flex items-center gap-3">
                    <div className="animate-spin h-5 w-5 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
                    <span className="text-gray-300">Generating Live Alignment Report...</span>
                </div>
            </Card>
        );
    }

    if (!report) {
        return (
            <Card>
                <div className="text-center text-red-400">Failed to load alignment report.</div>
            </Card>
        );
    }

    const overallScore = report.overallAlignmentScore;
    const scoreColor = overallScore > 80 ? 'text-green-300' : overallScore > 60 ? 'text-yellow-300' : 'text-orange-300';


    return (
        <Card className="!border-cyan-500/30">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex flex-col items-center justify-center space-y-4 p-4 bg-slate-800/40 rounded-lg">
                    <h3 className="text-lg font-semibold text-white">Overall Alignment</h3>
                     <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle className="text-slate-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                            <circle
                                className={scoreColor}
                                strokeWidth="8"
                                strokeDasharray={2 * Math.PI * 45}
                                strokeDashoffset={(2 * Math.PI * 45) - (overallScore/100) * (2 * Math.PI * 45)}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="45"
                                cx="50"
                                cy="50"
                                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.8s ease-out' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className={`text-4xl font-bold ${scoreColor}`}>{overallScore.toFixed(0)}</span>
                            <span className="text-sm text-gray-400">Match</span>
                        </div>
                    </div>
                     <p className="text-xs text-center text-gray-400 px-4">
                        Based on Mission, Values, and strategic Interests.
                    </p>
                </div>
                <div className="flex-1 space-y-4">
                    <AlignmentPillarGauge
                        name="Mission Sync"
                        score={report.missionAlignment.score}
                        description="How well do their core purposes align?"
                        icon="mission"
                    />
                    <AlignmentPillarGauge
                        name="Values Resonance"
                        score={report.valuesAlignment.score}
                        description="Are their guiding principles compatible?"
                        icon="values"
                    />
                    <AlignmentPillarGauge
                        name="Interest Overlap"
                        score={report.interestAlignment.score}
                        description="Do they share similar professional focuses?"
                        icon="interests"
                    />
                </div>
            </div>
            <div className="mt-6 border-t border-slate-700 pt-4">
                <h4 className="font-semibold text-cyan-200 mb-2 flex items-center gap-2">
                    <Icon name="summary" className="w-5 h-5"/>
                    Alignment Narrative
                </h4>
                <p className="text-sm text-gray-300 whitespace-pre-line">{report.narrative}</p>
            </div>
        </Card>
    );
};
