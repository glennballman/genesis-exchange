
import { ScoreSnapshot } from '../types';
import { calculateTotalCompanyScore } from './scoreService';
import { userProfileStore } from './userProfileStore';

interface HistoryStore {
    addScoreSnapshot: () => void;
    getCompanyHistory: () => ScoreSnapshot[];
    getUserGumpHistory: () => ScoreSnapshot[];
}

const createHistoryStore = (): HistoryStore => {
    // Pre-populate with some mock historical data for a nice initial chart
    const companyScoreHistory: ScoreSnapshot[] = [
        { date: new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0], score: 625000 },
        { date: new Date(Date.now() - 86400000 * 20).toISOString().split('T')[0], score: 640000 },
        { date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0], score: 655000 },
    ];

    const userGumpHistory: ScoreSnapshot[] = [
        { date: new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0], score: 30000 },
        { date: new Date(Date.now() - 86400000 * 20).toISOString().split('T')[0], score: 32000 },
        { date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0], score: 35000 },
    ];

    return {
        addScoreSnapshot: () => {
            const today = new Date().toISOString().split('T')[0];
            
            const newCompanyScore = calculateTotalCompanyScore();
            companyScoreHistory.push({ date: today, score: newCompanyScore });

            const newUserGumpScore = userProfileStore.getProfile().gumpPoints;
            userGumpHistory.push({ date: today, score: newUserGumpScore });
        },
        getCompanyHistory: () => {
            return [...companyScoreHistory];
        },
        getUserGumpHistory: () => {
            return [...userGumpHistory];
        }
    };
};

export const historyStore = createHistoryStore();
