import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrafficAccidentsData } from '../../types';

interface AccidentsPieChartProps {
  data: TrafficAccidentsData;
}

const AccidentsPieChart: React.FC<AccidentsPieChartProps> = ({ data }) => {
  const chartData = [
    { name: 'صدم', value: data.collision },
    { name: 'دهس', value: data.run_over },
    { name: 'تدهور', value: data.rollover },
  ];

  const COLORS = ['#3b82f6', '#f97316', '#ef4444'];

  return (
    <>
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">أنواع حوادث الإصابات البشرية</h4>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="14">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: '#4b5563',
                borderRadius: '0.5rem',
                color: '#fff',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '14px', marginTop: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default AccidentsPieChart;
