
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Vault, VaultId, ScoreComponent } from '../../types';

const vaults: Vault[] = [
    { id: 'ip', name: 'IP Vault', description: 'Patents, trademarks, and trade secrets.', icon: 'ip', color: 'sky' },
    { id: 'financials', name: 'Financials Vault', description: 'P&Ls, cap tables, and funding docs.', icon: 'cfo', color: 'emerald' },
    { id: 'market', name: 'Market & Traction Vault', description: 'TAM reports, customer metrics, GTM plans.', icon: 'market', color: 'amber' },
    { id: 'team', name: 'Team & Ops Vault', description: 'Org charts, SOPs, and key contracts.', icon: 'team', color: 'rose' },
    { id: 'product', name: 'Product/Tech Vault', description: 'Architecture, security audits, roadmaps.', icon: 'cto', color: 'blue' },
    { id: 'legal', name: 'Legal & Risk Vault', description: 'Incorporation docs, litigation, ESG reports.', icon: 'regulation', color: 'indigo' },
    { id: 'exit', name: 'Exit & Strategy Vault', description: 'Exit models, M&A histories, strategic plans.', icon: 'diligence', color: 'purple' },
];

const VaultsDashboard: React.FC = () => {
    const [ddPreparednessComponents, setDdPreparednessComponents] = useState<ScoreComponent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/score-components');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: ScoreComponent[] = await response.json();
                const filteredData = data.filter(item => item.category === 'DD Preparedness');
                setDdPreparednessComponents(filteredData);
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

    const currentDdScore = ddPreparednessComponents.reduce(
        (sum, item) => sum + item.points,
        0
    );

    const maxDdScore = ddPreparednessComponents.reduce(
        (sum, item) => sum + item.max_points,
        0
    );

    const percentage = maxDdScore > 0 ? (currentDdScore / maxDdScore) * 100 : 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Due Diligence Vaults</h1>
                <p className="mt-1 text-gray-400">Your intelligent, active data fortress for secure, contextual disclosure.</p>
            </div>

            <Card>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Icon name="dd" className="w-8 h-8 text-indigo-400" />
                        <h2 className="text-xl font-semibold text-white">Due Diligence Preparedness</h2>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Current: <span className="font-bold text-green-400">{currentDdScore.toLocaleString()} pts</span></span>
                            <span>Max: <span className="font-bold text-gray-300">{maxDdScore.toLocaleString()} pts</span></span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2.5 relative">
                            <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vaults.map(vault => (
                    <Link to={`/vaults/${vault.id}`} key={vault.id} className="block">
                        <Card className={`h-full border-${vault.color}-500/20 hover:border-${vault.color}-500/60`}>
                            <div className={`p-3 bg-${vault.color}-500/10 rounded-lg w-min mb-4`}>
                                <Icon name={vault.icon as any} className={`w-7 h-7 text-${vault.color}-400`} />
                            </div>
                            <h3 className="font-semibold text-white text-lg">{vault.name}</h3>
                            <p className="text-sm text-gray-400 mt-1">{vault.description}</p>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default VaultsDashboard;
