import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GovernorateIncomeData } from '../../types';

interface IncomeSourceBreakdownChartProps {
  data: GovernorateIncomeData[];
  height?: number;
}

const IncomeSourceBreakdownChart: React.FC<IncomeSourceBreakdownChartProps> = ({ data, height = 450 }) => {
    const chartData = data.map(gov => ({
        name: gov.name_ar,
        ...gov.data
    }));

  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <YAxis tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value)} tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(31, 41, 55, 0.8)',
              borderColor: '#4b5563',
              borderRadius: '0.5rem',
              color: '#fff',
            }}
            cursor={{ fill: 'rgba(75, 85, 99, 0.2)' }}
            formatter={(value: number) => `${value.toFixed(1)} د.أ`}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Bar dataKey="employment_incomes" name="استخدام" stackId="a" fill="#3b82f6" />
          <Bar dataKey="private_work_incomes" name="عمل خاص" stackId="a" fill="#14b8a6" />
          <Bar dataKey="rentals_incomes" name="إيجارات" stackId="a" fill="#f97316" />
          <Bar dataKey="property_incomes" name="ملكية" stackId="a" fill="#f59e0b" />
          <Bar dataKey="transactions_incomes" name="تحويلات" stackId="a" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeSourceBreakdownChart;
