
import React, { useState } from 'react';
import { WizardFormData } from '../../types';
import { Card } from '../ui/Card';
import Step1IndividualWelcome from './Step1IndividualWelcome';
import Step2IndividualCoreProfile from './Step2IndividualCoreProfile';
import Step3IndividualAchievements from './Step3IndividualAchievements';
import Step4IndividualGoals from './Step4IndividualGoals';
import Step5IndividualInterests from './Step5IndividualInterests';
import Step6IndividualReview from './Step6IndividualReview';
import Step7IndividualComplete from './Step7IndividualComplete';

const IndividualIntakeWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<WizardFormData>({
        achievements: [{ id: '1', description: '' }],
        goals: [{ id: '1', description: '' }],
        interests: [{ id: '1', description: '' }],
    });

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const updateData = (data: Partial<WizardFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const submit = () => {
        // Placeholder for submitting data
        console.log('Submitting:', formData);
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
                return <Step7IndividualComplete />;
            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-white">Individual Intake Wizard</h1>
            <Card>
                {renderStep()}
            </Card>
        </div>
    );
};

export default IndividualIntakeWizard;
