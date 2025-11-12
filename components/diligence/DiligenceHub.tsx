import React, { useState, useEffect } from 'react';
import { DiligencePackage } from '../../types';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { diligenceService } from '../../services/diligenceService';
import NewDiligenceRequestModal from './NewDiligenceRequestModal';
import { Link } from 'react-router-dom';

const PackageStatusBadge: React.FC<{ status: DiligencePackage['status'] }> = ({ status }) => {
    const styles = {
        Draft: "bg-yellow-500/10 text-yellow-300",
        Shared: "bg-blue-500/10 text-blue-300",
        Complete: "bg-green-500/10 text-green-300",
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
};

const DiligenceHub: React.FC = () => {
    const [packages, setPackages] = useState<DiligencePackage[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const refreshPackages = () => {
        setPackages(diligenceService.getPackages());
    };

    useEffect(() => {
        refreshPackages();
    }, []);

    const handleRequestCreated = () => {
        setIsModalOpen(false);
        refreshPackages();
    };

    const handleTestAi = async () => {
        const testInvestorEmail = `
            Subject: Follow-up from our chat - Genesis Exchange Diligence Request

            Hi team,

            Following up on our conversation. We're excited about the potential of Genesis Exchange.

            To proceed, we'll need to see the following:
            1. Your latest pitch deck and financial model.
            2. A cap table.
            3. Bios of the key team members.
            4. Any patents or provisional patents you have filed.

            Looking forward to reviewing.

            Best,

            Chris
            ACME Ventures
        `;
        console.log("--- STARTING AI TEST ---");
        const newPackageId = await diligenceService.createPackageFromText("ACME Ventures", testInvestorEmail, "EMAIL");
        console.log(`--- New package created with ID: ${newPackageId} ---`);
        refreshPackages();
    };

    return (
        <>
            <div className="space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Diligence Hub</h1>
                        <p className="mt-1 text-gray-400">Manage investor data requests with your AI-powered Diligence Concierge.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleTestAi} className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-500 transition-colors">
                            <Icon name="beaker" className="w-5 h-5" />
                            Test AI
                        </button>
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition-colors">
                            <Icon name="wizard" className="w-5 h-5" />
                            Start New Diligence Request
                        </button>
                    </div>
                </div>

                <Card className="!p-0">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-white">Diligence Packages</h2>
                    </div>
                    {packages.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-400 uppercase bg-slate-900/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Investor</th>
                                        <th scope="col" className="px-6 py-3">Created</th>
                                        <th scope="col" className="px-6 py-3">Items</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3"><span className="sr-only">View</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packages.map(pkg => (
                                        <tr key={pkg.id} className="border-b border-slate-700 hover:bg-slate-800/40">
                                            <td className="px-6 py-4 font-medium text-white">{pkg.investorName}</td>
                                            <td className="px-6 py-4 text-gray-400">{new Date(pkg.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-gray-400">{pkg.items.length}</td>
                                            <td className="px-6 py-4"><PackageStatusBadge status={pkg.status} /></td>
                                            <td className="px-6 py-4 text-right">
                                                <Link to={`/diligence/${pkg.id}`} className="font-medium text-cyan-400 hover:underline">View Package</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center p-8 text-gray-500">
                            <p>No diligence packages have been created yet.</p>
                            <p>Click "Start New Diligence Request" to begin.</p>
                        </div>
                    )}
                </Card>
            </div>
            {isModalOpen && (
                <NewDiligenceRequestModal
                    onClose={() => setIsModalOpen(false)}
                    onRequestCreated={handleRequestCreated}
                />
            )}
        </>
    );
};

export default DiligenceHub;
