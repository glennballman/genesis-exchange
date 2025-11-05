
import React from 'react';
import { Icon } from '../ui/Icon';

interface Step1IndividualWelcomeProps {
    nextStep: () => void;
}

const Step1IndividualWelcome: React.FC<Step1IndividualWelcomeProps> = ({ nextStep }) => {
    return (
        <div className="text-center">
            <Icon name="wizard" className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Welcome.</h2>
            <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                This wizard will guide you through providing the essential data to build your profile. The more accurate your data, the better we can connect you with the right opportunities.
            </p>
            <button
                onClick={nextStep}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition-all duration-200 mx-auto"
            >
                Let's Begin
            </button>
        </div>
    );
};

export default Step1IndividualWelcome;
