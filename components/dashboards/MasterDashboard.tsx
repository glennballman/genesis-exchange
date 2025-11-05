
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMasterDashboardStore } from '../../services/masterDashboardStore';
import ScoreBreakdownChart from '../ScoreBreakdownChart';
import ProactivePulseEngine from '../ProactivePulseEngine';
import { Icon } from '../ui/Icon';
import { Card } from '../ui/Card';

const MasterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { genesisScoreData, fetchGenesisScoreData } = useMasterDashboardStore();

  useEffect(() => {
    fetchGenesisScoreData();
  }, [fetchGenesisScoreData]);

  if (!genesisScoreData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white">Loading Master Dashboard...</div>
      </div>
    );
  }

  const basePillars = genesisScoreData.scoring_layers[0];
  const nuanceOverlays = genesisScoreData.nuance_overlays[0];

  const totalPillarPoints = basePillars.pillars.reduce((sum, p) => sum + p.current_points, 0);
  const totalOverlayPoints = nuanceOverlays.overlays.reduce((sum, o) => sum + o.current_points, 0);
  const totalScore = totalPillarPoints + totalOverlayPoints;

  const chartData = [
    { name: 'Base Pillars', value: totalPillarPoints, fill: '#06b6d4' }, // cyan-500
    { name: 'Nuance Overlays', value: totalOverlayPoints, fill: '#8b5cf6' }, // violet-500
    { name: 'Potential', value: genesisScoreData.max_score - totalScore, fill: '#374151' }, // gray-700
  ];

  const summaryCards = [
      { title: 'CTO HUD', description: 'Tech architecture, roadmap, and security posture.', link: '/cto', icon: 'cto' as const, color: 'sky' },
      { title: 'CFO HUD', description: 'Financial health, burn rate, runway, and cap table.', link: '/cfo', icon: 'cfo' as const, color: 'emerald' },
      { title: 'CMO HUD', description: 'Market traction, GTM strategy, and customer metrics.', link: '/cmo', icon: 'cmo' as const, color: 'amber' },
  ];

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const path = event.target.value;
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Galactic Command Center</h1>
          <p className="mt-1 text-gray-400">High-level overview of your venture's operational status and Genesis Score.</p>
        </div>
        <select onChange={handleDropdownChange} className="bg-gray-800 text-white p-2 rounded">
          <option value="">Select a screen</option>
          <option value="/green-screen">Green Screen</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Link to="/genesis-score" className="lg:col-span-1 block group">
            <Card className="flex items-center justify-center p-0 h-full">
                <ScoreBreakdownChart data={chartData} totalScore={totalScore} />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <span className="text-white font-semibold flex items-center gap-2">
                        <Icon name="score-details" className="w-5 h-5" />
                        View Score Details
                    </span>
                </div>
            </Card>
        </Link>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link to="/score-calculation" className="block">
                <Card className="h-full border-purple-500/20 hover:border-purple-500/60">
                    <div className="p-3 bg-purple-500/10 rounded-lg w-min mb-4">
                        <Icon name="calculation" className="w-7 h-7 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white text-lg">Score Calculation</h3>
                    <p className="text-sm text-gray-400 mt-1">See a line-by-line breakdown of your Genesis Score.</p>
                </Card>
            </Link>
            {summaryCards.map(card => (
                <Link to={card.link} key={card.title} className="block">
                    <Card className={`h-full border-${card.color}-500/20 hover:border-${card.color}-500/60`}>
                        <div className={`p-3 bg-${card.color}-500/10 rounded-lg w-min mb-4`}>
                            <Icon name={card.icon} className={`w-7 h-7 text-${card.color}-400`} />
                        </div>
                        <h3 className="font-semibold text-white text-lg">{card.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{card.description}</p>
                    </Card>
                </Link>
            ))}
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
                <h3 className="text-lg font-semibold text-white">Update Your Venture Data</h3>
                <p className="text-sm text-gray-400 mt-1">Keep your Genesis Score current by providing the latest information about your company through the Intake Wizard.</p>
            </div>
            <Link to="/intake-wizard" className="flex-shrink-0 w-full sm:w-auto">
                <button className="w-full flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition-all duration-200">
                    <Icon name="wizard" className="w-5 h-5" />
                    Start Intake Wizard
                </button>
            </Link>
        </div>
      </Card>

      <ProactivePulseEngine />
    </div>
  );
};

export default MasterDashboard;
