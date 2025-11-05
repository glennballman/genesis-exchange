
import React from 'react';
import { IndividualGumpScore, ScoreSnapshot, CompletedModule, VaultDocument } from '../../types';
import ScoreCard from '../score/ScoreCard';
import ScoreChartCard from '../score/ScoreChartCard';
import GenesisUCard from '../score/GenesisUCard';
import VaultCard from '../score/VaultCard';

interface ScoreDashboardProps {
  igs: IndividualGumpScore;
  scoreHistory: ScoreSnapshot[];
  completedModules: CompletedModule[];
  documents: VaultDocument[];
}

const ScoreDashboard: React.FC<ScoreDashboardProps> = ({ igs, scoreHistory, completedModules, documents }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <ScoreCard igs={igs} />

      <ScoreChartCard scoreHistory={scoreHistory} />

      <GenesisUCard completedModules={completedModules} />

      <VaultCard documents={documents} />
    </div>
  );
};

export default ScoreDashboard;