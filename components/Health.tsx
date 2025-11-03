import React, { useState, useMemo } from 'react';
import Card from './ui/Card';
import { HEALTH_INDICATORS_DATA } from '../constants/healthIndicatorsData';
import { HEALTHCARE_INFRASTRUCTURE_DATA } from '../constants/healthcareInfrastructureData';
import { GOVERNORATES_DATA } from '../constants';
import HealthcareInfrastructureChart from './charts/HealthcareInfrastructureChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Health: React.FC = () => {
    const [selectedGov, setSelectedGov] = useState('Amman');

    const latestHealthData = useMemo(() => {
        return GOVERNORATES_DATA.map(gov => {
            const healthData = HEALTH_INDICATORS_DATA.find(g => g.name === gov.name)?.data['2023'];
            return {
                ...gov,
                ...healthData,
            };
        });
    }, []);

    const totals = useMemo(() => {
        const latestInfraData = HEALTHCARE_INFRASTRUCTURE_DATA.map(gov => gov.data[gov.data.length - 1]);
        return latestInfraData.reduce((acc, gov) => {
            acc.beds += gov.hospital_beds_moh;
            acc.centers += gov.health_centers;
            return acc;
        }, { beds: 0, centers: 0 });
    }, []);
    
    const totalPopulation = GOVERNORATES_DATA.reduce((acc, gov) => acc + gov.population, 0);
    const nationalInfantMortality = latestHealthData.reduce((acc, gov) => acc + (gov.infant_mortality_rate || 0) * gov.population, 0) / totalPopulation;


    const selectedGovData = HEALTHCARE_INFRASTRUCTURE_DATA.find(g => g.name === selectedGov)?.data;

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">تحليلات القطاع الصحي</h1>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-1">نظرة شاملة على المؤشرات الصحية والبنية التحتية في الأردن.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">معدل وفيات الرضع الوطني (2023)</h3>
                    <p className="text-5xl font-bold text-red-500 my-2">{nationalInfantMortality.toFixed(1)}</p>
                    <p className="text-sm text-gray-400">لكل 1,000 مولود حي</p>
                </Card>
                <Card className="flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">إجمالي أسرّة المستشفيات (2024)</h3>
                    <p className="text-5xl font-bold text-red-500 my-2">{totals.beds.toLocaleString()}</p>
                </Card>
                 <Card className="flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">إجمالي المراكز الصحية (2024)</h3>
                    <p className="text-5xl font-bold text-red-500 my-2">{totals.centers.toLocaleString()}</p>
                </Card>
            </div>
            
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">مقارنة معدل الإنجاب الكلي بين المحافظات (2023)</h3>
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                    <BarChart data={latestHealthData}>
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
                        />
                        <Bar dataKey="total_fertility_rate" name="معدل الإنجاب الكلي" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

             <Card>
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">اتجاهات البنية التحتية الصحية (2020-2024)</h3>
                    <select
                        value={selectedGov}
                        onChange={(e) => setSelectedGov(e.target.value)}
                        className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm"
                    >
                        {HEALTHCARE_INFRASTRUCTURE_DATA.map(g => <option key={g.name} value={g.name}>{g.name_ar}</option>)}
                    </select>
                </div>
                {selectedGovData && <HealthcareInfrastructureChart data={selectedGovData} />}
            </Card>
        </div>
    );
};

export default Health;