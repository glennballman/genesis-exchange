
import React, { useState, useEffect } from 'react';
import { ctoData } from '../../data/genesisData';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { getDashboardInsights } from '../../services/geminiService';
import { DashboardInsight, TechStackItem } from '../../types';

const StatusBadge: React.FC<{ status: TechStackItem['status'] }> = ({ status }) => {
    const baseClasses = "px-2 py-0.5 text-xs font-medium rounded-full";
    const styles = {
        Healthy: "bg-green-500/10 text-green-300",
        'At Risk': "bg-yellow-500/10 text-yellow-300",
        Deprecated: "bg-red-500/10 text-red-300",
    };
    return <span className={`${baseClasses} ${styles[status]}`}>{status}</span>;
};

const AIInsightWidget: React.FC = () => {
    const [insight, setInsight] = useState<DashboardInsight | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInsight = async () => {
            setIsLoading(true);
            const result = await getDashboardInsights('CTO');
            setInsight(result);
            setIsLoading(false);
        };
        fetchInsight();
    }, []);

    return (
        <Card>
            <div className="flex items-center gap-3 mb-4">
                <Icon name="cto" className="w-6 h-6 text-sky-400" />
                <h3 className="text-lg font-semibold text-white">{isLoading ? "Analyzing..." : insight?.title}</h3>
            </div>
            {isLoading ? (
                <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                </div>
            ) : (
                <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside">
                    {insight?.points.map((point, i) => <li key={i}>{point}</li>)}
                </ul>
            )}
        </Card>
    );
};

const CTODashboard: React.FC = () => {
  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">CTO HUD: Product & Tech</h1>
            <p className="mt-1 text-gray-400">Oversight of technical architecture, development velocity, and security posture.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <h3 className="text-lg font-semibold text-white mb-4">Tech Stack Inventory</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-slate-900/50">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Component</th>
                                    <th scope="col" className="px-4 py-3">Category</th>
                                    <th scope="col" className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ctoData.techStack.map(item => (
                                    <tr key={item.name} className="border-b border-slate-700 hover:bg-slate-800/40">
                                        <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                                        <td className="px-4 py-3 text-gray-300">{item.category}</td>
                                        <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-white mb-4">Product Roadmap</h3>
                     <div className="space-y-4">
                        {ctoData.roadmap.map(item => (
                            <div key={item.feature}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-base font-medium text-white">{item.feature} <span className="text-sm text-gray-400">({item.quarter})</span></span>
                                    <span className="text-sm font-medium text-sky-300">{item.status}</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-2.5">
                                    <div className="bg-sky-500 h-2.5 rounded-full" style={{width: item.status === 'Completed' ? '100%' : item.status === 'In Progress' ? '66%' : '10%'}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <h3 className="text-lg font-semibold text-white mb-4">Security Posture</h3>
                    <div className="text-center">
                        <div className="text-6xl font-bold text-sky-400">{ctoData.securityAudit.score}</div>
                        <div className="text-sm text-gray-400">Audit Score</div>
                        <p className="mt-4 text-sm text-gray-300">Last scan: {ctoData.securityAudit.lastScan}</p>
                        <p className="text-sm text-red-400">{ctoData.securityAudit.vulnerabilities} critical vulnerabilities found.</p>
                    </div>
                </Card>
                <AIInsightWidget />
            </div>
        </div>
    </div>
  );
};

export default CTODashboard;
