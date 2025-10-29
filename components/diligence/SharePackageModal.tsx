import React, { useState } from 'react';
import { DiligencePackage } from '../../types';
import { diligenceService } from '../../services/diligenceService';
import { Icon } from '../ui/Icon';

interface SharePackageModalProps {
    pkg: DiligencePackage;
    onClose: () => void;
    onShare: () => void;
}

const SharePackageModal: React.FC<SharePackageModalProps> = ({ pkg, onClose, onShare }) => {
    const [isShared, setIsShared] = useState(!!pkg.sharingLink);
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedPasscode, setCopiedPasscode] = useState(false);
    const [investorEmail, setInvestorEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleShare = () => {
        diligenceService.sharePackage(pkg.id);
        setIsShared(true);
        onShare();
    };

    const handleCopy = async (text: string, type: 'link' | 'passcode') => {
        try {
            await navigator.clipboard.writeText(text);
            if (type === 'link') setCopiedLink(true);
            if (type === 'passcode') setCopiedPasscode(true);
            setTimeout(() => {
                setCopiedLink(false);
                setCopiedPasscode(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy. Please select the text and copy manually.');
        }
    };

    const handleSendEmail = async () => {
        if (!investorEmail || !pkg.sharingLink || !pkg.accessPasscode) return;
        
        setIsSending(true);
        setSent(false);

        // Simulate sending an email
        console.log("--- SIMULATING EMAIL ---");
        console.log("To:", investorEmail);
        console.log("Subject:", `${pkg.investorName} has sent you a link to a Due Diligence Room`);
        console.log("Body:", `
            Hello,

            You have been invited to a secure Diligence Room for ${pkg.investorName}.

            Please use the following link and passcode to access the materials:
            Link: ${pkg.sharingLink}
            Passcode: ${pkg.accessPasscode}

            Thank you,
            The Genesis Exchange Team
        `);
        console.log("------------------------");

        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSending(false);
        setSent(true);
        setTimeout(() => setSent(false), 3000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">Share Diligence Room</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                {!isShared ? (
                    <div className="p-6 text-center">
                        <Icon name="share" className="w-12 h-12 mx-auto text-cyan-400 mb-4" />
                        <h3 className="text-xl font-semibold text-white">Generate a Secure Link</h3>
                        <p className="text-gray-300 mt-2 mb-6">
                            Create a live, secure data room for {pkg.investorName}. They will receive a link and a one-time passcode to view the approved documents. You can revoke access at any time.
                        </p>
                        <button onClick={handleShare} className="w-full sm:w-auto px-6 py-2.5 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500">
                            Generate & Activate Room
                        </button>
                    </div>
                ) : (
                    <div className="p-6 space-y-6">
                        <div>
                            <h3 className="text-md font-semibold text-white mb-2">Share via Email</h3>
                             <div className="flex gap-2">
                                <input type="email" placeholder="Investor's email address" value={investorEmail} onChange={e => setInvestorEmail(e.target.value)} className="w-full px-3 py-2 bg-slate-900/70 border border-slate-600 rounded-md font-mono text-sm" />
                                <button onClick={handleSendEmail} disabled={!investorEmail || isSending || sent} className="w-32 flex-shrink-0 px-3 py-2 bg-cyan-600 rounded-md hover:bg-cyan-500 text-sm font-semibold disabled:bg-slate-600">
                                    {isSending ? 'Sending...' : sent ? 'Sent!' : 'Send Invite'}
                                </button>
                            </div>
                        </div>

                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-slate-700"></div>
                            <span className="flex-shrink mx-4 text-xs text-gray-500">OR</span>
                            <div className="flex-grow border-t border-slate-700"></div>
                        </div>

                        <div>
                            <h3 className="text-md font-semibold text-white mb-2">Share Manually</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Secure Link</label>
                                    <div className="flex gap-2">
                                        <input type="text" readOnly value={pkg.sharingLink} className="w-full px-3 py-2 bg-slate-900/70 border border-slate-600 rounded-md font-mono text-sm" />
                                        <button onClick={() => handleCopy(pkg.sharingLink!, 'link')} className="px-3 py-2 bg-slate-700 rounded-md hover:bg-slate-600 text-sm w-20 flex-shrink-0">
                                            {copiedLink ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">One-Time Passcode</label>
                                    <div className="flex gap-2">
                                        <input type="text" readOnly value={pkg.accessPasscode} className="w-full px-3 py-2 bg-slate-900/70 border border-slate-600 rounded-md font-mono text-lg tracking-widest" />
                                        <button onClick={() => handleCopy(pkg.accessPasscode!, 'passcode')} className="px-3 py-2 bg-slate-700 rounded-md hover:bg-slate-600 text-sm w-20 flex-shrink-0">
                                            {copiedPasscode ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {pkg.requestMethod === 'Email' && (
                             <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg text-yellow-300 text-xs">
                                <p className="font-bold mb-1">Delivery Warning</p>
                                <p>Since this request originated via email, be mindful of file sizes. For large files (videos, high-res PDFs), we strongly recommend sharing via the secure link instead of downloading a ZIP file.</p>
                            </div>
                        )}
                    </div>
                )}

                <footer className="p-4 border-t border-slate-700 flex justify-between items-center">
                    <button className="text-sm font-semibold text-gray-400 hover:text-white">Download as ZIP</button>
                    <button onClick={onClose} className="px-6 py-2 text-sm font-semibold text-white bg-slate-600 rounded-md hover:bg-slate-500">
                        Done
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default SharePackageModal;
