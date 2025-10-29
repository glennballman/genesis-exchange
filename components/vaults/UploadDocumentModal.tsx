
import React, { useState, useRef } from 'react';
import { VaultId } from '../../types';
import { vaultStore } from '../../services/vaultStore';
import { Icon } from '../ui/Icon';

interface UploadDocumentModalProps {
    vaultId: VaultId;
    onClose: () => void;
    onUploadComplete: () => void;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ vaultId, onClose, onUploadComplete }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles(Array.from(event.target.files));
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setIsUploading(true);
        
        // Simulate upload and analysis for each file
        for (const file of files) {
            await vaultStore.addDocument(vaultId, file);
        }

        setIsUploading(false);
        onUploadComplete();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">Upload to {vaultId} Vault</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <div className="p-6">
                    <div 
                        className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-500 hover:bg-slate-800/50"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Icon name="dd" className="w-12 h-12 mx-auto text-gray-500 mb-2" />
                        <p className="text-gray-400">Drag & drop files here or click to select</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                    {files.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-white mb-2">Selected files:</p>
                            <ul className="space-y-1 text-sm text-gray-300">
                                {files.map((file, i) => (
                                    <li key={i} className="truncate">{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <footer className="p-4 border-t border-slate-700 flex justify-end">
                    <button 
                        onClick={handleUpload} 
                        disabled={files.length === 0 || isUploading}
                        className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 disabled:bg-gray-600 w-48"
                    >
                        {isUploading ? (
                            <>
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                Uploading & Analyzing...
                            </>
                        ) : (
                            `Upload ${files.length} File(s)`
                        )}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default UploadDocumentModal;
