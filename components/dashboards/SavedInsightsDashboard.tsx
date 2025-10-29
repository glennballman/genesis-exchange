import React, { useState, useEffect } from 'react';
import { insightStore } from '../../services/insightStore';
import { SavedInsight } from '../../types';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import IpAnalysisReportCard from '../insights/IpAnalysisReportCard';

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => (
    <div className="prose prose-sm prose-invert max-w-none text-gray-300"
         dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />').replace(/### (.*?)/g, '<h3 class="text-white font-semibold mt-4">$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^- /gm, '<br>• ') }} />
);

const SavedInsightsDashboard: React.FC = () => {
    const [insights, setInsights] = useState<SavedInsight[]>([]);

    useEffect(() => {
        const handleFocus = () => {
            setInsights(insightStore.getInsights());
        };
        
        handleFocus();
        window.addEventListener('focus', handleFocus);
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Saved Insights</h1>
                <p className="mt-1 text-gray-400">Your personal knowledge base of AI-generated advice and strategies.</p>
            </div>

            {insights.length === 0 ? (
                <Card className="text-center py-12">
                    <Icon name="saved" className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-lg font-semibold text-white">No Insights Saved Yet</h3>
                    <p className="text-gray-400 mt-1">Go to the 'Score Calculation' page, click on a line item, and save insights to see them here.</p>
                </Card>
            ) : (
                <div className="space-y-6">
                    {insights.map(insight => (
                        <Card key={insight.id}>
                            <div className="border-b border-slate-700 pb-4 mb-4">
                                <h2 className="text-lg font-semibold text-amber-300">{insight.concept}</h2>
                                <p className="text-xs text-gray-500">Saved on {new Date(insight.timestamp).toLocaleDateString()}</p>
                            </div>
                            
                            {insight.concept.startsWith('IP Analysis:') && insight.ipAnalysisReport ? (
                                <IpAnalysisReportCard report={insight.ipAnalysisReport} />
                            ) : (
                                <>
                                    {insight.aiSummary && <MarkdownRenderer content={insight.aiSummary} />}
                                    {insight.takeActionPlan && (
                                        <div className="mt-6 border-t border-slate-700 pt-6">
                                            <h3 className="font-semibold text-rose-300 mb-4">Action Plan</h3>
                                            {/* Action Plan rendering would go here */}
                                        </div>
                                    )}
                                </>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedInsightsDashboard;
