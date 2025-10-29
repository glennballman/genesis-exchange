
import React, { useState, useEffect } from 'react';
import { actionPlanStore } from '../../services/actionPlanStore';
import { ActionPlanItem, ActionPlanStatus, User, YoutubeSuggestion } from '../../types';
import { users, currentUser } from '../../data/genesisData';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import LearningModule from '../score/LearningModule';

const ActionItemCard: React.FC<{ item: ActionPlanItem; onUpdate: () => void; onStartLearning: (module: YoutubeSuggestion) => void; }> = ({ item, onUpdate, onStartLearning }) => {
    const [showDelegateMenu, setShowDelegateMenu] = useState(false);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        actionPlanStore.updateItemStatus(item.id, e.target.value as ActionPlanStatus);
        onUpdate();
    };

    const handleDelegate = (user: User) => {
        actionPlanStore.delegateItem(item.id, currentUser, user);
        setShowDelegateMenu(false);
        onUpdate();
    };

    const { scoreComponent } = item;
    const currentPercentage = scoreComponent.max_points > 0 ? (scoreComponent.points / scoreComponent.max_points) * 100 : 0;
    const potentialGumpPercentage = scoreComponent.max_points > 0 ? (item.gumpPointsAvailable / scoreComponent.max_points) * 100 : 0;
    const videoLevels = ['Beginner', 'Intermediate', 'Advanced'];

    return (
        <Card className="!p-0">
            <div className="p-6">
                {/* Score Context Header */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white">{scoreComponent.item}</h3>
                    <p className="text-sm text-gray-400">{scoreComponent.category}</p>
                    <div className="mt-3 flex items-center gap-4 bg-slate-900/50 p-3 rounded-lg">
                        <div className="flex-1">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Current: <span className="font-bold text-green-400">{scoreComponent.points.toLocaleString()} pts</span></span>
                                <span>Max: <span className="font-bold text-gray-300">{scoreComponent.max_points.toLocaleString()} pts</span></span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2.5 relative">
                                <div className="bg-cyan-500 h-2.5 rounded-l-full" style={{ width: `${currentPercentage}%` }}></div>
                                <div className="absolute top-0 h-2.5 bg-green-500/50" style={{ left: `${currentPercentage}%`, width: `${potentialGumpPercentage}%` }} title={`+${item.gumpPointsAvailable.toLocaleString()} GUMP pts available`}></div>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-cyan-300">{currentPercentage.toFixed(0)}%</div>
                    </div>
                </div>

                {/* Gamification Bar */}
                <div className="flex items-center gap-4 text-xs text-gray-400 my-4 p-2 bg-slate-900/50 rounded-md">
                    <div><span className="font-semibold text-gray-300">Est. Time:</span> {item.takeActionPlan.estimatedTime}</div>
                    <div className="border-l border-slate-600 h-4"></div>
                    <div><span className="font-semibold text-gray-300">GUMP Points:</span> <span className="font-bold text-yellow-400">+{item.gumpPointsAvailable.toLocaleString()}</span></div>
                </div>

                {/* Genesis U Section */}
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-white mb-2">Genesis U: Knowledge Modules</h4>
                    <div className="grid grid-cols-3 gap-4">
                        {videoLevels.map((level, index) => {
                            const video = item.improvementTips.videoSuggestions.find(v => v.level === level);
                            const points = (index + 1) * 500;
                            return (
                                <div key={level} className="text-center">
                                    <button onClick={() => video && onStartLearning(video)} disabled={!video} className="group block relative w-full text-left">
                                        <img src={video?.thumbnailUrl || `https://picsum.photos/seed/${level}/320/180`} alt={video?.title} className="rounded-md aspect-video object-cover mb-2 group-hover:opacity-80 transition-opacity" />
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                            <Icon name="logo" className="w-8 h-8 text-white" />
                                        </div>
                                    </button>
                                    <p className="text-xs font-semibold text-gray-400 mt-2">{level}</p>
                                    <p className="text-xs text-yellow-400 font-bold">{points.toLocaleString()} GUMP pts</p>
                                    <button onClick={() => video && onStartLearning(video)} disabled={!video} className="mt-2 text-xs px-3 py-1 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 disabled:bg-gray-600">
                                        Start Learning
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Delegation History</h4>
                    {item.delegationHistory.length === 0 ? (
                        <p className="text-xs text-gray-400">You created this action item.</p>
                    ) : (
                        <ul className="space-y-2">
                            {item.delegationHistory.map((entry, index) => (
                                <li key={index} className="flex items-center gap-2 text-xs text-gray-400">
                                    <img src={entry.delegatedFrom.avatar} alt={entry.delegatedFrom.name} className="w-5 h-5 rounded-full" />
                                    <span className="font-semibold text-gray-300">{entry.delegatedFrom.name}</span>
                                    <span>delegated to</span>
                                    <span className="font-semibold text-gray-300">{entry.delegatedTo.name}</span>
                                    <span>on {new Date(entry.timestamp).toLocaleDateString()}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex justify-between items-center">
                 <select value={item.status} onChange={handleStatusChange} className="bg-slate-800 border border-slate-600 rounded-md text-xs px-2 py-1 focus:ring-cyan-500 focus:border-cyan-500">
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
                <div className="relative">
                    <button onClick={() => setShowDelegateMenu(!showDelegateMenu)} className="flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-blue-200">
                        <Icon name="team" className="w-4 h-4" />
                        Delegate
                    </button>
                    {showDelegateMenu && (
                        <div className="absolute bottom-full right-0 mb-2 w-48 bg-slate-700 border border-slate-600 rounded-md shadow-lg z-10">
                            {users.filter(u => u.id !== currentUser.id).map(user => (
                                <button key={user.id} onClick={() => handleDelegate(user)} className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-slate-600 flex items-center gap-2">
                                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                                    {user.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

const ActionPlanDashboard: React.FC = () => {
    const [actionItems, setActionItems] = useState<ActionPlanItem[]>([]);
    const [activeLearningModule, setActiveLearningModule] = useState<YoutubeSuggestion | null>(null);

    const refreshItems = () => {
        setActionItems(actionPlanStore.getItemsForUser(currentUser.id));
    };

    useEffect(() => {
        refreshItems();
        window.addEventListener('focus', refreshItems);
        return () => {
            window.removeEventListener('focus', refreshItems);
        };
    }, []);

    if (activeLearningModule) {
        return <LearningModule module={activeLearningModule} onClose={() => { setActiveLearningModule(null); refreshItems(); }} />;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">My Action Plan</h1>
                <p className="mt-1 text-gray-400">Your assigned tasks to improve the company's Genesis Score.</p>
            </div>

            {actionItems.length === 0 ? (
                <Card className="text-center py-12">
                    <Icon name="action-plan" className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-lg font-semibold text-white">Your Action Plan is Clear!</h3>
                    <p className="text-gray-400 mt-1">No items are currently assigned to you. Create new action items from the 'Score Calculation' page.</p>
                </Card>
            ) : (
                <div className="space-y-6">
                    {actionItems.map(item => (
                        <ActionItemCard key={item.id} item={item} onUpdate={refreshItems} onStartLearning={setActiveLearningModule} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActionPlanDashboard;
