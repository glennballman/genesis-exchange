import React from 'react';
import { IndividualGumpScore } from '../../../types';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';

interface ScoreCardProps {
  igs: IndividualGumpScore;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ igs }) => {
  return (
    <Card className="lg:col-span-1">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
        <Icon name="star" className="w-6 h-6" />
        IGS Score & Pillars
      </h2>
      <div className="text-center">
        <p className="text-6xl font-bold text-cyan-400">{igs.total}</p>
        <p className="text-gray-400">Individual Genesis Score</p>
      </div>
    </Card>
  );
};

export default ScoreCard;