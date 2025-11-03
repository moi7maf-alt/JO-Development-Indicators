import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SolidWasteChartProps {
  data: {
      name_ar: string;
      quantity_tons_2022: number;
  }[];
  isTimeSeries?: boolean;
}

const SolidWasteChart: React.FC<SolidWasteChartProps> = ({ data, isTimeSeries = false }) => {
  // FIX: Conditionally sort data. For time series, we want to maintain chronological order.
  const chartData = isTimeSeries ? data : [...data].sort((a, b) => b.quantity_tons_2022 - a.quantity_tons_2022);
  const barName = isTimeSeries ? "كمية النفايات (طن)" : "كمية النفايات (2022)";

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
          <XAxis dataKey="name_ar" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <YAxis tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value)} tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(31, 41, 55, 0.8)',
              borderColor: '#4b5563',
              borderRadius: '0.5rem',
              color: '#fff',
            }}
            cursor={{ fill: 'rgba(75, 85, 99, 0.2)' }}
            formatter={(value: number) => [`${Math.round(value).toLocaleString()} طن`, 'الكمية']}
          />
          <Bar dataKey="quantity_tons_2022" name={barName} fill="#22c55e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SolidWasteChart;
