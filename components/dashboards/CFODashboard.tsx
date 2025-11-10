
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { getDashboardInsights } from '../../services/geminiService';
import { DashboardInsight, Financials, CapTable } from '../../types';

interface CfoData {
    financials: Financials[];
    capTable: CapTable;
}

const AIInsightWidget: React.FC = () => {
    const [insight, setInsight] = useState<DashboardInsight | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInsight = async () => {
            setIsLoading(true);
            const result = await getDashboardInsights('CFO');
            setInsight(result);
            setIsLoading(false);
        };
        fetchInsight();
    }, []);

    return (
        <Card>
            <div className="flex items-center gap-3 mb-4">
                <Icon name="cfo" className="w-6 h-6 text-emerald-400" />
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

const CFODashboard: React.FC = () => {
  const [cfoData, setCfoData] = useState<CfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch('/api/cfo-data');
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              setCfoData(data);
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

  if (!cfoData) {
      return <div>No data available</div>;
  }

  const latestFinancials = cfoData.financials[cfoData.financials.length - 1];

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">CFO HUD: Financials & Capital</h1>
            <p className="mt-1 text-gray-400">Monitoring financial health, capital allocation, and runway.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <h3 className="text-sm font-medium text-gray-400">Monthly Burn</h3>
                <p className="text-3xl font-semibold text-white">${latestFinancials.burn.toLocaleString()}</p>
            </Card>
            <Card>
                <h3 className="text-sm font-medium text-gray-400">Projected Revenue</h3>
                <p className="text-3xl font-semibold text-white">${latestFinancials.revenue.toLocaleString()}</p>
            </Card>
            <Card>
                <h3 className="text-sm font-medium text-gray-400">Cash Runway</h3>
                <p className="text-3xl font-semibold text-white">{latestFinancials.runway} months</p>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">Revenue vs. Burn Rate</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={cfoData.financials}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
                        <Line type="monotone" dataKey="burn" stroke="#f43f5e" strokeWidth={2} name="Burn" />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <h3 className="text-lg font-semibold text-white mb-4">Cap Table Distribution</h3>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1"><span className="text-gray-300">Founders</span><span className="font-medium text-white">{cfoData.capTable.founders}%</span></div>
                            <div className="w-full bg-slate-700 rounded-full h-2.5"><div className="bg-emerald-500 h-2.5 rounded-full" style={{width: `${cfoData.capTable.founders}%`}}></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1"><span className="text-gray-300">Investors</span><span className="font-medium text-white">{cfoData.capTable.investors}%</span></div>
                            <div className="w-full bg-slate-700 rounded-full h-2.5"><div className="bg-sky-500 h-2.5 rounded-full" style={{width: `${cfoData.capTable.investors}%`}}></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1"><span className="text-gray-300">ESOP</span><span className="font-medium text-white">{cfoData.capTable.esop}%</span></div>
                            <div className="w-full bg-slate-700 rounded-full h-2.5"><div className="bg-amber-500 h-2.5 rounded-full" style={{width: `${cfoData.capTable.esop}%`}}></div></div>
                        </div>
                    </div>
                </Card>
                <AIInsightWidget />
            </div>
        </div>
    </div>
  );
};

export default CFODashboard;
