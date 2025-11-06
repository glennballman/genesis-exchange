
import React, { useState } from 'react';
import { User, IndividualGumpScore } from '../../types';
import { calculateIGS } from '../../services/geminiService';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { app } from '../../firebase';

interface IGSCalculatorProps {
    user: User;
    onCalculationComplete: (newScore: IndividualGumpScore) => void;
}

const IGSCalculator: React.FC<IGSCalculatorProps> = ({ user, onCalculationComplete }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = async () => {
        if (!user.achievements || user.achievements.length === 0) {
            setError('Please add at least one achievement before calculating your score.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const igsResult = await calculateIGS(user.achievements);
            
            const db = getFirestore(app);
            const userDocRef = doc(db, 'users', user.id);
            await updateDoc(userDocRef, { igs: igsResult });

            onCalculationComplete(igsResult);

        } catch (err) {
            console.error("Error calculating IGS:", err);
            setError('An error occurred while calculating the score. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-800 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-white">Individual GUMP Score (IGS)</h3>
            <p className="text-sm text-gray-400 mb-4">Analyze your achievements to calculate your initial IGS.</p>
            
            <button
                onClick={handleCalculate}
                disabled={isLoading}
                className="w-full px-4 py-2 font-bold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? 'Calculating...' : 'Calculate My IGS'}
            </button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
};

export default IGSCalculator;
