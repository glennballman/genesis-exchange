import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';

const RoadmapDashboard: React.FC = () => {
    const [markdown, setMarkdown] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/components/docs/Roadmap.md')
            .then(response => {
                 if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text()
            })
            .then(text => {
                // Custom renderer to handle [Done] and [Todo]
                const renderer = new marked.Renderer();
                renderer.listitem = (text) => {
                    if (text.startsWith('[Done]')) {
                        return `<li class="text-green-400/80"><span class="text-green-400 font-bold">[Done]</span>${text.substring(6)}</li>`;
                    }
                    if (text.startsWith('[Todo]')) {
                        return `<li class="text-yellow-400/80"><span class="text-yellow-400 font-bold">[Todo]</span>${text.substring(6)}</li>`;
                    }
                    return `<li>${text}</li>`;
                };
                marked.use({ renderer });
                setMarkdown(marked.parse(text) as string);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching roadmap:", error);
                setMarkdown('<p class="text-red-400">Error loading roadmap. Please check the console for details.</p>');
                setIsLoading(false);
            });
        
        // Cleanup to reset to default renderer for other components
        return () => {
            marked.use({ renderer: new marked.Renderer() });
        }
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">GEPN Development Roadmap</h1>
                <p className="mt-1 text-gray-400">Phased rollout plan for the Genesis Exchange Partner Network.</p>
            </div>
            <Card>
                {isLoading ? (
                    <div className="flex justify-center items-center p-10">
                        <Icon name="logo" className="w-12 h-12 text-cyan-400 animate-spin" />
                    </div>
                ) : (
                    <div
                        className="prose prose-invert max-w-none prose-h1:text-cyan-300 prose-h2:text-white prose-h3:text-amber-300 prose-strong:text-white prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-hr:border-slate-700"
                        dangerouslySetInnerHTML={{ __html: markdown }}
                    />
                )}
            </Card>
        </div>
    );
};

export default RoadmapDashboard;
