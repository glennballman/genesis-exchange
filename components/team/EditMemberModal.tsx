import React, { useState, useEffect } from 'react';
import { User, ProfessionalAchievement, MemberRole, AchievementType, Goal, GoalTimeline, GoalSharingLevel, Interest, InvestmentType } from '../../types';
import { teamStore } from '../../services/teamStore';
import { igsService } from '../../services/igsService';
import { generateProfileSummaryAndNarratives } from '../../services/geminiService';
import { Icon } from '../ui/Icon';

interface EditMemberModalProps {
    member?: User;
    onClose: () => void;
}

const achievementTypes: AchievementType[] = ['Work/Professional', 'Academic/Intellectual', 'Athletic', 'Artistic', 'Spiritual', 'Community/Humanity/Charitable'];
const memberRoles: MemberRole[] = ['Founder', 'Management', 'Team Member', 'Board Member', 'Advisor'];
const goalTimelines: GoalTimeline[] = ['Short-Term (This Year)', 'Medium-Term (1-3 Years)', 'Long-Term (3+ Years)'];
const investmentTypes: InvestmentType[] = ['Time', 'Energy', 'Money'];

const AchievementForm: React.FC<{ 
    onSave: (ach: ProfessionalAchievement) => void; 
    onCancel: () => void;
    achievementToEdit?: ProfessionalAchievement | null;
}> = ({ onSave, onCancel, achievementToEdit }) => {
    const [achievement, setAchievement] = useState<Partial<ProfessionalAchievement>>(achievementToEdit || { type: 'Work/Professional' });

    useEffect(() => {
        setAchievement(achievementToEdit || { type: 'Work/Professional' });
    }, [achievementToEdit]);

    const handleChange = (field: keyof ProfessionalAchievement, value: any) => {
        setAchievement(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (field: 'accomplishmentFile' | 'designationFiles', file: File | null) => {
        if (field === 'accomplishmentFile') {
            setAchievement(prev => ({ ...prev, accomplishmentFile: file ? { name: file.name, url: '' } : undefined }));
        }
        if (field === 'designationFiles') {
             setAchievement(prev => ({ ...prev, designationFiles: file ? [{ name: file.name, url: '' }] : undefined }));
        }
    };

    const handleSubmit = () => {
        if (!achievement.role) return;
        const completeAchievement: ProfessionalAchievement = {
            id: achievement.id || `ach-${Date.now()}`,
            type: achievement.type || 'Work/Professional',
            role: achievement.role,
            organizationName: achievement.organizationName || '',
            organizationUrl: achievement.organizationUrl,
            description: achievement.description || '',
            fromState: achievement.fromState || '',
            toState: achievement.toState || '',
            accomplishmentUrl: achievement.accomplishmentUrl,
            accomplishmentFile: achievement.accomplishmentFile,
            rewards: achievement.rewards || [],
            isDesignation: achievement.isDesignation || false,
            designationName: achievement.designationName,
            governingBody: achievement.governingBody,
            designationLinks: achievement.designationLinks,
            designationFiles: achievement.designationFiles,
            companyLogoUrl: achievement.companyLogoUrl,
        };
        onSave(completeAchievement);
    };

    return (
        <div className="mt-4 p-4 border-t border-slate-700 space-y-4 bg-slate-800 rounded-b-lg">
            <h4 className="text-sm font-semibold text-white">{achievementToEdit ? 'Edit Achievement' : 'New Achievement'}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Type of Achievement</label>
                    <select value={achievement.type} onChange={e => handleChange('type', e.target.value)} className="w-full text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-md">
                        {achievementTypes.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Role / Title</label>
                    <input type="text" placeholder="e.g., CEO, Lead Developer" value={achievement.role || ''} onChange={e => handleChange('role', e.target.value)} className="w-full text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-md" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Organization Name</label>
                    <input type="text" placeholder="e.g., Stark Industries" value={achievement.organizationName || ''} onChange={e => handleChange('organizationName', e.target.value)} className="w-full text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-md" />
                </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Organization Website (Optional)</label>
                    <input type="url" placeholder="https://example.com" value={achievement.organizationUrl || ''} onChange={e => handleChange('organizationUrl', e.target.value)} className="w-full text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-md" />
                </div>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Describe your achievement</label>
                <textarea placeholder="Describe the achievement in a few sentences..." value={achievement.description || ''} onChange={e => handleChange('description', e.target.value)} rows={2} className="w-full text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-md" />
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">"From-To" Accomplishment</label>
                <div className="flex items-center gap-2">
                    <input type="text" placeholder="From: 'Idea'" value={achievement.fromState || ''} onChange={e => handleChange('fromState', e.target.value)} className="w-1/2 text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-md" />
                    <span className="text-gray-400">&rarr;</span>
                    <input type="text" placeholder="To: 'Nasdaq IPO'" value={achievement.toState || ''} onChange={e => handleChange('toState', e.target.value)} className="w-1/2 text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-md" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <input type="url" placeholder="Link to Accomplishment" value={achievement.accomplishmentUrl || ''} onChange={e => handleChange('accomplishmentUrl', e.target.value)} className="w-full text-xs px-3 py-2 bg-slate-700 border border-slate-600 rounded-md" />
                    <label className="text-xs px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-gray-400 cursor-pointer hover:bg-slate-600 text-center">
                        {achievement.accomplishmentFile?.name || 'Upload Evidence (File)'}
                        <input type="file" className="hidden" onChange={e => handleFileChange('accomplishmentFile', e.target.files ? e.target.files[0] : null)} />
                    </label>
                </div>
            </div>
             <div className="flex items-center mt-2">
                <input id="isDesignation" type="checkbox" checked={achievement.isDesignation} onChange={(e) => handleChange('isDesignation', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                <label htmlFor="isDesignation" className="ml-2 block text-sm text-gray-300">This was a professional designation or license</label>
            </div>
            {achievement.isDesignation && (
                <div className="p-3 bg-slate-700/50 rounded-md space-y-3">
                     <input type="text" placeholder="Name of Designation (e.g., P.Eng, MD)" value={achievement.designationName || ''} onChange={e => handleChange('designationName', e.target.value)} className="w-full text-xs px-3 py-2 bg-slate-600 border border-slate-500 rounded-md" />
                     <input type="text" placeholder="Governing Body (e.g., FAA, Law Society)" value={achievement.governingBody || ''} onChange={e => handleChange('governingBody', e.target.value)} className="w-full text-xs px-3 py-2 bg-slate-600 border border-slate-500 rounded-md" />
                     <div className="grid grid-cols-2 gap-2">
                        <input type="url" placeholder="Link to Profile/Verification" value={achievement.designationLinks?.[0] || ''} onChange={e => handleChange('designationLinks', [e.target.value])} className="w-full text-xs px-3 py-2 bg-slate-600 border border-slate-500 rounded-md" />
                        <label className="text-xs px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-gray-400 cursor-pointer hover:bg-slate-500 text-center">
                            {achievement.designationFiles?.[0]?.name || 'Upload Certificate'}
                            <input type="file" className="hidden" onChange={e => handleFileChange('designationFiles', e.target.files ? e.target.files[0] : null)} />
                        </label>
                     </div>
                </div>
            )}
            <div className="flex gap-2 pt-2">
                <button onClick={handleSubmit} className="text-sm px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500">Save Achievement</button>
                <button onClick={onCancel} className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500">Cancel</button>
            </div>
        </div>
    );
};

const GoalForm: React.FC<{ onSave: (goal: Goal) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<AchievementType>('Work/Professional');
    const [targetDate, setTargetDate] = useState<GoalTimeline>('Medium-Term (1-3 Years)');
    const [sharingLevel, setSharingLevel] = useState<GoalSharingLevel>('Private');

    const handleSave = () => {
        if (!description) return;
        onSave({
            id: `goal-${Date.now()}`,
            description,
            category,
            targetDate,
            sharingLevel,
        });
    };

    return (
        <div className="mt-4 p-4 border-t border-slate-700 space-y-4 bg-slate-800 rounded-b-lg">
            <h4 className="text-sm font-semibold text-white">New Goal</h4>
            <textarea placeholder="What is your goal? (e.g., Run a sub-2:45 marathon)" value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select value={category} onChange={e => setCategory(e.target.value as AchievementType)} className="w-full text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-md">
                    {achievementTypes.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select value={targetDate} onChange={e => setTargetDate(e.target.value as GoalTimeline)} className="w-full text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-md">
                    {goalTimelines.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Sharing</label>
                <select value={sharingLevel} onChange={e => setSharingLevel(e.target.value as GoalSharingLevel)} className="w-full text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-md">
                    <option value="Private">Private (Only I can see this)</option>
                    <option value="Share with My Company">Share with My Company</option>
                    <option value="Share with Investors">Share with Investors (during DD)</option>
                </select>
            </div>
            <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="text-sm px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500">Save Goal</button>
                <button onClick={onCancel} className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500">Cancel</button>
            </div>
        </div>
    );
};

const InterestForm: React.FC<{ onSave: (interest: Interest) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
    const [description, setDescription] = useState('');
    const [investmentTypes, setInvestmentTypes] = useState<InvestmentType[]>([]);
    const [sharingLevel, setSharingLevel] = useState<GoalSharingLevel>('Private');

    const toggleInvestmentType = (type: InvestmentType) => {
        setInvestmentTypes(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleSave = () => {
        if (!description) return;
        onSave({
            id: `interest-${Date.now()}`,
            description,
            investmentTypes,
            sharingLevel,
        });
    };

    return (
        <div className="mt-4 p-4 border-t border-slate-700 space-y-4 bg-slate-800 rounded-b-lg">
            <h4 className="text-sm font-semibold text-white">New Interest or Passion</h4>
            <input type="text" placeholder="Describe your interest (e.g., Ancient History, Angel Investing)" value={description} onChange={e => setDescription(e.target.value)} className="w-full text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-md" />
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">How do you invest in this interest?</label>
                <div className="flex gap-2">
                    {investmentTypes.map(type => (
                        <button 
                            key={type}
                            onClick={() => toggleInvestmentType(type)}
                            className={`px-3 py-1.5 text-sm font-semibold rounded-md ${investmentTypes.includes(type) ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Sharing</label>
                <select value={sharingLevel} onChange={e => setSharingLevel(e.target.value as GoalSharingLevel)} className="w-full text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-md">
                    <option value="Private">Private</option>
                    <option value="Share with My Company">Share with Company</option>
                    <option value="Share with Investors">Share with Investors</option>
                </select>
            </div>
            <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="text-sm px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500">Save Interest</button>
                <button onClick={onCancel} className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500">Cancel</button>
            </div>
        </div>
    );
};

const EditMemberModal: React.FC<EditMemberModalProps> = ({ member, onClose }) => {
    const [name, setName] = useState(member?.name || '');
    const [title, setTitle] = useState(member?.title || '');
    const [role, setRole] = useState<MemberRole>(member?.role || 'Team Member');
    const [linkedInUrl, setLinkedInUrl] = useState(member?.verification?.url || '');
    const [achievements, setAchievements] = useState<ProfessionalAchievement[]>(member?.achievements || []);
    const [goals, setGoals] = useState<Goal[]>(member?.goals || []);
    const [interests, setInterests] = useState<Interest[]>(member?.interests || []);
    const [summary, setSummary] = useState(member?.summary || '');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState<ProfessionalAchievement | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isAddingGoal, setIsAddingGoal] = useState(false);
    const [isAddingInterest, setIsAddingInterest] = useState(false);

    const handleSaveAchievement = (ach: ProfessionalAchievement) => {
        const index = achievements.findIndex(a => a.id === ach.id);
        if (index > -1) {
            const updatedAchievements = [...achievements];
            updatedAchievements[index] = ach;
            setAchievements(updatedAchievements);
        } else {
            setAchievements([...achievements, ach]);
        }
        setEditingAchievement(null);
        setIsAddingNew(false);
    };
    
    const handleRemoveAchievement = (id: string) => setAchievements(achievements.filter(ach => ach.id !== id));
    
    const handleSaveGoal = (goal: Goal) => {
        setGoals([...goals, goal]);
        setIsAddingGoal(false);
    };

    const handleRemoveGoal = (id: string) => setGoals(goals.filter(g => g.id !== id));

    const handleSaveInterest = (interest: Interest) => {
        setInterests([...interests, interest]);
        setIsAddingInterest(false);
    };

    const handleRemoveInterest = (id: string) => setInterests(interests.filter(i => i.id !== id));

    const handleRegenerate = async () => {
        setIsGenerating(true);
        try {
            const { summary: newSummary, achievements: updatedAchievements } = await generateProfileSummaryAndNarratives(
                name,
                title,
                achievements,
                linkedInUrl ? [{ type: 'LinkedIn', url: linkedInUrl }] : []
            );
            setSummary(newSummary);
            setAchievements(updatedAchievements);
        } catch (error) {
            console.error("Failed to regenerate summary", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        const userData = {
            name, title, role, summary, achievements, goals, interests,
            personalMission: member?.personalMission || { statement: '', sharingLevel: 'Private' },
            verification: linkedInUrl ? { source: 'LinkedIn', url: linkedInUrl, verifiedAt: member?.verification?.verifiedAt || new Date().toISOString() } : undefined,
            avatar: member?.avatar || `https://i.pravatar.cc/40?u=${name.replace(/\s/g, '-')}`,
            earnedGumpScore: member?.earnedGumpScore || 0,
        };

        if (member) {
            teamStore.updateUser(member.id, userData);
        } else {
            const newUser: User = { id: `user-${Date.now()}`, ...userData };
            teamStore.addUser(newUser);
        }
        
        setTimeout(() => { setIsSaving(false); onClose(); }, 1000);
    };

    const igs = igsService.calculateIgs({ achievements, goals } as User);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-lg font-semibold text-white">{member ? `Edit ${member.name}` : 'Add New Team Member'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 overflow-y-auto">
                    {/* Left Pane: Basic Info & Achievements */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                            <h3 className="font-semibold text-white mb-3">Core Profile</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full text-sm px-3 py-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Title</label>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., CTO" className="w-full text-sm px-3 py-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Role</label>
                                    <select value={role} onChange={(e) => setRole(e.target.value as MemberRole)} className="w-full text-sm px-3 py-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none">
                                        {memberRoles.map(r => <option key={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">LinkedIn URL</label>
                                    <input type="url" value={linkedInUrl} onChange={(e) => setLinkedInUrl(e.target.value)} placeholder="https://linkedin.com/in/..." className="w-full text-sm px-3 py-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-white">Achievements</h3>
                                {!isAddingNew && !editingAchievement && <button onClick={() => setIsAddingNew(true)} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">+ Add Achievement</button>}
                            </div>
                            <ul className="space-y-3">
                                {achievements.map((ach) => (
                                    <li key={ach.id} className="text-sm text-gray-300 p-3 bg-slate-800 rounded-md flex justify-between items-center">
                                        <button onClick={() => { setEditingAchievement(ach); setIsAddingNew(false); }} className="text-left flex-grow">
                                            <span className="font-semibold text-gray-200">{ach.role}</span> at <span className="font-semibold text-gray-200">{ach.organizationName || 'N/A'}</span>
                                            <p className="text-xs text-gray-400">{ach.type}</p>
                                        </button>
                                        <button onClick={() => handleRemoveAchievement(ach.id)} className="p-1 text-gray-500 hover:text-red-400 ml-4">
                                            <Icon name="trash" className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {(isAddingNew || editingAchievement) && (
                                <AchievementForm 
                                    onSave={handleSaveAchievement} 
                                    onCancel={() => { setIsAddingNew(false); setEditingAchievement(null); }}
                                    achievementToEdit={editingAchievement}
                                />
                            )}
                        </div>
                         <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-white">Personal & Professional Goals</h3>
                                {!isAddingGoal && <button onClick={() => setIsAddingGoal(true)} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">+ Add Goal</button>}
                            </div>
                            <ul className="space-y-3">
                                {goals.map((goal) => (
                                    <li key={goal.id} className="text-sm text-gray-300 p-3 bg-slate-800 rounded-md flex justify-between items-center">
                                        <p className="flex-grow">{goal.description}</p>
                                        <button onClick={() => handleRemoveGoal(goal.id)} className="p-1 text-gray-500 hover:text-red-400 ml-4">
                                            <Icon name="trash" className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {isAddingGoal && <GoalForm onSave={handleSaveGoal} onCancel={() => setIsAddingGoal(false)} />}
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-white">Interests & Passions</h3>
                                {!isAddingInterest && <button onClick={() => setIsAddingInterest(true)} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">+ Add Interest</button>}
                            </div>
                            <ul className="space-y-3">
                                {interests.map((interest) => (
                                    <li key={interest.id} className="text-sm text-gray-300 p-3 bg-slate-800 rounded-md flex justify-between items-center">
                                        <p className="flex-grow">{interest.description}</p>
                                        <div className="flex gap-1.5">
                                            {interest.investmentTypes.map(type => (
                                                <span key={type} className="text-xs font-bold bg-slate-700 text-gray-300 px-2 py-0.5 rounded-full">{type}</span>
                                            ))}
                                        </div>
                                        <button onClick={() => handleRemoveInterest(interest.id)} className="p-1 text-gray-500 hover:text-red-400 ml-4">
                                            <Icon name="trash" className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {isAddingInterest && <InterestForm onSave={handleSaveInterest} onCancel={() => setIsAddingInterest(false)} />}
                        </div>
                    </div>

                    {/* Right Pane: AI Summary & IGS */}
                    <div className="md:col-span-1 bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex flex-col">
                        <h3 className="font-semibold text-white mb-3">AI Summary & IGS</h3>
                        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Click 'Generate with AI' to create an investor-ready summary of this profile..." rows={6} className="w-full text-sm p-3 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none flex-grow"></textarea>
                        <div className="text-center p-4 my-4 bg-slate-800 rounded-lg">
                            <p className="text-xs text-rose-400 uppercase font-bold">Individual Gump Score</p>
                            <p className="text-4xl font-bold text-rose-300">{igs.total.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">/ 1,000</p>
                        </div>
                        <button onClick={handleRegenerate} disabled={isGenerating} className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-500 disabled:bg-slate-600">
                            {isGenerating ? <><span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> Generating...</> : 'Generate with AI'}
                        </button>
                    </div>
                </div>

                <footer className="p-4 border-t border-slate-700 flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white">Cancel</button>
                    <button onClick={handleSave} disabled={isSaving || !name} className="w-32 flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-500 disabled:bg-slate-600">
                        {isSaving ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Save Profile'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default EditMemberModal;
