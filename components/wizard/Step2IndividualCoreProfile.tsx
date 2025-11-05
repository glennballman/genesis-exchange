
import React from 'react';
import { WizardFormData } from '../../types';

interface Step2IndividualCoreProfileProps {
    nextStep: () => void;
    prevStep: () => void;
    data: WizardFormData;
    updateData: (data: Partial<WizardFormData>) => void;
}

const Step2IndividualCoreProfile: React.FC<Step2IndividualCoreProfileProps> = ({ nextStep, prevStep, data, updateData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateData({ [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-1">Core Profile</h2>
            <p className="text-gray-400 mb-6">Tell us a bit about you.</p>
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <input type="text" name="fullName" id="fullName" value={data.fullName || ''} onChange={handleChange} required className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                    <input type="text" name="title" id="title" value={data.title || ''} onChange={handleChange} placeholder="e.g., CTO, Founder" required className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                    <input type="text" name="role" id="role" value={data.role || ''} onChange={handleChange} placeholder="e.g., Team Member" required className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
                <div>
                    <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-300 mb-1">LinkedIn URL <span className="text-gray-500">(optional)</span></label>
                    <input type="text" name="linkedinUrl" id="linkedinUrl" value={data.linkedinUrl || ''} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none" />
                </div>
                <div className="flex justify-between pt-4">
                    <button type="button" onClick={prevStep} className="px-6 py-2 text-sm font-semibold text-gray-300 hover:text-white">Back</button>
                    <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500">Next</button>
                </div>
            </form>
        </div>
    );
};

export default Step2IndividualCoreProfile;
