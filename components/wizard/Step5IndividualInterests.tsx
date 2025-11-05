
import React from 'react';
import { WizardFormData } from '../../types';
import DynamicListInput from './DynamicListInput';

interface Step5IndividualInterestsProps {
    nextStep: () => void;
    prevStep: () => void;
    data: WizardFormData;
    updateData: (data: Partial<WizardFormData>) => void;
}

const Step5IndividualInterests: React.FC<Step5IndividualInterestsProps> = ({ nextStep, prevStep, data, updateData }) => {

    const setInterests = (interests: { id: string; description: string }[]) => {
        updateData({ interests });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-1">Interests & Passions</h2>
            <p className="text-gray-400 mb-6">What are you passionate about outside of your primary work?</p>
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
                <DynamicListInput 
                    items={data.interests || [{ id: '1', description: '' }]}
                    setItems={setInterests}
                    placeholder="e.g., Angel investing in climate tech"
                />
                <div className="flex justify-between pt-4">
                    <button type="button" onClick={prevStep} className="px-6 py-2 text-sm font-semibold text-gray-300 hover:text-white">Back</button>
                    <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500">Next</button>
                </div>
            </form>
        </div>
    );
};

export default Step5IndividualInterests;
