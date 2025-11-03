
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import { GovernorateData } from '../../types';

interface GovernorateBarChartProps {
  data: GovernorateData[];
  dataKey: keyof GovernorateData;
  unit: string;
  title: string;
  barColor: string;
}

const GovernorateBarChart: React.FC<GovernorateBarChartProps> = ({ data, dataKey, unit, title, barColor }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{title}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} unit={unit} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: '#4b5563',
                borderRadius: '0.5rem',
                color: '#fff',
              }}
              cursor={{ fill: 'rgba(75, 85, 99, 0.2)' }}
            />
            <Legend wrapperStyle={{ fontSize: '14px' }} />
            <Bar dataKey={dataKey} name={title.replace(/by Governorate/i, '').trim()} fill={barColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default GovernorateBarChart;
