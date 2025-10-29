import React from 'react';

interface AddMemberModalProps {
    onClose: () => void;
    // onAddMember will be re-implemented with the new User structure
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">Add Team Member</h2>
                     <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <div className="p-8 text-center">
                    <h3 className="text-xl font-semibold text-white">Coming Soon: Advanced Member Profile Builder</h3>
                    <p className="text-gray-400 mt-2">
                        A new multi-step wizard is being developed to capture detailed professional achievements for accurate Individual Gump Score (IGS) calculation.
                    </p>
                </div>
                 <footer className="p-4 border-t border-slate-700 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white">Close</button>
                </footer>
            </div>
        </div>
    );
};

export default AddMemberModal;
