import React, { useState, useEffect } from 'react';
import { VaultDocument, User } from '../../types';
import { vaultStore } from '../../services/vaultStore';
import { teamStore } from '../../services/teamStore';
import { Icon } from '../ui/Icon';

interface VerifyTeamMemberModalProps {
    document: VaultDocument;
    onClose: () => void;
    onVerified: () => void;
}

const VerifyTeamMemberModal: React.FC<VerifyTeamMemberModalProps> = ({ document, onClose, onVerified }) => {
    const [team, setTeam] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [url, setUrl] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const teamMembers = teamStore.getTeam();
        setTeam(teamMembers);
        if (teamMembers.length > 0) {
            setSelectedUserId(teamMembers[0].id);
        }
    }, []);

    const handleSubmit = async () => {
        if (!selectedUserId) {
            setError('Please select a team member.');
            return;
        }
        if (!url.trim() || !url.startsWith('https://')) {
            setError('Please enter a valid LinkedIn URL (starting with https://).');
            return;
        }
        setError('');
        setIsVerifying(true);

        await new Promise(resolve => setTimeout(resolve, 1500));

        vaultStore.verifyTeamDocument(document.id, selectedUserId, url);
        
        setIsVerifying(false);
        onVerified();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Verify Team Member Profile</h2>
                        <p className="text-sm text-gray-400 truncate">Document: {document.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-300">
                        Link this document to a team member and their public LinkedIn profile to verify their credentials and earn a score bonus.
                    </p>
                    <div>
                        <label htmlFor="team-member-select" className="block text-sm font-medium text-gray-300 mb-1">Team Member</label>
                        <select
                            id="team-member-select"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                        >
                            {team.map(member => (
                                <option key={member.id} value={member.id}>{member.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="verification-url" className="block text-sm font-medium text-gray-300 mb-1">LinkedIn Profile URL</label>
                        <input
                            id="verification-url"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.linkedin.com/in/..."
                            className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
                    </div>
                </div>

                <footer className="p-4 border-t border-slate-700 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white">Cancel</button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={isVerifying || !selectedUserId}
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

export default VerifyTeamMemberModal;
