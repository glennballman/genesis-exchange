
import React, { useState } from 'react';
import { getPulseAnalysis } from '../services/geminiService';
import { PulseAnalysis } from '../types';
import { Icon } from './ui/Icon';

const exampleQueries = [
    "Fintech SaaS startup in Southeast Asia",
    "Direct-to-consumer brand for sustainable fashion",
    "B2B platform for quantum computing research",
    "Local restaurant chain planning to expand",
];

const ProactivePulseEngine: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [analysis, setAnalysis] = useState<PulseAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const result = await getPulseAnalysis(query);
            setAnalysis(result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleExampleClick = (example: string) => {
        setQuery(example);
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-rose-500/10 rounded-lg">
                    <Icon name="pulse" className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-white">Proactive Pulse Engine</h3>
                    <p className="text-sm text-gray-400">Real-time threat & opportunity detection powered by AI.</p>
                </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <form onSubmit={handleAnalyze}>
                    <label htmlFor="pulse-query" className="block text-sm font-medium text-gray-300 mb-2">
                        Describe your venture or market to analyze:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            id="pulse-query"
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., 'AI-powered drug discovery platform'"
                            className="w-full px-4 py-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !query.trim()}
                            className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-rose-600 rounded-md hover:bg-rose-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Icon name="send" className="w-5 h-5" />
                                    Analyze
                                </>
                            )}
                        </button>
                    </div>
                </form>
                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs text-gray-400 self-center">Try:</span>
                    {exampleQueries.map(ex => (
                        <button key={ex} onClick={() => handleExampleClick(ex)} className="text-xs bg-slate-700 hover:bg-slate-600 text-gray-300 px-2 py-1 rounded-md transition">
                            {ex}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-md">
                        <p className="font-semibold">Analysis Failed</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {analysis && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Opportunities */}
                        <div className="bg-green-900/20 border border-green-700/50 p-4 rounded-lg">
                            <h4 className="text-lg font-semibold text-green-300 mb-3">Opportunities</h4>
                            <ul className="space-y-3">
                                {analysis.opportunities.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
                                        <span className="text-green-400 mt-1">&#10003;</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Threats */}
                        <div className="bg-red-900/20 border border-red-700/50 p-4 rounded-lg">
                            <h4 className="text-lg font-semibold text-red-300 mb-3">Threats</h4>
                            <ul className="space-y-3">
                                {analysis.threats.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
                                        <span className="text-red-400 mt-1">&#9888;</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProactivePulseEngine;
