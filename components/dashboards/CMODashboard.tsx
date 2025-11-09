
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { getDashboardInsights } from '../../services/geminiService';
import { DashboardInsight, MarketMetric } from '../../types';

interface CmoData {
    marketMetrics: MarketMetric[];
    gtmPlan: { 
        initiative: string;
        status: string;
        progress: number;
    }[];
}

const AIInsightWidget: React.FC = () => {
    const [insight, setInsight] = useState<DashboardInsight | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInsight = async () => {
            setIsLoading(true);
            const result = await getDashboardInsights('CMO');
            setInsight(result);
            setIsLoading(false);
        };
        fetchInsight();
    }, []);

    return (
        <Card>
            <div className="flex items-center gap-3 mb-4">
                <Icon name="cmo" className="w-6 h-6 text-amber-400" />
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

const CMODashboard: React.FC = () => {
    const [cmoData, setCmoData] = useState<CmoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/cmo-data');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCmoData(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!cmoData) {
        return <div>No data available</div>;
    }

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">CMO HUD: Market & Growth</h1>
            <p className="mt-1 text-gray-400">Tracking go-to-market strategy, customer acquisition, and brand positioning.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">CAC vs. LTV by Channel</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cmoData.marketMetrics} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="channel" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${value}`} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                        <Legend />
                        <Bar dataKey="cac" fill="#f59e0b" name="CAC" />
                        <Bar dataKey="ltv" fill="#10b981" name="LTV" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
            <div className="lg:col-span-1 space-y-6">
                <AIInsightWidget />
            </div>
        </div>
        
        <Card>
            <h3 className="text-lg font-semibold text-white mb-4">GTM Initiative Progress</h3>
            <div className="space-y-4">
                {cmoData.gtmPlan.map(item => (
                    <div key={item.initiative}>
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-white">{item.initiative}</span>
                            <span className="text-sm font-medium text-amber-300">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-4">
                            <div className="bg-amber-500 h-4 rounded-full flex items-center justify-center text-xs font-bold text-black" style={{width: `${item.progress}%`}}>
                                {item.status}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    </div>
  );
};

export default CMODashboard;
