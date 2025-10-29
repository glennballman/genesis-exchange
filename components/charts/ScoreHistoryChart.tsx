
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ScoreSnapshot } from '../../types';

interface ScoreHistoryChartProps {
    data: ScoreSnapshot[];
    color: string;
    gradientId: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-slate-800 border border-slate-700 rounded-md shadow-lg">
        <p className="label text-sm text-white">{`Date: ${label}`}</p>
        <p className="intro text-sm text-cyan-300">{`Score: ${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const ScoreHistoryChart: React.FC<ScoreHistoryChartProps> = ({ data, color, gradientId }) => {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <AreaChart
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={color} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }} />
                <YAxis stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke={color} fillOpacity={1} fill={`url(#${gradientId})`} strokeWidth={2} />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default ScoreHistoryChart;
