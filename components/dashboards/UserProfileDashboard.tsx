import React, { useState, useEffect } from 'react';
import { userProfileStore } from '../../services/userProfileStore';
import { UserProfile, User } from '../../types';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { currentUser } from '../../data/genesisData';
import ScoreHistoryChart from '../charts/ScoreHistoryChart';
import { historyStore } from '../../services/historyStore';
import EditMemberModal from '../team/EditMemberModal';

const UserProfileDashboard: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [userHistory, setUserHistory] = useState(historyStore.getUserGumpHistory());
    const [isEditing, setIsEditing] = useState(false);

    const refreshProfile = () => {
        setProfile(userProfileStore.getProfile());
        setUserHistory(historyStore.getUserGumpHistory());
    };

    useEffect(() => {
        refreshProfile();
        window.addEventListener('focus', refreshProfile);
        return () => window.removeEventListener('focus', refreshProfile);
    }, []);

    if (!profile) {
        return <div>Loading Profile...</div>;
    }

    return (
        <>
            <div className="space-y-8">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-24 h-24 rounded-full border-4 border-slate-700" />
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">{currentUser.name}</h1>
                            <p className="mt-1 text-gray-400">Your Personal Knowledge & Achievement Ledger</p>
                        </div>
                    </div>
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition-colors">
                        <Icon name="user-profile" className="w-5 h-5" />
                        Edit My Profile & IGS
                    </button>
                </div>

                <Card>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Icon name="gump" className="w-8 h-8 text-yellow-400" />
                            <h2 className="text-xl font-semibold text-white">Total Genesis U Score</h2>
                        </div>
                        <div className="text-4xl font-bold text-yellow-300">{profile.gumpPoints.toLocaleString()} pts</div>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-semibold text-white mb-4">Your GUMP Score Over Time</h2>
                    <ScoreHistoryChart data={userHistory} color="#f59e0b" gradientId="userGumpScore" />
                </Card>

                <Card className="!p-0">
                    <div className="p-6 border-b border-slate-700">
                        <h2 className="text-xl font-semibold text-white">Completed Knowledge Modules</h2>
                    </div>
                    {profile.completedModules.length === 0 ? (
                        <p className="p-6 text-gray-400">You haven't completed any modules yet. Visit the 'Score Calculation' page to start learning and earning points!</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-400 uppercase bg-slate-900/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Module Title</th>
                                        <th scope="col" className="px-6 py-3">Date Completed</th>
                                        <th scope="col" className="px-6 py-3 text-right">Points Awarded</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profile.completedModules.map((module) => (
                                        <tr key={module.moduleId} className="border-b border-slate-700">
                                            <td className="px-6 py-4 font-medium text-white">
                                                {module.title}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">
                                                {new Date(module.completedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono font-semibold text-yellow-400">
                                                +{module.pointsAwarded.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
            {isEditing && (
                <EditMemberModal
                    member={currentUser}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </>
    );
};

export default UserProfileDashboard;
