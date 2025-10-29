import React from 'react';

interface MiniScoreGaugeProps {
    score: number;
    maxScore: number;
}

const MiniScoreGauge: React.FC<MiniScoreGaugeProps> = ({ score, maxScore }) => {
    const percentage = score / maxScore;
    const circumference = 2 * Math.PI * 18; // 2 * pi * radius
    const strokeDashoffset = circumference - percentage * circumference;
    const scoreColor = score >= 800 ? 'text-green-400' : score >= 500 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="flex items-center gap-2 group" title={`Strength Score: ${score}/${maxScore}`}>
            <div className="relative w-10 h-10">
                <svg className="w-full h-full" viewBox="0 0 40 40">
                    <circle className="text-slate-700" strokeWidth="4" stroke="currentColor" fill="transparent" r="18" cx="20" cy="20" />
                    <circle
                        className={scoreColor}
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="18"
                        cx="20"
                        cy="20"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xs font-bold ${scoreColor}`}>{score}</span>
                </div>
            </div>
        </div>
    );
};

export default MiniScoreGauge;
