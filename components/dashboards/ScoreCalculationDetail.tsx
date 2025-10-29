import React, { useState, useEffect } from 'react';
import { scoreDataStore } from '../../services/scoreDataStore';
import { Card } from '../ui/Card';
import { ScoreComponent } from '../../types';
import ScoreDetailModal from '../score/ScoreDetailModal';
import { userProfileStore } from '../../services/userProfileStore';
import ScoreHistoryChart from '../charts/ScoreHistoryChart';
import { historyStore } from '../../services/historyStore';

const ScoreCalculationDetail: React.FC = () => {
    const [selectedComponent, setSelectedComponent] = useState<ScoreComponent | null>(null);
    const [scoreData, setScoreData] = useState<ScoreComponent[]>(scoreDataStore.getScoreComponents());
    const [companyHistory, setCompanyHistory] = useState(historyStore.getCompanyHistory());

    const updateTotalScore = () => {
        const gumpPoints = userProfileStore.getProfile().gumpPoints;
        const currentScoreComponents = scoreDataStore.getScoreComponents();
        
        const updatedData = currentScoreComponents.map(item => {
            if (item.category === 'GUMP' && item.item === 'Genesis U Mastery') {
                return { ...item, points: gumpPoints };
            }
            return item;
        });
        
        setScoreData(updatedData);
        setCompanyHistory(historyStore.getCompanyHistory());
    };

    useEffect(() => {
        updateTotalScore();
        window.addEventListener('focus', updateTotalScore);
        return () => {
            window.removeEventListener('focus', updateTotalScore);
        };
    }, []);

    const totalScore = scoreData.reduce((sum, item) => sum + item.points, 0);

    const categoryColors: { [key: string]: string } = {
        'Team': 'text-cyan-400',
        'IP': 'text-cyan-400',
        'DD Preparedness': 'text-cyan-400',
        'Distribution/Market': 'text-cyan-400',
        'Traction/Health': 'text-cyan-400',
        'GUMP': 'text-yellow-400',
        'Stealth Moat Layer': 'text-violet-400',
        'Cultural Fluency Layer': 'text-violet-400',
        'Regulatory Tailwind Layer': 'text-violet-400',
    };

    const handleRowClick = (component: ScoreComponent) => {
        setSelectedComponent(component);
    };

    const handleCloseModal = () => {
        setSelectedComponent(null);
        updateTotalScore();
    };

    return (
        <>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Score Calculation Ledger</h1>
                    <p className="mt-1 text-gray-400">A transparent, line-item breakdown of every component contributing to your Genesis Score. Click any row to get AI-powered tips.</p>
                </div>

                <Card>
                    <h2 className="text-xl font-semibold text-white mb-4">Company Genesis Score Over Time</h2>
                    <ScoreHistoryChart data={companyHistory} color="#06b6d4" gradientId="companyScoreLedger" />
                </Card>

                <Card className="!p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-slate-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Category / Pillar</th>
                                    <th scope="col" className="px-6 py-3">Component</th>
                                    <th scope="col" className="px-6 py-3">Details</th>
                                    <th scope="col" className="px-6 py-3 text-right">Maximum</th>
                                    <th scope="col" className="px-6 py-3 text-right">Points</th>
                                    <th scope="col" className="px-6 py-3 text-right">%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scoreData.map((item, index) => {
                                    const percentage = item.max_points > 0 ? (item.points / item.max_points) * 100 : 0;
                                    return (
                                        <tr key={index} className="border-b border-slate-700 hover:bg-slate-800/40 cursor-pointer" onClick={() => handleRowClick(item)}>
                                            <td className={`px-6 py-4 font-medium ${categoryColors[item.category] || 'text-gray-300'}`}>
                                                {item.category}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-white">
                                                {item.item}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">
                                                {item.details}
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-gray-400">
                                                {item.max_points.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono font-semibold text-green-400">
                                                +{item.points.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono font-semibold text-cyan-300">
                                                {percentage.toFixed(0)}%
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot className="bg-slate-900/50">
                                <tr>
                                    <td colSpan={4} className="px-6 py-3 text-right font-semibold text-white uppercase">Total</td>
                                    <td className="px-6 py-3 text-right font-mono font-bold text-xl text-cyan-300">
                                        {totalScore.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-3"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </Card>
            </div>
            {selectedComponent && (
                <ScoreDetailModal
                    component={selectedComponent}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default ScoreCalculationDetail;
