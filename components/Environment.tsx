import React, { useMemo } from 'react';
import Card from './ui/Card';
import { SOLID_WASTE_DATA } from '../constants/solidWasteData';
import { GOVERNORATES_DATA } from '../constants';
import SolidWasteChart from './charts/SolidWasteChart';

const Environment: React.FC = () => {

    const latestData = useMemo(() => {
        const populationMap = new Map(GOVERNORATES_DATA.map(g => [g.name, g.population]));
        
        return SOLID_WASTE_DATA.filter(g => g.name !== 'Kingdom').map(gov => {
            const lastEntry = gov.data.find(d => d.year === 2022) || gov.data[gov.data.length - 1];
            const baseGovData = GOVERNORATES_DATA.find(g => g.name === gov.name);
            const population = populationMap.get(gov.name) || 1;
            const wastePerCapita = (lastEntry.quantity_tons * 1000) / population; // kg/person/year

            return {
                ...baseGovData!,
                name: gov.name,
                name_ar: gov.name_ar,
                quantity_tons_2022: lastEntry.quantity_tons,
                waste_per_capita_2022: isNaN(wastePerCapita) ? 0 : wastePerCapita,
            };
        });
    }, []);

    const kingdomTotals = useMemo(() => {
        const kingdomData = SOLID_WASTE_DATA.find(g => g.name === 'Kingdom');
        const totalPopulation = GOVERNORATES_DATA.reduce((acc, gov) => acc + gov.population, 0);
        const latestWaste = kingdomData?.data.find(d => d.year === 2022)?.quantity_tons || 0;
        const avgWastePerCapita = (latestWaste * 1000) / totalPopulation; // kg/person/year

        return {
            totalWaste: latestWaste,
            avgWastePerCapita: avgWastePerCapita,
        };
    }, []);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">تحليلات البيئة</h1>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-1">مؤشرات الإدارة البيئية والخدمات البلدية في الأردن.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="flex flex-col justify-center items-center bg-green-50 dark:bg-green-900/50">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">إجمالي النفايات المجمعة (2022)</h3>
                    <p className="text-5xl font-bold text-green-600 my-2">{Math.round(kingdomTotals.totalWaste).toLocaleString()}</p>
                    <p className="text-sm text-gray-400">طن سنوياً</p>
                </Card>
                <Card className="flex flex-col justify-center items-center bg-green-50 dark:bg-green-900/50">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">المعدل الوطني لإنتاج الفرد للنفايات</h3>
                    <p className="text-5xl font-bold text-green-600 my-2">{kingdomTotals.avgWastePerCapita.toFixed(1)}</p>
                    <p className="text-sm text-gray-400">كغم / فرد / سنة</p>
                </Card>
            </div>
            
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">كمية النفايات الصلبة المجمعة حسب المحافظة (طن - 2022)</h3>
                <SolidWasteChart data={latestData} />
            </Card>

        </div>
    );
};

export default Environment;