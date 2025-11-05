import React from 'react';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { CompletedModule } from '../../../types';

interface GenesisUCardProps {
  completedModules: CompletedModule[];
}

const GenesisUCard: React.FC<GenesisUCardProps> = ({ completedModules }) => {
  return (
    <Card className="lg:col-span-1">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
        <Icon name="education" className="w-6 h-6" />
        Genesis U Modules
      </h2>
      <div className="space-y-3">
        {completedModules.map(module => (
          <div key={module.moduleId} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div>
              <p className="font-semibold text-white">{module.title}</p>
              <p className="text-xs text-gray-400">Completed: {module.completedAt}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-cyan-400">+{module.pointsAwarded}</p>
              <p className="text-xs text-gray-400">Points</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GenesisUCard;