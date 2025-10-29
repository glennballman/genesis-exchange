import React from 'react';
import { User } from '../../types';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';

interface TeamMemberCardProps {
    member: User;
    onSelect: () => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onSelect }) => {
    const totalIgs = member.igs?.total || 0;

    return (
        <Card className="!p-0 cursor-pointer group" onClick={onSelect}>
            <div className="p-5 flex flex-col items-center text-center">
                <div className="relative">
                    <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full border-4 border-slate-600 group-hover:border-cyan-500 transition-colors mb-3" />
                    {member.verification && (
                        <div className="absolute bottom-3 -right-1 bg-slate-700 rounded-full p-1 border-2 border-slate-800">
                            <Icon name="verified" className="w-4 h-4 text-green-400" title={`Verified on ${member.verification.source}`} />
                        </div>
                    )}
                </div>
                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                <p className="text-sm text-gray-400 h-5">{member.title}</p>
                
                <div className="mt-4 bg-slate-900/50 w-full p-3 rounded-lg">
                    <p className="text-xs text-rose-400 uppercase font-bold">Individual Gump Score</p>
                    <p className="text-3xl font-bold text-rose-300">{totalIgs.toLocaleString()}</p>
                </div>
            </div>
            <div className="border-t border-slate-700 p-2 text-center text-xs text-gray-500 group-hover:text-cyan-300 transition-colors">
                View Full Profile
            </div>
        </Card>
    );
};

export default TeamMemberCard;
