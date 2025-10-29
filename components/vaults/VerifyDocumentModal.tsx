import React, { useState } from 'react';
import { VaultDocument } from '../../types';
import { vaultStore } from '../../services/vaultStore';
import { Icon } from '../ui/Icon';

interface VerifyDocumentModalProps {
    document: VaultDocument;
    onClose: () => void;
    onVerified: () => void;
}

const VerifyDocumentModal: React.FC<VerifyDocumentModalProps> = ({ document, onClose, onVerified }) => {
    const [url, setUrl] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!url.trim()) {
            setError('Please enter a valid URL.');
            return;
        }
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            setError('URL must start with http:// or https://');
            return;
        }
        setError('');
        setIsVerifying(true);

        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1500));

        vaultStore.verifyDocument(document.id, url);
        
        setIsVerifying(false);
        onVerified();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Verify Public Document</h2>
                        <p className="text-sm text-gray-400 truncate">{document.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-300">
                        Link this document to its public record (e.g., on Google Patents or USPTO.gov) to verify its authenticity and earn a score bonus.
                    </p>
                    <div>
                        <label htmlFor="verification-url" className="block text-sm font-medium text-gray-300 mb-1">Public Record URL</label>
                        <input
                            id="verification-url"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://patents.google.com/patent/..."
                            className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
                    </div>
                </div>

                <footer className="p-4 border-t border-slate-700 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white">Cancel</button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={isVerifying}
                        className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 disabled:bg-gray-600 w-40"
                    >
                        {isVerifying ? (
                            <>
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                Verifying...
                            </>
                        ) : (
                            'Verify & Add Bonus'
                        )}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default VerifyDocumentModal;
