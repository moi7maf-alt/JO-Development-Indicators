import React, { useState } from 'react';
import Card from './ui/Card';
import { NATIONAL_AVERAGES_2024 } from '../constants';
import { ECONOMIC_EMPOWERMENT_DATA } from '../constants/economicEmpowermentData';
import EconomicEmpowermentChart from './charts/EconomicEmpowermentChart';

const WomensDevelopment: React.FC = () => {
    const [selectedGov, setSelectedGov] = useState('Amman');
    
    const selectedGovData = ECONOMIC_EMPOWERMENT_DATA.find(g => g.name === selectedGov)?.data;

    return (
        <div className="space-y-8">
             <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">تحليلات تنمية المرأة</h1>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-1">استكشاف المؤشرات الرئيسية المتعلقة بتمكين المرأة في الأردن.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">مشاركة الإناث في القوى العاملة (2024)</h3>
                    <p className="text-5xl font-bold text-violet-500 my-2">{NATIONAL_AVERAGES_2024.female_labor_force_participation.toFixed(1)}%</p>
                    <p className="text-sm text-gray-400">المعدل الوطني</p>
                </Card>
                <Card>
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">العاملون المؤمن عليهم (الضمان الاجتماعي)</h3>
                        <select
                            value={selectedGov}
                            onChange={(e) => setSelectedGov(e.target.value)}
                            className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm"
                        >
                            {ECONOMIC_EMPOWERMENT_DATA.map(g => <option key={g.name} value={g.name}>{g.name_ar}</option>)}
                        </select>
                    </div>
                    {selectedGovData && <EconomicEmpowermentChart data={selectedGovData} />}
                </Card>
            </div>
            
        </div>
    );
};

export default WomensDevelopment;