
import React, { useState, useEffect } from 'react';
import { ScoreComponent, TakeActionPlan, ImprovementTips, User, YoutubeSuggestion, Partner } from '../../types';
import { Icon } from '../ui/Icon';
import { getImprovementTips, getConceptSummary, getTakeActionPlan } from '../../services/geminiService';
import { insightStore } from '../../services/insightStore';
import { actionPlanStore } from '../../services/actionPlanStore';
import LearningModule from './LearningModule';

interface ScoreDetailModalProps {
    component: ScoreComponent;
    onClose: () => void;
}

const LoadingSpinner: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="animate-spin h-6 w-6 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
    </div>
);

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => (
    <div className="prose prose-sm prose-invert max-w-none text-gray-300"
         dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />').replace(/### (.*?)/g, '<h3 class="text-white font-semibold mt-4">$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^- /gm, '<br>• ') }} />
);

const PartnerCard: React.FC<{ partner: Partner }> = ({ partner }) => {
    const tierStyles = {
        PROMOTED: 'bg-amber-500/10 border-amber-500/50',
        INTEGRATED: 'bg-blue-500/10 border-blue-500/50',
        EMBEDDED: 'bg-purple-500/10 border-purple-500/50',
        STANDARD: 'bg-slate-800/50 border-slate-700',
    };

    const tierLabels = {
        PROMOTED: 'Sponsored',
        INTEGRATED: 'Integrated',
        EMBEDDED: 'Embedded',
        STANDARD: 'Link',
    };

    const tierActions = {
        PROMOTED: 'Visit Site',
        INTEGRATED: 'Connect Account',
        EMBEDDED: 'Open in Genesis',
        STANDARD: 'Visit',
    };

    return (
        <li className={`p-3 rounded-md border ${tierStyles[partner.tier]}`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img src={partner.logoUrl} alt={partner.name} className="w-8 h-8 rounded-md bg-slate-700" />
                    <div>
                        <p className="font-semibold text-gray-200">{partner.name}</p>
                        <p className="text-xs text-gray-400">{partner.description}</p>
                    </div>
                </div>
                <a href={partner.link} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline whitespace-nowrap px-3 py-1 rounded-full bg-slate-700 hover:bg-slate-600">
                    {tierActions[partner.tier]}
                </a>
            </div>
            {partner.tier === 'PROMOTED' && <div className="text-[10px] text-amber-400/60 font-semibold uppercase tracking-wider mt-2 text-right">Sponsored</div>}
        </li>
    );
};

const ScoreDetailModal: React.FC<ScoreDetailModalProps> = ({ component, onClose }) => {
    const [tips, setTips] = useState<ImprovementTips | null>(null);
    const [isLoadingTips, setIsLoadingTips] = useState(true);
    
    const [educationContent, setEducationContent] = useState<string>('');
    const [isLoadingEducation, setIsLoadingEducation] = useState(false);

    const [actionPlan, setActionPlan] = useState<TakeActionPlan | null>(null);
    const [isLoadingActionPlan, setIsLoadingActionPlan] = useState(false);
    const [actionPlanError, setActionPlanError] = useState<string | null>(null);

    const [expandedGoogleAction, setExpandedGoogleAction] = useState<number | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isActionAdded, setIsActionAdded] = useState(false);
    const [isSubmittingAction, setIsSubmittingAction] = useState(false);
    const [showDelegateMenu, setShowDelegateMenu] = useState(false);

    const [activeLearningModule, setActiveLearningModule] = useState<YoutubeSuggestion | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loadingUsers, setLoadingUsers] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/team');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
                // Assuming the first user is the current user for now
                setCurrentUser(data[0] || null);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();

        const fetchTips = async () => {
            setIsLoadingTips(true);
            try {
                const result = await getImprovementTips(component);
                setTips(result);
            } catch (e) {
                console.error(e);
                setTips({ tipsText: "- Error loading tips.", videoSuggestions: [] });
            } finally {
                setIsLoadingTips(false);
            }
        };
        fetchTips();
    }, [component]);

    const handleEducateMe = async () => {
        if (educationContent) {
            setEducationContent('');
            return;
        }
        setIsLoadingEducation(true);
        const result = await getConceptSummary(component.item);
        setEducationContent(result);
        setIsLoadingEducation(false);
    };

    const handleTakeAction = async () => {
        if (actionPlan) {
            setActionPlan(null);
            return;
        }
        setIsLoadingActionPlan(true);
        setActionPlanError(null);
        try {
            const result = await getTakeActionPlan(component);
            setActionPlan(result);
        } catch (e) {
            console.error(e);
            setActionPlanError("Failed to generate an action plan. Please check your API key and network connection, then try again.");
        } finally {
            setIsLoadingActionPlan(false);
        }
    };

    const handleSaveInsight = () => {
        if (educationContent || actionPlan) {
            insightStore.addInsight({
                concept: component.item,
                aiSummary: educationContent,
                takeActionPlan: actionPlan || undefined,
            });
            setIsSaved(true);
        }
    };

    const handleCreateActionItem = async (user: User) => {
        if (isActionAdded || isSubmittingAction || !tips || !currentUser) return;

        setIsSubmittingAction(true);
        setShowDelegateMenu(false);
        let currentActionPlan = actionPlan;
        const gumpPointsAvailable = tips.videoSuggestions.reduce((sum, _, index) => sum + (index + 1) * 500, 0);

        try {
            if (!currentActionPlan) {
                currentActionPlan = await getTakeActionPlan(component);
                setActionPlan(currentActionPlan);
            }

            actionPlanStore.addActionItem({
                concept: component.item,
                scoreComponent: component,
                aiSummary: educationContent,
                takeActionPlan: currentActionPlan,
                improvementTips: tips,
                assignedTo: user,
                gumpPointsAvailable,
            });

            if (user.id !== currentUser.id) {
                const addedItem = actionPlanStore.getAllItems().find(item => item.concept === component.item && item.assignedTo.id === user.id);
                if (addedItem) {
                    actionPlanStore.delegateItem(addedItem.id, currentUser, user);
                }
            }

            setIsActionAdded(true);
        } catch (error) {
            console.error("Failed to create action plan item:", error);
            setActionPlanError("Failed to create and assign the action plan. Please try again.");
        } finally {
            setIsSubmittingAction(false);
        }
    };

    if (activeLearningModule) {
        return <LearningModule module={activeLearningModule} onClose={() => setActiveLearningModule(null)} />;
    }

    const videoLevels = ['Beginner', 'Intermediate', 'Advanced'];
    const percentage = component.max_points > 0 ? (component.points / component.max_points) * 100 : 0;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b border-slate-700 flex-shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-semibold text-white">{component.item}</h2>
                            <p className="text-sm text-gray-400">{component.category}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-gray-400 hover:text-white">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="mt-4 flex items-center gap-4 bg-slate-900/50 p-3 rounded-lg">
                        <div className="flex-1">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Current: <span className="font-bold text-green-400">{component.points.toLocaleString()} pts</span></span>
                                <span>Max: <span className="font-bold text-gray-300">{component.max_points.toLocaleString()} pts</span></span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2.5">
                                <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-cyan-300">{percentage.toFixed(0)}%</div>
                    </div>
                </header>

                <div className="p-6 overflow-y-auto space-y-6">
                    <div>
                        {isLoadingTips ? <LoadingSpinner /> : (
                            <>
                                <div className="mb-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        {videoLevels.map((level, index) => {
                                            const video = tips?.videoSuggestions.find(v => v.level === level);
                                            const points = (index + 1) * 500;
                                            return (
                                                <div key={level} className="text-center">
                                                    <button onClick={() => video && setActiveLearningModule(video)} disabled={!video} className="group block relative w-full text-left">
                                                        <img src={video?.thumbnailUrl || `https://picsum.photos/seed/${level}/320/180`} alt={video?.title} className="rounded-md aspect-video object-cover mb-2 group-hover:opacity-80 transition-opacity" />
                                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                                            <Icon name="logo" className="w-8 h-8 text-white" />
                                                        </div>
                                                    </button>
                                                    <p className="text-xs font-semibold text-gray-400 mt-2">{level}</p>
                                                    <p className="text-xs text-yellow-400 font-bold">{points.toLocaleString()} GUMP pts</p>
                                                    <button onClick={() => video && setActiveLearningModule(video)} disabled={!video} className="mt-2 text-xs px-3 py-1 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 disabled:bg-gray-600">
                                                        Start Learning
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <h3 className="font-semibold text-cyan-300 mb-2">Quick Tips</h3>
                                <MarkdownRenderer content={tips?.tipsText || ''} />
                            </>
                        )}
                    </div>

                    <div className="border-t border-slate-700 pt-4 space-y-4">
                        <div className="flex flex-wrap gap-4">
                            <button onClick={handleEducateMe} disabled={isLoadingEducation} className="flex items-center gap-2 text-sm font-semibold text-purple-300 hover:text-purple-200 disabled:opacity-50">
                                <Icon name="info" className="w-4 h-4" />
                                {isLoadingEducation ? 'Loading...' : educationContent ? 'Hide Education' : 'Educate Me'}
                            </button>
                             <button onClick={handleTakeAction} disabled={isLoadingActionPlan} className="flex items-center gap-2 text-sm font-semibold text-rose-300 hover:text-rose-200 disabled:opacity-50">
                                <Icon name="action" className="w-4 h-4" />
                                {isLoadingActionPlan ? 'Loading...' : actionPlan ? 'Hide Action Plan' : 'Take Action'}
                            </button>
                        </div>

                        {isLoadingEducation && <LoadingSpinner />}
                        {educationContent && (
                            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                                <MarkdownRenderer content={educationContent} />
                            </div>
                        )}

                        {actionPlanError && (
                            <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
                                <p className="font-semibold">Action Plan Failed</p>
                                <p>{actionPlanError}</p>
                            </div>
                        )}

                        {isLoadingActionPlan && <LoadingSpinner />}
                        {actionPlan && (
                            <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 space-y-8">
                                <div>
                                    <h4 className="font-semibold text-white mb-4">Learn More on YouTube</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {actionPlan.youtubeSuggestions.map((video, i) => (
                                            <a key={`yt-${i}`} href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer" className="group">
                                                <img src={video.thumbnailUrl} alt={video.title} className="rounded-md aspect-video object-cover mb-2 group-hover:opacity-80 transition-opacity" />
                                                <p className="text-xs text-gray-300 group-hover:text-white transition-colors">{video.title}</p>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white mb-3">Google Assistance</h4>
                                    <ul className="space-y-2">
                                        {actionPlan.googleAssistance.map((item, i) => (
                                            <li key={`ga-${i}`} className="bg-slate-800/50 rounded-md overflow-hidden">
                                                <button onClick={() => setExpandedGoogleAction(expandedGoogleAction === i ? null : i)} className="w-full text-left p-3 hover:bg-slate-700/50 transition-colors">
                                                    <p className="font-semibold text-gray-200">{item.action}</p>
                                                    <p className="text-xs text-gray-400">{item.description}</p>
                                                </button>
                                                {expandedGoogleAction === i && (
                                                    <div className="p-4 border-t border-slate-700 space-y-4">
                                                        <h5 className="text-sm font-semibold text-white">Micronails: Learn this Step</h5>
                                                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                                            {item.youtubeSuggestions.map((video, j) => (
                                                                <a key={`sub-yt-${j}`} href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer" className="group">
                                                                    <img src={video.thumbnailUrl.replace('/320/180', '/160/90')} alt={video.title} className="rounded aspect-video object-cover group-hover:opacity-80 transition-opacity" />
                                                                </a>
                                                            ))}
                                                        </div>
                                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-1.5 text-xs font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition-colors">
                                                            Go to Action
                                                        </a>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white mb-3">Genesis Exchange Partner Network (GEPN)</h4>
                                    <ul className="space-y-3">
                                        {actionPlan.outsideGoogle.map((partner, i) => (
                                            <PartnerCard key={i} partner={partner} />
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <footer className="p-4 border-t border-slate-700 flex-shrink-0 flex items-center justify-end gap-2">
                     <button onClick={handleSaveInsight} disabled={isSaved || (!educationContent && !actionPlan)} className="flex items-center gap-2 text-sm font-semibold text-amber-300 hover:text-amber-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Icon name="saved" className="w-4 h-4" />
                        {isSaved ? 'Saved' : 'Save for Later'}
                    </button>
                    {currentUser && <button onClick={() => handleCreateActionItem(currentUser)} disabled={isActionAdded || isSubmittingAction} className="flex items-center justify-center gap-2 text-sm font-semibold text-green-300 hover:text-green-200 disabled:opacity-50 disabled:cursor-not-allowed w-48">
                        {isSubmittingAction && !showDelegateMenu ? <LoadingSpinner className="p-0 w-4 h-4" /> : <Icon name="action-plan" className="w-4 h-4" />}
                        {isSubmittingAction && !showDelegateMenu ? 'Adding...' : isActionAdded ? 'Added to Plan' : 'Add to My Action Plan'}
                    </button>}
                    <div className="relative">
                        <button onClick={() => setShowDelegateMenu(!showDelegateMenu)} disabled={isActionAdded || isSubmittingAction} className="flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-blue-200 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Icon name="team" className="w-4 h-4" />
                            Delegate This
                        </button>
                        {showDelegateMenu && !loadingUsers && (
                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-slate-700 border border-slate-600 rounded-md shadow-lg z-10">
                                {users.filter(u => u.id !== currentUser?.id).map(user => (
                                    <button key={user.id} onClick={() => handleCreateActionItem(user)} className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-slate-600 flex items-center gap-2">
                                        <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                                        {user.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ScoreDetailModal;
