
import React, { useState } from 'react';
import { WizardFormData } from '../../types';
import WizardLayout from './WizardLayout';
import Step1Welcome from './Step1Welcome';
import Step2CompanyInfo from './Step2CompanyInfo';
import Step3Financials from './Step3Financials';
import Step4Review from './Step4Review';
import Step5Complete from './Step5Complete';

const TOTAL_STEPS = 5;

const IntakeWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<WizardFormData>({
        companyName: '',
        industry: '',
        oneLiner: '',
        monthlyRevenue: 0,
        monthlyBurn: 0,
    });

    const nextStep = () => setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
    const goToStep = (stepNumber: number) => setStep(stepNumber);

    const updateFormData = (newData: Partial<WizardFormData>) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1Welcome nextStep={nextStep} />;
            case 2:
                return <Step2CompanyInfo nextStep={nextStep} prevStep={prevStep} data={formData} updateData={updateFormData} />;
            case 3:
                return <Step3Financials nextStep={nextStep} prevStep={prevStep} data={formData} updateData={updateFormData} />;
            case 4:
                return <Step4Review nextStep={nextStep} prevStep={prevStep} data={formData} goToStep={goToStep} />;
            case 5:
                return <Step5Complete />;
            default:
                return <Step1Welcome nextStep={nextStep} />;
        }
    };

    return (
        <WizardLayout currentStep={step} totalSteps={TOTAL_STEPS}>
            {renderStep()}
        </WizardLayout>
    );
};

export default IntakeWizard;
