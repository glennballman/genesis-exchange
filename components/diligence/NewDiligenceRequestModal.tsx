import React, { useState, useRef } from 'react';
import { diligenceService } from '../../services/diligenceService';
import { Icon } from '../ui/Icon';
import { RequestMethod } from '../../types';

interface NewDiligenceRequestModalProps {
    onClose: () => void;
    onRequestCreated: () => void;
}

const NewDiligenceRequestModal: React.FC<NewDiligenceRequestModalProps> = ({ onClose, onRequestCreated }) => {
    const [investorName, setInvestorName] = useState('');
    const [requestText, setRequestText] = useState('');
    const [requestMethod, setRequestMethod] = useState<RequestMethod>('Email');
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState('');

    const handleParse = () => {
        if (!investorName.trim() || !requestText.trim()) {
            setError('Investor name and request text are required.');
            return;
        }
        setError('');
        setIsParsing(true);

        // Fire and forget. Don't await the full process.
        diligenceService.createPackageFromText(investorName, requestText, requestMethod)
            .then(() => {
                // The initial package is created, now we can close the modal and refresh the hub.
                // The service will continue to populate the package in the background.
                onRequestCreated();
            })
            .catch((e) => {
                console.error(e);
                setError('Failed to parse the request. Please check the format and try again.');
                setIsParsing(false); // Stop spinning on error
            });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">Start New Diligence Request</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-300">
                        Paste the investor's diligence request email below, or upload their checklist. The AI Concierge will parse it into an actionable package.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="investorName" className="block text-sm font-medium text-gray-300 mb-1">Investor / Lender Name</label>
                            <input
                                id="investorName"
                                type="text"
                                value={investorName}
                                onChange={(e) => setInvestorName(e.target.value)}
                                placeholder="e.g., Sequoia Capital"
                                className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="requestMethod" className="block text-sm font-medium text-gray-300 mb-1">Request Received Via</label>
                            <select
                                id="requestMethod"
                                value={requestMethod}
                                onChange={(e) => setRequestMethod(e.target.value as RequestMethod)}
                                className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                            >
                                <option>Email</option>
                                <option>Verbal</option>
                                <option>Genesis Platform</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="requestText" className="block text-sm font-medium text-gray-300 mb-1">Paste Request List</label>
                        <textarea
                            id="requestText"
                            rows={10}
                            value={requestText}
                            onChange={(e) => setRequestText(e.target.value)}
                            placeholder="Paste the full diligence request list here..."
                            className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
                </div>

                <footer className="p-4 border-t border-slate-700 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white">Cancel</button>
                    <button 
                        onClick={handleParse} 
                        disabled={isParsing}
                        className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 disabled:bg-gray-600 w-48"
                    >
                        {isParsing ? (
                            <>
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                Parsing with AI...
                            </>
                        ) : (
                            'Parse & Create Package'
                        )}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default NewDiligenceRequestModal;
