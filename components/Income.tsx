import React, { useMemo } from 'react';
import Card from './ui/Card';
import { INCOME_DATA } from '../constants/incomeData';
import { GOVERNORATES_DATA } from '../constants';
import IncomeSourceBreakdownChart from './charts/IncomeSourceBreakdownChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Income: React.FC = () => {
    const governorateIncomeData = useMemo(() => INCOME_DATA.filter(d => !['Urban', 'Rural', 'Kingdom'].includes(d.name)), []);

    const latestData = useMemo(() => {
        return governorateIncomeData.map(gov => {
            const baseGovData = GOVERNORATES_DATA.find(g => g.name === gov.name);
            return {
                ...baseGovData!,
                name: gov.name,
                name_ar: gov.name_ar,
                average_total_income: gov.data.average_total_income,
                income_from_employment: gov.data.employment_incomes,
            };
        });
    }, [governorateIncomeData]);

    const summaryData = {
        kingdom: INCOME_DATA.find(d => d.name === 'Kingdom')?.data,
        urban: INCOME_DATA.find(d => d.name === 'Urban')?.data,
        rural: INCOME_DATA.find(d => d.name === 'Rural')?.data,
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">تحليلات دخل الأسرة</h1>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-1">نظرة على متوسط دخل الأفراد السنوي ومصادره في محافظات المملكة.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="flex flex-col justify-center items-center bg-green-50 dark:bg-green-900/50">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">متوسط دخل المملكة</h3>
                    <p className="text-5xl font-bold text-green-500 my-2">{summaryData.kingdom?.average_total_income.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">دينار أردني سنوياً</p>
                </Card>
                <Card className="flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">متوسط دخل الحضر</h3>
                    <p className="text-5xl font-bold text-gray-800 dark:text-gray-200 my-2">{summaryData.urban?.average_total_income.toLocaleString()}</p>
                     <p className="text-sm text-gray-400">دينار أردني سنوياً</p>
                </Card>
                 <Card className="flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">متوسط دخل الريف</h3>
                    <p className="text-5xl font-bold text-gray-800 dark:text-gray-200 my-2">{summaryData.rural?.average_total_income.toLocaleString()}</p>
                     <p className="text-sm text-gray-400">دينار أردني سنوياً</p>
                </Card>
            </div>
            
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">مقارنة متوسط إجمالي الدخل السنوي بين المحافظات (دينار أردني)</h3>
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                    <BarChart data={latestData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                        <XAxis dataKey="name_ar" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
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
                        <Bar dataKey="average_total_income" name="متوسط إجمالي الدخل" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">مكونات الدخل السنوي حسب المحافظة (دينار أردني)</h3>
                <IncomeSourceBreakdownChart data={governorateIncomeData} />
            </Card>

        </div>
    );
};

export default Income;