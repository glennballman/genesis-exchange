
import React, { useState, useEffect } from 'react';
import { discoveryService } from '../../services/discoveryService';
import { AlignmentMatch } from '../../types';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import IndividualsList from './principals/IndividualsList';

const AlignmentGauge: React.FC<{ score: number; label: string; colorClass: string }> = ({ score, label, colorClass }) => {
    const percentage = score / 100;
    const circumference = 2 * Math.PI * 20;
    const strokeDashoffset = circumference - percentage * circumference;

    return (
        <div className="flex flex-col items-center" title={`${label}: ${score}%`}>
            <div className="relative w-12 h-12">
                <svg className="w-full h-full" viewBox="0 0 44 44">
                    <circle className="text-slate-700" strokeWidth="5" stroke="currentColor" fill="transparent" r="20" cx="22" cy="22" />
                    <circle
                        className={colorClass}
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="20"
                        cx="22"
                        cy="22"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-sm font-bold ${colorClass}`}>{score}</span>
                </div>
            </div>
            <span className="text-[10px] text-gray-400 mt-1">{label}</span>
        </div>
    );
};

const MatchCard: React.FC<{ match: AlignmentMatch }> = ({ match }) => {
    const [showWhy, setShowWhy] = useState(false);

    return (
        <Card className={`!p-0 ${match.conflict ? 'opacity-60 hover:opacity-100 border-red-500/30' : ''}`}>
            <div className="p-5 flex items-center gap-5">
                <div className="flex gap-3">
                    <AlignmentGauge score={match.financialAlignmentScore} label="Invest Fit" colorClass="text-green-400" />
                    <AlignmentGauge score={match.advisoryAlignmentScore} label="Advise Fit" colorClass="text-sky-400" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-white">{match.target.name}</h3>
                    <p className="text-sm text-gray-400 italic">"{match.target.missionStatement}"</p>
                    <div className="mt-2 flex items-center gap-2">
                        <button onClick={() => setShowWhy(!showWhy)} className={`text-xs font-semibold ${match.conflict ? 'text-red-400' : 'text-cyan-400'} hover:underline`}>
                            {showWhy ? 'Hide Reason' : 'Why?'}
                        </button>
                    </div>
                </div>
                <button disabled={match.conflict} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed">
                    Request Intro
                </button>
            </div>
            {showWhy && (
                <div className={`border-t ${match.conflict ? 'border-red-700 bg-red-900/20' : 'border-slate-700 bg-slate-900/30'} p-5`}>
                    <h4 className={`text-sm font-semibold mb-2 ${match.conflict ? 'text-red-300' : 'text-white'}`}>{match.conflict ? 'Values Conflict Detected' : 'Alignment Narrative'}</h4>
                    <p className={`text-sm ${match.conflict ? 'text-red-300' : 'text-gray-300'}`}>{match.narrative}</p>
                </div>
            )}
        </Card>
    );
};

const DiscoveryDashboard: React.FC = () => {
    const [matches, setMatches] = useState<AlignmentMatch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'Capital' | 'Advisors' | 'Individuals'>('Capital');

    useEffect(() => {
        if (filter === 'Capital' || filter === 'Advisors') {
            const fetchMatches = async () => {
                setIsLoading(true);
                const company = discoveryService.getCurrentCompanyPrincipal();
                const results = await discoveryService.findMatches(company, 'VC_FUND');
                setMatches(results);
                setIsLoading(false);
            };
            fetchMatches();
        } else {
            setIsLoading(false);
        }
    }, [filter]);

    const sortedMatches = [...matches].sort((a, b) => {
        if (filter === 'Capital') {
            return b.financialAlignmentScore - a.financialAlignmentScore;
        }
        return b.advisoryAlignmentScore - a.advisoryAlignmentScore;
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Discovery Engine</h1>
                <p className="mt-1 text-gray-400">Find investors and partners who are philosophically and strategically aligned with your mission.</p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center gap-4">
                <span className="font-semibold text-gray-300">Search For:</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setFilter('Capital')} className={`px-3 py-1.5 text-sm font-semibold rounded-md ${filter === 'Capital' ? 'text-white bg-cyan-600' : 'text-gray-400 bg-slate-700 hover:bg-slate-600'}`}>Capital</button>
                    <button onClick={() => setFilter('Advisors')} className={`px-3 py-1.5 text-sm font-semibold rounded-md ${filter === 'Advisors' ? 'text-white bg-cyan-600' : 'text-gray-400 bg-slate-700 hover:bg-slate-600'}`}>Advisors</button>
                    <button onClick={() => setFilter('Individuals')} className={`px-3 py-1.5 text-sm font-semibold rounded-md ${filter === 'Individuals' ? 'text-white bg-cyan-600' : 'text-gray-400 bg-slate-700 hover:bg-slate-600'}`}>Individuals</button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center p-10">
                    <div className="animate-spin h-12 w-12 border-4 border-purple-400 border-t-transparent rounded-full"></div>
                </div>
            ) : (
                <>
                    {filter === 'Individuals' ? (
                        <IndividualsList />
                    ) : (
                        <div className="space-y-4">
                            {sortedMatches.map(match => (
                                <MatchCard key={match.target.id} match={match} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DiscoveryDashboard;
