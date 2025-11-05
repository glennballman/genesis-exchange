
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Principal, IndividualPrincipal } from '../../../types';
import { usePrincipal } from '../../../services/PrincipalProvider';
import { Card } from '../../ui/Card';
import { Icon } from '../../ui/Icon';
import { Button } from '../../ui/Button';
import { LiveAlignmentReportCard } from '../../diligence/LiveAlignmentReportCard';
import { discoveryService } from '../../../services/discoveryService';
import IndividualIntakeWizard from '../../wizard/IndividualIntakeWizard';
import EditMemberModal from '../../team/EditMemberModal';

const DetailItem: React.FC<{ icon: string, label: string, children: React.ReactNode }> = ({ icon, label, children }) => (
    <div className="flex gap-4 py-4 border-b border-slate-800 last:border-b-0">
        <Icon name={icon} className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
        <div className="flex-1">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
            <div className="text-sm text-gray-200 mt-2">
                {children}
            </div>
        </div>
    </div>
);

const IndividualPrincipalDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { availablePrincipals, setCurrentPrincipal } = usePrincipal();
    const [individual, setIndividual] = useState<IndividualPrincipal | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showAlignment, setShowAlignment] = useState(false);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const location = useLocation();
    const isAdminMode = location.pathname.startsWith('/admin');

    useEffect(() => {
        const foundPrincipal = availablePrincipals.find(p => p.id === id);
        if (foundPrincipal) {
            if (foundPrincipal.type === 'INDIVIDUAL') {
                setIndividual(foundPrincipal);
                setCurrentPrincipal(foundPrincipal);
                setError(null);
            } else {
                setError(`This page is for individual principals. ${foundPrincipal.name} is a ${foundPrincipal.type}.`);
                setIndividual(null);
            }
        } else {
            setError('Principal not found.');
            setIndividual(null);
        }
    }, [id, availablePrincipals, setCurrentPrincipal]);

    const handleWizardClose = () => setIsWizardOpen(false);
    const handleModalClose = () => setIsEditModalOpen(false);

    if (error) {
        return <div className="p-8 text-white text-center bg-red-900/50 rounded-lg">{error}</div>;
    }

    if (!individual) {
        return <div className="p-8 text-white text-center">Loading individual principal...</div>;
    }
    
    const company = discoveryService.getCurrentCompanyPrincipal();
    const backLink = isAdminMode ? '/admin/principals' : '/discovery';
    const backLinkText = isAdminMode ? 'Back to Principals' : 'Back to Discovery Dashboard';

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <Link to={backLink} className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 mb-4">
                            <Icon name="arrowLeft" className="h-4 w-4" />
                            {backLinkText}
                        </Link>
                        <div className="flex items-center gap-4">
                            <img src={individual.avatar} alt={individual.name} className="w-20 h-20 rounded-full border-2 border-slate-700" />
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-white">{individual.name}</h1>
                                <p className="text-lg text-gray-400">{individual.title}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                         <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
                            <Icon name="edit" className="w-4 h-4 mr-2"/>
                            Edit Profile
                        </Button>
                        <Button onClick={() => setShowAlignment(!showAlignment)}>
                            <Icon name="hub" className="w-4 h-4 mr-2"/>
                            {showAlignment ? 'Hide Alignment' : 'Compare Alignment'}
                        </Button>
                    </div>
                </div>

                {showAlignment && company && (
                    <LiveAlignmentReportCard source={company} target={individual} />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                           <Icon name="user" className="w-6 h-6" />
                           Principal Profile
                       </h2>
                       <div className="space-y-2">
                            <DetailItem icon="summary" label="Executive Summary">
                                {individual.summary || <p className="text-gray-400 italic">No summary provided.</p>}
                            </DetailItem>
                            <DetailItem icon="mission" label="Personal Mission">
                                {individual.personalMission?.statement || <p className="text-gray-400 italic">No mission statement provided.</p>}
                            </DetailItem>
                            <DetailItem icon="interests" label="Interests & Expertise">
                                {individual.interests && individual.interests.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {individual.interests.map(interest => (
                                            <span key={interest.id} className="px-2 py-1 text-xs font-medium rounded-full bg-slate-700 text-gray-300">
                                                {interest.description}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                     <p className="text-gray-400 italic">No interests listed.</p>
                                )}
                            </DetailItem>
                             <DetailItem icon="milestone" label="Professional Achievements">
                                {individual.achievements && individual.achievements.length > 0 ? (
                                    <div className="space-y-4">
                                        {individual.achievements.map(ach => (
                                            <div key={ach.id} className="p-3 bg-slate-800/50 rounded-lg flex gap-4" >
                                                <img src={ach.companyLogoUrl} alt="logo" className="w-10 h-10 rounded-md mt-1"/>
                                                <div>
                                                    <p className="font-semibold text-white">{ach.role} @ {ach.organizationName}</p>
                                                    <p className="text-xs text-gray-400 mb-1">{ach.startDate} - {ach.endDate || 'Present'}</p>
                                                    <p className="text-sm text-gray-300">{ach.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">No achievements listed. Click 'Edit Profile' to add them.</p>
                                )}
                            </DetailItem>
                       </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                            <Icon name="goals" className="w-6 h-6" />
                            Personal Goals
                        </h2>
                         {individual.goals && individual.goals.length > 0 ? (
                            <div className="space-y-4">
                                {individual.goals.map(goal => (
                                    <div key={goal.id} className="p-3 bg-slate-800/50 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <p className="font-semibold text-white">{goal.title}</p>
                                            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full font-mono flex-shrink-0">{goal.category}</span>
                                        </div>
                                        <p className="text-sm text-gray-300 mt-1">{goal.description}</p>
                                        <p className="text-right text-xs text-gray-400 mt-2">Target: {goal.targetDate}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">No goals listed. Click 'Edit Profile' to add them.</p>
                        )}
                    </Card>
                </div>
            </div>

            {isWizardOpen && (
                <IndividualIntakeWizard 
                    onClose={handleWizardClose} 
                    user={individual}
                />
            )}
            {isEditModalOpen && (
                <EditMemberModal 
                    member={individual} 
                    onClose={handleModalClose} 
                />
            )}
        </>
    );
};

export default IndividualPrincipalDetail;
