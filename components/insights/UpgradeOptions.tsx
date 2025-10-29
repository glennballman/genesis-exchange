import React from 'react';
import { IpAnalysisTier } from '../../types';

interface UpgradeOptionsProps {
    currentTier: IpAnalysisTier;
}

const UpgradeOptions: React.FC<UpgradeOptionsProps> = ({ currentTier }) => {
    const showPremium = currentTier === 'free';
    const showInternational = currentTier === 'free' || currentTier === 'premium';

    if (currentTier === 'international') {
        return null; // No more upgrades available
    }

    return (
        <div className="mt-6 space-y-4">
            {showPremium && (
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 rounded-lg border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h4 className="font-semibold text-white">Unlock Deeper Insights with Premium Analysis</h4>
                        <p className="text-xs text-gray-300 mt-1">Go beyond the basics with an expanded search across global legal databases, market landscape analysis, and detailed litigation history checks.</p>
                    </div>
                    <button onClick={() => alert('Premium Analysis feature coming soon!')} className="flex-shrink-0 px-4 py-2 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                        Upgrade for $5.00
                    </button>
                </div>
            )}
            {showInternational && (
                 <div className="bg-gradient-to-r from-purple-500/10 to-rose-500/10 p-4 rounded-lg border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h4 className="font-semibold text-white">Conduct International Patent Search</h4>
                        <p className="text-xs text-gray-300 mt-1">Perform a premium analysis that includes searches across international patent offices (EPO, WIPO) for a comprehensive global IP landscape view.</p>
                    </div>
                    <button onClick={() => alert('International Analysis feature coming soon!')} className="flex-shrink-0 px-4 py-2 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                        Upgrade for $10.00
                    </button>
                </div>
            )}
        </div>
    );
};

export default UpgradeOptions;
