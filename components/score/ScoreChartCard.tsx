import React from 'react';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { ScoreSnapshot } from '../../../types';
import ScoreHistoryChart from '../charts/ScoreHistoryChart';

interface ScoreChartCardProps {
  scoreHistory: ScoreSnapshot[];
}

const ScoreChartCard: React.FC<ScoreChartCardProps> = ({ scoreHistory }) => {
  return (
    <Card className="lg:col-span-2">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
        <Icon name="chart" className="w-6 h-6" />
        IGS Score Over Time
      </h2>
      <div style={{ height: '250px' }}>
        <ScoreHistoryChart data={scoreHistory} />
      </div>
    </Card>
  );
};

export default ScoreChartCard;