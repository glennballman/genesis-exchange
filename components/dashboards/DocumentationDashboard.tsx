import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';

const DocumentationDashboard: React.FC = () => {
    const [markdown, setMarkdown] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/components/docs/GEPN.md')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                setMarkdown(marked.parse(text) as string);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching GEPN documentation:", error);
                setMarkdown('<p class="text-red-400">Error loading documentation. Please check the console for details.</p>');
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">GEPN Documentation</h1>
                <p className="mt-1 text-gray-400">Genesis Exchange Partner Network (GEPN) strategy and technical overview.</p>
            </div>
            <Card>
                {isLoading ? (
                    <div className="flex justify-center items-center p-10">
                        <Icon name="logo" className="w-12 h-12 text-cyan-400 animate-spin" />
                    </div>
                ) : (
                    <div
                        className="prose prose-invert max-w-none prose-h1:text-cyan-300 prose-h2:text-white prose-h2:border-b prose-h2:border-slate-700 prose-h2:pb-2 prose-h3:text-amber-300 prose-strong:text-white prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-code:text-rose-300 prose-code:before:content-[''] prose-code:after:content-[''] prose-code:bg-slate-700/50 prose-code:p-1 prose-code:rounded prose-li:marker:text-cyan-400"
                        dangerouslySetInnerHTML={{ __html: markdown }}
                    />
                )}
            </Card>
        </div>
    );
};

export default DocumentationDashboard;
