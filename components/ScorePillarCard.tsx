
import React from 'react';
import { Pillar } from '../types';
import { Card } from './ui/Card';
import { Icon } from './ui/Icon';

interface ScorePillarCardProps {
  pillar: Pillar;
}

const pillarIcons: { [key: string]: React.ComponentProps<typeof Icon>['name'] } = {
  'Team': 'team',
  'IP': 'ip',
  'DD Preparedness': 'dd',
  'Distribution/Market': 'market',
  'Traction/Health': 'traction',
  'GUMP (Genesis U Mastery Pillar)': 'gump',
};

const ScorePillarCard: React.FC<ScorePillarCardProps> = ({ pillar }) => {
  const percentage = (pillar.current_points / pillar.max_points) * 100;
  const iconName = pillarIcons[pillar.name] || 'default';

  return (
    <Card>
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-white text-lg">{pillar.name}</h4>
        <div className="p-2 bg-slate-700/50 rounded-md">
            <Icon name={iconName} className="w-5 h-5 text-cyan-400" />
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-1 h-10">{pillar.details}</p>
      <div className="mt-4">
        <div className="flex justify-between items-baseline text-sm mb-1">
          <span className="font-bold text-cyan-300 text-xl">
            {pillar.current_points.toLocaleString()}
          </span>
          <span className="text-gray-400">/ {pillar.max_points.toLocaleString()} pts</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
          <div
            className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

export default ScorePillarCard;
