
import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';

interface WizardLayoutProps {
    children: React.ReactNode;
    currentStep: number;
    totalSteps: number;
}

const WizardLayout: React.FC<WizardLayoutProps> = ({ children, currentStep, totalSteps }) => {
    const progressPercentage = ((currentStep -1) / (totalSteps - 1)) * 100;

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-3xl">
                <header className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-white">
                        <Icon name="logo" className="w-7 h-7 text-cyan-400" />
                        <span className="font-bold text-xl">Genesis Intake Wizard</span>
                    </div>
                    <Link to="/" className="text-sm text-gray-400 hover:text-white transition">Exit</Link>
                </header>

                {currentStep < totalSteps && (
                    <div className="mb-8">
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-cyan-300">Progress</span>
                            <span className="text-sm font-medium text-cyan-300">Step {currentStep} of {totalSteps - 1}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2.5">
                            <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                )}

                <main className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 shadow-2xl">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default WizardLayout;
