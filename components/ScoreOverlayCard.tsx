
import React from 'react';
import { Overlay } from '../types';
import { Card } from './ui/Card';
import { Icon } from './ui/Icon';

interface ScoreOverlayCardProps {
  overlay: Overlay;
}

const overlayIcons: { [key: string]: React.ComponentProps<typeof Icon>['name'] } = {
    'Stealth Moat Layer (SML)': 'stealth',
    'Cultural Fluency Layer (CFL / GUMP)': 'fluency',
    'Regulatory Tailwind Layer (RTL)': 'regulation',
};


const ScoreOverlayCard: React.FC<ScoreOverlayCardProps> = ({ overlay }) => {
  const percentage = (overlay.current_points / overlay.max_points) * 100;
  const iconName = overlayIcons[overlay.name] || 'default';

  return (
    <Card>
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-white text-lg">{overlay.name}</h4>
        <div className="p-2 bg-slate-700/50 rounded-md">
            <Icon name={iconName} className="w-5 h-5 text-violet-400" />
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-1 h-10">{overlay.details}</p>
      <div className="mt-4">
        <div className="flex justify-between items-baseline text-sm mb-1">
          <span className="font-bold text-violet-300 text-xl">
            {overlay.current_points.toLocaleString()}
          </span>
          <span className="text-gray-400">/ {overlay.max_points.toLocaleString()} pts</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
          <div
            className="bg-violet-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

export default ScoreOverlayCard;
