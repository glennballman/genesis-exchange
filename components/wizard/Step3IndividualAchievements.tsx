
import React from 'react';
import { WizardFormData } from '../../types';
import DynamicListInput from './DynamicListInput';

interface Step3IndividualAchievementsProps {
    nextStep: () => void;
    prevStep: () => void;
    data: WizardFormData;
    updateData: (data: Partial<WizardFormData>) => void;
}

const Step3IndividualAchievements: React.FC<Step3IndividualAchievementsProps> = ({ nextStep, prevStep, data, updateData }) => {

    const setAchievements = (achievements: { id: string; description: string }[]) => {
        updateData({ achievements });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-1">Key Achievements</h2>
            <p className="text-gray-400 mb-6">List your most significant accomplishments, personal or professional.</p>
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
                <DynamicListInput 
                    items={data.achievements || [{ id: '1', description: '' }]}
                    setItems={setAchievements}
                    placeholder="e.g., Launched a product that reached 1M users"
                />
                <div className="flex justify-between pt-4">
                    <button type="button" onClick={prevStep} className="px-6 py-2 text-sm font-semibold text-gray-300 hover:text-white">Back</button>
                    <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500">Next</button>
                </div>
            </form>
        </div>
    );
};

export default Step3IndividualAchievements;
