
import React from 'react';
import { WizardFormData } from '../../types';

interface Step3Props {
    nextStep: () => void;
    prevStep: () => void;
    data: WizardFormData;
    updateData: (data: Partial<WizardFormData>) => void;
}

const Step3Financials: React.FC<Step3Props> = ({ nextStep, prevStep, data, updateData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateData({ [e.target.name]: Number(e.target.value) });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-1">Financial Snapshot</h2>
            <p className="text-gray-400 mb-6">Provide a high-level look at your current financials (USD).</p>
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
                <div>
                    <label htmlFor="monthlyRevenue" className="block text-sm font-medium text-gray-300 mb-1">Average Monthly Revenue (MRR)</label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-gray-400 sm:text-sm">$</span></div>
                        <input type="number" name="monthlyRevenue" id="monthlyRevenue" value={data.monthlyRevenue} onChange={handleChange} required className="w-full pl-7 pr-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none" />
                    </div>
                </div>
                <div>
                    <label htmlFor="monthlyBurn" className="block text-sm font-medium text-gray-300 mb-1">Average Monthly Burn</label>
                     <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-gray-400 sm:text-sm">$</span></div>
                        <input type="number" name="monthlyBurn" id="monthlyBurn" value={data.monthlyBurn} onChange={handleChange} required className="w-full pl-7 pr-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none" />
                    </div>
                </div>
                <div className="flex justify-between pt-4">
                    <button type="button" onClick={prevStep} className="px-6 py-2 text-sm font-semibold text-gray-300 hover:text-white">Back</button>
                    <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500">Review</button>
                </div>
            </form>
        </div>
    );
};

export default Step3Financials;
