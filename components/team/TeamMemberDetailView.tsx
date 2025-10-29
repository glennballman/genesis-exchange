import React from 'react';
import { User, ProfessionalAchievement, IndividualGumpScore } from '../../types';
import { Icon } from '../ui/Icon';

const IGSGauge: React.FC<{ score: number; maxScore: number; label: string; color: string }> = ({ score, maxScore, label, color }) => {
    const percentage = score / maxScore;
    const circumference = 2 * Math.PI * 28;
    const strokeDashoffset = circumference - percentage * circumference;

    return (
        <div className="flex flex-col items-center text-center">
            <div className="relative w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 60 60">
                    <circle className="text-slate-700" strokeWidth="6" stroke="currentColor" fill="transparent" r="27" cx="30" cy="30" />
                    <circle
                        className={color}
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="27"
                        cx="30"
                        cy="30"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
                    />
                    <text x="50%" y="50%" textAnchor="middle" dy=".3em" className={`font-bold text-lg fill-current ${color}`}>{score}</text>
                </svg>
            </div>
            <p className="text-xs font-semibold text-gray-400 mt-2 w-20">{label}</p>
        </div>
    );
};

const AchievementCard: React.FC<{ ach: ProfessionalAchievement }> = ({ ach }) => (
    <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-slate-700 rounded-md flex-shrink-0 flex items-center justify-center">
            <img src={ach.companyLogoUrl} alt={`${ach.organizationName} logo`} className="w-8 h-8 object-contain" />
        </div>
        <div>
            <h4 className="font-semibold text-white">{ach.role} at {ach.organizationName}</h4>
            <p className="text-sm text-gray-400 font-medium">{ach.type}</p>
            <p className="text-sm text-gray-300 mt-1">{ach.description}</p>
        </div>
    </div>
);

interface TeamMemberDetailViewProps {
    member: User;
    onClose: () => void;
    onEdit: () => void;
}

const TeamMemberDetailView: React.FC<TeamMemberDetailViewProps> = ({ member, onClose, onEdit }) => {
    const igs = member.igs || { total: 0, execution: { total: 0 }, domain: { total: 0 }, leadership: { total: 0 } } as IndividualGumpScore;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <button onClick={onClose} className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Back to Team Vault
                </button>
                <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-600 rounded-md hover:bg-slate-500 transition-colors">
                    <Icon name="user-profile" className="w-4 h-4" />
                    Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 flex flex-col items-center text-center">
                    <div className="relative mb-4">
                        <img src={member.avatar.replace('?u=', '?u=xl-')} alt={member.name} className="w-40 h-40 rounded-full border-4 border-slate-700" />
                        {member.verification && (
                            <div className="absolute bottom-3 right-1 bg-slate-700 rounded-full p-2 border-4 border-slate-800">
                                <Icon name="verified" className="w-6 h-6 text-green-400" title={`Verified on ${member.verification.source}`} />
                            </div>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-white">{member.name}</h1>
                    <p className="text-lg text-cyan-300">{member.title}</p>
                    <p className="text-md text-gray-400 mt-4 max-w-xs">{member.summary}</p>
                    <div className="mt-6 w-full bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-rose-300 mb-4">Individual Gump Score (IGS)</h3>
                        <div className="text-6xl font-bold text-rose-300 mb-4">{igs.total}<span className="text-3xl text-rose-400/50">/1000</span></div>
                        <div className="flex justify-around items-start">
                            <IGSGauge score={igs.execution.total} maxScore={450} label="Execution" color="text-green-400" />
                            <IGSGauge score={igs.domain.total} maxScore={300} label="Domain Expertise" color="text-blue-400" />
                            <IGSGauge score={igs.leadership.total} maxScore={250} label="Leadership" color="text-amber-400" />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Key Achievements</h3>
                        {member.achievements.length > 0 ? (
                            <div className="space-y-6">
                                {member.achievements.map(ach => <AchievementCard key={ach.id} ach={ach} />)}
                            </div>
                        ) : (
                            <p className="text-gray-400">No professional achievements have been added for this team member yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamMemberDetailView;
