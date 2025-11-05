
import React, { useState, useEffect } from 'react';
import { teamStore } from '../../services/teamStore';
import { User, MemberRole, TeamChemistry } from '../../types';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import TeamMemberCard from '../team/TeamMemberCard';
import TeamMemberDetailView from '../team/TeamMemberDetailView';
import EditMemberModal from '../team/EditMemberModal';

const TeamDashboard: React.FC = () => {
    const [team, setTeam] = useState<User[]>(teamStore.getTeam());
    const [chemistry, setChemistry] = useState<TeamChemistry>(teamStore.getTeamChemistry());
    const [selectedMember, setSelectedMember] = useState<User | null>(null);
    const [editingMember, setEditingMember] = useState<User | 'new' | null>(null);

    useEffect(() => {
        const handleTeamUpdate = () => {
            setTeam(teamStore.getTeam());
            setChemistry(teamStore.getTeamChemistry());
        };

        const unsubscribe = teamStore.subscribe(handleTeamUpdate);
        handleTeamUpdate(); // Initial fetch

        return () => unsubscribe();
    }, []);

    const handleSelectMember = (member: User) => {
        setSelectedMember(member);
    };

    const handleCloseDetailView = () => {
        setSelectedMember(null);
    };

    const handleCloseModal = () => {
        setEditingMember(null);
    };

    const totalIgs = team.reduce((sum, member) => sum + (member.igs?.total || 0), 0);
    const chemistryAdjustedIgs = Math.round(totalIgs * chemistry.multiplier);

    const groupedTeam = team.reduce((acc, member) => {
        acc[member.role] = acc[member.role] || [];
        acc[member.role].push(member);
        return acc;
    }, {} as Record<MemberRole, User[]>);

    const roleOrder: MemberRole[] = ['Founder', 'Management', 'Team Member', 'Board Member', 'Advisor'];

    if (selectedMember) {
        return <TeamMemberDetailView member={selectedMember} onClose={handleCloseDetailView} onEdit={() => { setEditingMember(selectedMember); setSelectedMember(null); }} />;
    }

    return (
        <>
            <div className="space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Team & Ops Vault</h1>
                        <p className="mt-1 text-gray-400">Quantify your team's experience and generate investor-ready assets.</p>
                    </div>
                    <button onClick={() => setEditingMember('new')} className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition-colors">
                        <Icon name="team" className="w-5 h-5" />
                        Add Member
                    </button>
                </div>

                <Card>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Icon name="team" className="w-8 h-8 text-rose-400" />
                            <div>
                                <h2 className="text-xl font-semibold text-white">Total Individual Gump Score (IGS)</h2>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                    {chemistry.factors.map((factor, i) => (
                                        <span key={i} className="bg-green-500/10 text-green-300 px-2 py-0.5 rounded-full">{factor.description} ({factor.boost})</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-rose-300">{chemistryAdjustedIgs.toLocaleString()}</div>
                            <div className="text-sm text-gray-400">({totalIgs.toLocaleString()} Base x {chemistry.multiplier.toFixed(2)} Chemistry)</div>
                        </div>
                    </div>
                </Card>
                
                {roleOrder.map(role => (
                    groupedTeam[role] && (
                        <div key={role}>
                            <h2 className="text-2xl font-semibold tracking-tight text-white mb-4">{role === 'Management' ? 'Management Team' : role}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {groupedTeam[role].map(member => (
                                    <TeamMemberCard key={member.id} member={member} onSelect={() => handleSelectMember(member)} />
                                ))}
                            </div>
                        </div>
                    )
                ))}

                <Card>
                     <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Dynamic Team Slide</h3>
                            <p className="text-sm text-gray-400 mt-1">Generate a presentation-ready slide showcasing your team's key achievements and IGS scores.</p>
                        </div>
                        <button onClick={() => alert("Team Slide Generator Coming Soon!")} className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-500 transition-all duration-200">
                            <Icon name="dd" className="w-5 h-5" />
                            Generate Team Slide
                        </button>
                    </div>
                </Card>
            </div>
            {editingMember && (
                <EditMemberModal
                    member={editingMember === 'new' ? undefined : editingMember}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default TeamDashboard;
