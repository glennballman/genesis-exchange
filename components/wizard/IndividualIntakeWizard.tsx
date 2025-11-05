
import React, { useState, useEffect } from 'react';
import { User, WizardFormData } from '../../types';
import { Card } from '../ui/Card';
import Step1IndividualWelcome from './Step1IndividualWelcome';
import Step2IndividualCoreProfile from './Step2IndividualCoreProfile';
import Step3IndividualAchievements from './Step3IndividualAchievements';
import Step4IndividualGoals from './Step4IndividualGoals';
import Step5IndividualInterests from './Step5IndividualInterests';
import Step6IndividualReview from './Step6IndividualReview';
import Step7IndividualComplete from './Step7IndividualComplete';

interface IndividualIntakeWizardProps {
    user?: User;
    onClose: () => void;
}

const IndividualIntakeWizard: React.FC<IndividualIntakeWizardProps> = ({ user, onClose }) => {
    const [step, setStep] = useState(user ? 2 : 1);
    const [formData, setFormData] = useState<WizardFormData>({});

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.name,
                title: user.title,
                role: user.role,
                achievements: user.achievements.map(a => ({ id: a.id, description: a.description })),
                goals: user.goals.map(g => ({ id: g.id, description: g.description })),
                interests: user.interests.map(i => ({ id: i.id, description: i.description })),
            });
        } else {
            setFormData({
                achievements: [{ id: '1', description: '' }],
                goals: [{ id: '1', description: '' }],
                interests: [{ id: '1', description: '' }],
            });
        }
    }, [user]);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const updateData = (data: Partial<WizardFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const submit = () => {
        if (user) {
            console.log('Updating user:', { ...user, ...formData });
        } else {
            console.log('Creating new user:', formData);
        }
        nextStep();
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1IndividualWelcome nextStep={nextStep} />;
            case 2:
                return <Step2IndividualCoreProfile nextStep={nextStep} prevStep={prevStep} data={formData} updateData={updateData} />;
            case 3:
                return <Step3IndividualAchievements nextStep={nextStep} prevStep={prevStep} data={formData} updateData={updateData} />;
            case 4:
                return <Step4IndividualGoals nextStep={nextStep} prevStep={prevStep} data={formData} updateData={updateData} />;
            case 5:
                return <Step5IndividualInterests nextStep={nextStep} prevStep={prevStep} data={formData} updateData={updateData} />;
            case 6:
                return <Step6IndividualReview prevStep={prevStep} submit={submit} data={formData} />;
            case 7:
                return <Step7IndividualComplete onClose={onClose} isEditing={!!user} />;
            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-full overflow-y-auto">
                 <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h1 className="text-xl font-bold text-white">{user ? 'Edit Individual' : 'Add New Team Member'}</h1>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-6">
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

export default IndividualIntakeWizard;
