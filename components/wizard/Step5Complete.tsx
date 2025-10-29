
import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';

const Step5Complete: React.FC = () => {
    return (
        <div className="text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Icon name="logo" className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Submission Complete!</h2>
            <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                Thank you. We are now processing your information and calibrating your Genesis Score. You can view your updated score on the dashboard.
            </p>
            <Link to="/">
                <button
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition-all duration-200 mx-auto"
                >
                    Return to Dashboard
                </button>
            </Link>
        </div>
    );
};

export default Step5Complete;
