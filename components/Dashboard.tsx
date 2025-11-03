import React, { useMemo } from 'react';
import Card from './ui/Card';
import VisionGapAnalysis from './VisionGapAnalysis';
import GovernorateBarChart from './charts/GovernorateBarChart';
import UnemploymentTrendChart from './charts/UnemploymentTrendChart';
import { GOVERNORATES_DATA } from '../constants';
import { UNEMPLOYMENT_DATA } from '../constants/unemploymentData';

const Dashboard: React.FC = () => {

    const latestUnemploymentData = useMemo(() => {
        return GOVERNORATES_DATA.map(gov => {
            const unemploymentHistory = UNEMPLOYMENT_DATA.find(u => u.name === gov.name)?.data;
            const latestRate = unemploymentHistory ? unemploymentHistory[unemploymentHistory.length - 1].rate : 0;
            return {
                ...gov,
                unemployment_rate_2024: latestRate,
            };
        });
    }, []);
    
    const nationalUnemploymentTrend = useMemo(() => {
        const kingdomData = UNEMPLOYMENT_DATA.find(g => g.name === 'Kingdom');
        return kingdomData ? kingdomData.data : [];
    }, []);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">لوحة المعلومات الرئيسية</h1>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-1">نظرة شاملة على مؤشرات التنمية الرئيسية في الأردن.</p>
            </header>
            
            <VisionGapAnalysis />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">معدل البطالة حسب المحافظة (2024)</h3>
                    <GovernorateBarChart 
                        data={latestUnemploymentData}
                        dataKey="unemployment_rate_2024"
                        unit="%"
                        title=""
                        barColor="#ef4444"
                    />
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">اتجاه معدل البطالة الوطني (2020-2024)</h3>
                    <UnemploymentTrendChart data={nationalUnemploymentTrend} />
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;