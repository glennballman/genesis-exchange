
import React from 'react';
import { WizardFormData } from '../../types';

interface Step4Props {
    nextStep: () => void;
    prevStep: () => void;
    data: WizardFormData;
    goToStep: (step: number) => void;
}

const ReviewItem: React.FC<{ label: string; value: string | number; step: number; onEdit: (step: number) => void }> = ({ label, value, step, onEdit }) => (
    <div className="flex justify-between items-center py-3 border-b border-slate-700">
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="font-semibold text-white">{typeof value === 'number' ? `$${value.toLocaleString()}` : value}</p>
        </div>
        <button onClick={() => onEdit(step)} className="text-sm text-cyan-400 hover:text-cyan-300">Edit</button>
    </div>
);

const Step4Review: React.FC<Step4Props> = ({ nextStep, prevStep, data, goToStep }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-1">Review Your Information</h2>
            <p className="text-gray-400 mb-6">Please confirm the details below before we calculate your score.</p>
            <div className="space-y-2">
                <ReviewItem label="Company Name" value={data.companyName} step={2} onEdit={goToStep} />
                <ReviewItem label="Industry" value={data.industry} step={2} onEdit={goToStep} />
                <ReviewItem label="One-Liner" value={data.oneLiner} step={2} onEdit={goToStep} />
                <ReviewItem label="Monthly Revenue" value={data.monthlyRevenue} step={3} onEdit={goToStep} />
                <ReviewItem label="Monthly Burn" value={data.monthlyBurn} step={3} onEdit={goToStep} />
            </div>
            <div className="flex justify-between pt-8">
                <button type="button" onClick={prevStep} className="px-6 py-2 text-sm font-semibold text-gray-300 hover:text-white">Back</button>
                <button type="button" onClick={nextStep} className="px-6 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500">Submit & Calculate Score</button>
            </div>
        </div>
    );
};

export default Step4Review;
