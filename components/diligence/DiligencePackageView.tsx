import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DiligencePackage, DiligenceItem } from '../../types';
import { diligenceService } from '../../services/diligenceService';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import DiligenceItemRow from './DiligenceItemRow';
import SharePackageModal from './SharePackageModal';
import { companyPrincipal } from '../../data/principals';
import AlignmentWorkspace from './AlignmentWorkspace';

const DiligencePackageView: React.FC = () => {
    const { packageId } = useParams<{ packageId: string }>();
    const [pkg, setPkg] = useState<DiligencePackage | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'investor' | 'founder' | 'overall' | 'sub'>('investor');

    useEffect(() => {
        if (packageId) {
            const interval = setInterval(() => {
                 setPkg(diligenceService.getPackage(packageId));
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [packageId, refreshKey]);

    const handleUpdate = () => {
        setRefreshKey(prev => prev + 1);
    };

    if (!pkg) {
        return <div className="text-center p-8 text-gray-400">Loading Diligence Room...</div>;
    }

    const investorRequests = pkg.items.filter(item => item.authorId !== companyPrincipal.id);
    const founderRequests = pkg.items.filter(item => item.authorId === companyPrincipal.id);

    const approvedInvestorItems = investorRequests.filter(item => item.status === 'Approved').length;
    const investorProgress = investorRequests.length > 0 ? (approvedInvestorItems / investorRequests.length) * 100 : 0;

    const respondedFounderItems = founderRequests.filter(item => item.status !== 'Awaiting Response').length;
    const founderProgress = founderRequests.length > 0 ? (respondedFounderItems / founderRequests.length) * 100 : 0;

    const TabButton: React.FC<{ tabId: 'investor' | 'founder' | 'overall' | 'sub'; label: string; count?: number; score?: number }> = ({ tabId, label, count, score }) => {
        const isActive = activeTab === tabId;
        const scoreColor = score && score > 75 ? 'text-green-400' : 'text-yellow-400';
        return (
            <button onClick={() => setActiveTab(tabId)} className={`${isActive ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm flex items-center gap-2`}>
                {label}
                {count !== undefined && <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700 text-gray-300'}`}>{count}</span>}
                {score !== undefined && <span className={`font-bold ${scoreColor}`}>{`[${score}%]`}</span>}
            </button>
        );
    };

    return (
        <>
            <div className="space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <Link to="/due-diligence" className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Back to Diligence Hub
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Diligence Room: {pkg.investorName}</h1>
                    </div>
                    <button onClick={() => setIsShareModalOpen(true)} className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-500 transition-colors">
                        <Icon name="share" className="w-5 h-5" />
                        Share Room
                    </button>
                </div>

                <Card className="!p-0">
                     <div className="px-6">
                        <div className="border-b border-slate-700">
                            <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                                <TabButton tabId="investor" label="Investor Requests" count={investorRequests.length} />
                                <TabButton tabId="founder" label="My Requests" count={founderRequests.length} />
                                <TabButton tabId="overall" label="Overall Alignment" score={pkg.liveAlignmentReport?.alignmentScore} />
                                <TabButton tabId="sub" label="Sub-Alignment" />
                            </nav>
                        </div>
                    </div>
                    
                    {activeTab === 'investor' && (
                        <>
                            <div className="p-6">
                                <h3 className="text-sm font-semibold text-white mb-2">Response Progress</h3>
                                <div className="flex justify-between text-xs mb-1"><span className="text-gray-300">{approvedInvestorItems} of {investorRequests.length} items approved</span><span className="font-medium text-white">{investorProgress.toFixed(0)}%</span></div>
                                <div className="w-full bg-slate-700 rounded-full h-2.5"><div className="bg-cyan-500 h-2.5 rounded-full" style={{width: `${investorProgress}%`}}></div></div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-400 uppercase bg-slate-900/50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 w-1/3">Request</th>
                                            <th scope="col" className="px-6 py-3 w-2/3">Response & Evidence</th>
                                            <th scope="col" className="px-6 py-3 text-center">Status</th>
                                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>{investorRequests.map(item => <DiligenceItemRow key={item.id} item={item} packageId={pkg.id} onUpdate={handleUpdate} />)}</tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === 'founder' && (
                         <>
                            <div className="p-6 flex justify-between items-center">
                                <div>
                                    <h3 className="text-sm font-semibold text-white mb-2">Response Progress</h3>
                                    <div className="flex justify-between text-xs mb-1"><span className="text-gray-300">{respondedFounderItems} of {founderRequests.length} items answered</span><span className="font-medium text-white">{founderProgress.toFixed(0)}%</span></div>
                                    <div className="w-full bg-slate-700 rounded-full h-2.5"><div className="bg-purple-500 h-2.5 rounded-full" style={{width: `${founderProgress}%`}}></div></div>
                                </div>
                                <button onClick={() => {diligenceService.addFounderRequest(pkg.id, 'New Founder Request'); handleUpdate();}} className="text-xs font-semibold text-cyan-400 hover:underline">+ Add Request</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-400 uppercase bg-slate-900/50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 w-1/3">Request</th>
                                            <th scope="col" className="px-6 py-3 w-2/3">Response & Evidence</th>
                                            <th scope="col" className="px-6 py-3 text-center">Status</th>
                                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>{founderRequests.map(item => <DiligenceItemRow key={item.id} item={item} packageId={pkg.id} onUpdate={handleUpdate} />)}</tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === 'overall' && <AlignmentWorkspace pkg={pkg} onUpdate={handleUpdate} />}
                    {activeTab === 'sub' && <div className="p-6 text-gray-400">Sub-Alignment workspace coming soon.</div>}

                </Card>
            </div>
            {isShareModalOpen && (
                <SharePackageModal
                    pkg={pkg}
                    onClose={() => setIsShareModalOpen(false)}
                    onShare={handleUpdate}
                />
            )}
        </>
    );
};

export default DiligencePackageView;
