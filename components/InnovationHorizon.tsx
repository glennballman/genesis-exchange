
import React from 'react';
import { InnovationLayer } from '../types';
import { Icon } from './ui/Icon';

interface InnovationHorizonProps {
  layer: InnovationLayer;
}

const InnovationHorizon: React.FC<InnovationHorizonProps> = ({ layer }) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold tracking-tight text-white mb-1">{layer.layer_name}</h3>
      <p className="text-sm text-gray-400 mb-6">{layer.description}</p>
      <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {layer.modules.map((module) => (
            <div key={module.name} className="flex items-start space-x-3 group">
              <div className="mt-1 flex-shrink-0">
                <Icon name="horizon" className="w-5 h-5 text-gray-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-300 group-hover:text-white transition-colors">{module.name}</h5>
                <p className="text-xs text-gray-500">{module.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InnovationHorizon;
