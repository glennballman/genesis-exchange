
import React from 'react';
import { genesisScoreData } from '../../data/genesisData';
import ScoreBreakdownChart from '../ScoreBreakdownChart';
import ScorePillarCard from '../ScorePillarCard';
import ScoreOverlayCard from '../ScoreOverlayCard';
import InnovationHorizon from '../InnovationHorizon';
import { Icon } from '../ui/Icon';
import ScoreHistoryChart from '../charts/ScoreHistoryChart';
import { historyStore } from '../../services/historyStore';
import { Card } from '../ui/Card';

const GenesisScoreDetail: React.FC = () => {
  const basePillars = genesisScoreData.scoring_layers[0];
  const nuanceOverlays = genesisScoreData.nuance_overlays[0];
  const innovationHorizon = genesisScoreData.innovation_horizon[0];

  const totalPillarPoints = basePillars.pillars.reduce((sum, p) => sum + p.current_points, 0);
  const totalOverlayPoints = nuanceOverlays.overlays.reduce((sum, o) => sum + o.current_points, 0);
  const totalScore = totalPillarPoints + totalOverlayPoints;

  const chartData = [
    { name: 'Base Pillars', value: totalPillarPoints, fill: '#06b6d4' }, // cyan-500
    { name: 'Nuance Overlays', value: totalOverlayPoints, fill: '#8b5cf6' }, // violet-500
    { name: 'Potential', value: genesisScoreData.max_score - totalScore, fill: '#374151' }, // gray-700
  ];

  const companyHistory = historyStore.getCompanyHistory();

  return (
    <div className="space-y-10">
        <Card>
            <h2 className="text-xl font-semibold text-white mb-4">Company Genesis Score Over Time</h2>
            <ScoreHistoryChart data={companyHistory} color="#06b6d4" gradientId="companyScore" />
        </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-1 h-64 md:h-80 flex flex-col items-center justify-center">
          <ScoreBreakdownChart data={chartData} totalScore={totalScore} />
        </div>
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Genesis Score Breakdown</h1>
          <p className="mt-2 text-gray-400 max-w-2xl">
            A dynamic, AI-fueled metric quantifying your venture's 'pool readiness' across the global funding spectrum. This score is your key to unlocking capital and strategic intelligence on the Genesis Exchange.
          </p>
           <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700 flex items-start space-x-4">
              <Icon name="info" className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-white">How it works</h4>
                <p className="text-sm text-gray-400">Your score is composed of foundational 'Base Pillars' and contextual 'Nuance Overlays'. Improve your score by completing your DD Vaults, demonstrating traction, and mastering key skills.</p>
              </div>
           </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-white mb-1">{basePillars.layer_name}</h3>
        <p className="text-sm text-gray-400 mb-6">{basePillars.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {basePillars.pillars.map((pillar) => (
            <ScorePillarCard key={pillar.name} pillar={pillar} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-white mb-1">{nuanceOverlays.layer_name}</h3>
        <p className="text-sm text-gray-400 mb-6">{nuanceOverlays.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nuanceOverlays.overlays.map((overlay) => (
            <ScoreOverlayCard key={overlay.name} overlay={overlay} />
          ))}
        </div>
      </div>
      
      <InnovationHorizon layer={innovationHorizon} />

    </div>
  );
};

export default GenesisScoreDetail;
