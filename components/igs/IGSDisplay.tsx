
import React from 'react';
import { IndividualGumpScore } from '../../types';
import { Card } from '../ui/Card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface IGSDisplayProps {
    igs: IndividualGumpScore;
}

const IGSDisplay: React.FC<IGSDisplayProps> = ({ igs }) => {

    const data = [
        { subject: 'Exits', score: igs.provenExecution.exits, fullMark: 150 },
        { subject: 'Scaling', score: igs.provenExecution.scaling, fullMark: 150 },
        { subject: 'Capital Gov.', score: igs.provenExecution.capitalGovernance, fullMark: 150 },
        { subject: 'Discipline', score: igs.pillarsOfPotential.disciplineGrit, fullMark: 150 },
        { subject: 'IP Horsepower', score: igs.pillarsOfPotential.intellectualHorsepower, fullMark: 150 },
        { subject: 'Ambition', score: igs.pillarsOfPotential.ambition, fullMark: 150 },
    ];

    return (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-300">Total IGS</h3>
                    <p className="text-6xl font-bold text-cyan-400">{igs.total}</p>
                    <p className="text-sm text-gray-400">out of 900</p>
                </div>
                <div className="md:col-span-2 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                            <defs>
                                <radialGradient id="colorUv">
                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.1}/>
                                </radialGradient>
                            </defs>
                            <PolarGrid stroke="#4b5563" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#d1d5db', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fill: 'transparent' }} />
                            <Radar name="Your Score" dataKey="score" stroke="#22d3ee" fill="url(#colorUv)" fillOpacity={0.6} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '0.5rem' }}
                                labelStyle={{ color: '#f9fafb' }}
                            />
                             <Legend wrapperStyle={{ color: '#9ca3af' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};

export default IGSDisplay;
