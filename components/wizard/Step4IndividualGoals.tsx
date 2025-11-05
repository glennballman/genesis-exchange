
import React from 'react';
import { WizardFormData } from '../../types';
import DynamicListInput from './DynamicListInput';

interface Step4IndividualGoalsProps {
    nextStep: () => void;
    prevStep: () => void;
    data: WizardFormData;
    updateData: (data: Partial<WizardFormData>) => void;
}

const Step4IndividualGoals: React.FC<Step4IndividualGoalsProps> = ({ nextStep, prevStep, data, updateData }) => {

    const setGoals = (goals: { id: string; description: string }[]) => {
        updateData({ goals });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-1">Personal & Professional Goals</h2>
            <p className="text-gray-400 mb-6">What are your key goals for the next 1-3 years?</p>
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
                <DynamicListInput 
                    items={data.goals || [{ id: '1', description: '' }]}
                    setItems={setGoals}
                    placeholder="e.g., Secure Series A funding"
                />
                <div className="flex justify-between pt-4">
                    <button type="button" onClick={prevStep} className="px-6 py-2 text-sm font-semibold text-gray-300 hover:text-white">Back</button>
                    <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500">Next</button>
                </div>
            </form>
        </div>
    );
};

export default Step4IndividualGoals;
