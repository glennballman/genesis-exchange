
import React from 'react';
import { WizardFormData } from '../../types';

interface Step2Props {
    nextStep: () => void;
    prevStep: () => void;
    data: WizardFormData;
    updateData: (data: Partial<WizardFormData>) => void;
}

const Step2CompanyInfo: React.FC<Step2Props> = ({ nextStep, prevStep, data, updateData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateData({ [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-1">Company Profile</h2>
            <p className="text-gray-400 mb-6">Tell us about your venture.</p>
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-1">Company Name</label>
                    <input type="text" name="companyName" id="companyName" value={data.companyName} onChange={handleChange} required className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
                <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-1">Industry</label>
                    <input type="text" name="industry" id="industry" value={data.industry} onChange={handleChange} placeholder="e.g., FinTech, SaaS, Biotech" required className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
                <div>
                    <label htmlFor="oneLiner" className="block text-sm font-medium text-gray-300 mb-1">One-Liner</label>
                    <textarea name="oneLiner" id="oneLiner" value={data.oneLiner} onChange={handleChange} rows={2} required className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none" placeholder="What does your company do in one sentence?"></textarea>
                </div>
                <div className="flex justify-between pt-4">
                    <button type="button" onClick={prevStep} className="px-6 py-2 text-sm font-semibold text-gray-300 hover:text-white">Back</button>
                    <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500">Next</button>
                </div>
            </form>
        </div>
    );
};

export default Step2CompanyInfo;
