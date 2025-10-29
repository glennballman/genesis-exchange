
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  fill: string;
}

interface ScoreBreakdownChartProps {
  data: ChartData[];
  totalScore: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
        <p className="label text-sm text-white">{`${payload[0].name} : ${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};


const ScoreBreakdownChart: React.FC<ScoreBreakdownChartProps> = ({ data, totalScore }) => {
  return (
    <div style={{ width: '100%', height: '100%' }} className="relative">
      <ResponsiveContainer>
        <PieChart>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="90%"
            dataKey="value"
            stroke="none"
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
          {totalScore.toLocaleString()}
        </span>
        <span className="text-sm text-gray-400">Genesis Score</span>
      </div>
    </div>
  );
};

export default ScoreBreakdownChart;
