
import React, { useState, useEffect } from 'react';
import { YoutubeSuggestion, QuizQuestion } from '../../types';
import { generateQuiz } from '../../services/geminiService';
import { userProfileStore } from '../../services/userProfileStore';
import { historyStore } from '../../services/historyStore';
import { Icon } from '../ui/Icon';

interface LearningModuleProps {
    module: YoutubeSuggestion;
    onClose: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-10 w-10 border-4 border-cyan-400 border-t-transparent rounded-full"></div>
    </div>
);

const LearningModule: React.FC<LearningModuleProps> = ({ module, onClose }) => {
    const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const pointsPerLevel = { 'Beginner': 500, 'Intermediate': 1000, 'Advanced': 2000 };
    const points = pointsPerLevel[module.level || 'Beginner'];

    useEffect(() => {
        const fetchQuiz = async () => {
            setIsLoading(true);
            try {
                const result = await generateQuiz(module.title);
                setQuiz(result);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuiz();
    }, [module.title]);

    const handleAnswerSubmit = () => {
        if (!quiz || selectedAnswer === null) return;
        const correct = selectedAnswer === quiz[currentQuestionIndex].correctAnswer;
        setIsCorrect(correct);
        if (correct) {
            setScore(prev => prev + 1);
        }
        setTimeout(() => {
            setIsCorrect(null);
            setSelectedAnswer(null);
            if (currentQuestionIndex < quiz.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setIsFinished(true);
                if (score + (correct ? 1 : 0) === quiz.length) {
                    userProfileStore.addCompletedModule({
                        moduleId: module.videoId,
                        title: module.title,
                        pointsAwarded: points,
                    });
                    // Record a new snapshot for the history charts
                    historyStore.addScoreSnapshot();
                }
            }
        }, 1500);
    };

    const getButtonClass = (option: string) => {
        if (isCorrect !== null) { // An answer has been submitted
            if (option === quiz![currentQuestionIndex].correctAnswer) {
                return 'bg-green-500/20 border-green-500 text-white'; // Correct answer
            }
            if (option === selectedAnswer) {
                return 'bg-red-500/20 border-red-500 text-white'; // Incorrectly selected
            }
        }
        return selectedAnswer === option
            ? 'bg-cyan-500/20 border-cyan-500' // Selected but not submitted
            : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'; // Default
    };

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col p-4 sm:p-8">
            <header className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 className="text-xl font-bold text-white">Genesis U: {module.level} Module</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-gray-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                    <div className="aspect-video bg-black rounded-md mb-4">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${module.videoId}`}
                            title={module.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-md"
                        ></iframe>
                    </div>
                    <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-lg flex flex-col">
                    {isLoading && <LoadingSpinner />}
                    {!isLoading && quiz && !isFinished && (
                        <>
                            <h3 className="text-lg font-semibold text-white mb-1">Knowledge Check</h3>
                            <p className="text-sm text-gray-400 mb-4">Question {currentQuestionIndex + 1} of {quiz.length}</p>
                            <p className="text-gray-200 mb-6">{quiz[currentQuestionIndex].question}</p>
                            <div className="space-y-3">
                                {quiz[currentQuestionIndex].options.map((option, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedAnswer(option)}
                                        disabled={isCorrect !== null}
                                        className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${getButtonClass(option)}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            <button onClick={handleAnswerSubmit} disabled={selectedAnswer === null || isCorrect !== null} className="mt-auto w-full px-6 py-3 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 disabled:bg-gray-600">
                                Submit Answer
                            </button>
                        </>
                    )}
                    {isFinished && (
                        <div className="text-center m-auto">
                            {score === quiz?.length ? (
                                <>
                                    <Icon name="logo" className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                    <h2 className="text-3xl font-bold text-white mb-2">Module Complete!</h2>
                                    <p className="text-lg text-yellow-400 font-bold mb-4">+{points.toLocaleString()} GUMP Points Awarded</p>
                                    <p className="text-gray-300 mb-6">Your Genesis Score has been updated. Great work!</p>
                                </>
                            ) : (
                                <>
                                    <Icon name="info" className="w-16 h-16 text-red-400 mx-auto mb-4" />
                                    <h2 className="text-3xl font-bold text-white mb-2">Module Incomplete</h2>
                                    <p className="text-gray-300 mb-6">You scored {score} out of {quiz?.length}. A perfect score is needed to earn points. Feel free to review the material and try again.</p>
                                </>
                            )}
                             <button onClick={onClose} className="w-full sm:w-auto px-8 py-3 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500">
                                Return to Score Details
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LearningModule;
