import React, { useState, useMemo } from 'react';
import Card from './ui/Card';
import { EDUCATION_DATA } from '../constants/educationData';
import { GOVERNORATES_DATA } from '../constants';
import EducationTrendChart from './charts/EducationTrendChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Education: React.FC = () => {
    const [selectedGov, setSelectedGov] = useState('Amman');

    const latestData = useMemo(() => {
        // Fix: Merge education data with base governorate data to satisfy the GovernorateData type for JordanMapChart
        // while also providing education-specific fields for other charts.
        return EDUCATION_DATA.map(gov => {
            const lastEntry = gov.data[gov.data.length - 1];
            const baseGovData = GOVERNORATES_DATA.find(g => g.name === gov.name);
            return {
                ...baseGovData!,
                ...lastEntry,
            };
        });
    }, []);

    const totals = useMemo(() => {
        return latestData.reduce((acc, gov) => {
            acc.students += gov.students;
            acc.schools += gov.schools;
            acc.teachers += gov.teachers;
            return acc;
        }, { students: 0, schools: 0, teachers: 0 });
    }, [latestData]);

    const averageStudentTeacherRatio = totals.students / totals.teachers;

    const selectedGovData = EDUCATION_DATA.find(g => g.name === selectedGov)?.data;

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">تحليلات قطاع التعليم</h1>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-1">نظرة معمقة على المؤشرات التعليمية في محافظات الأردن.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">إجمالي الطلبة (2024)</h3>
                    <p className="text-5xl font-bold text-blue-500 my-2">{totals.students.toLocaleString()}</p>
                </Card>
                <Card className="flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">إجمالي المدارس (2024)</h3>
                    <p className="text-5xl font-bold text-blue-500 my-2">{totals.schools.toLocaleString()}</p>
                </Card>
                 <Card className="flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">المعدل الوطني طالب/معلم</h3>
                    <p className="text-5xl font-bold text-blue-500 my-2">{averageStudentTeacherRatio.toFixed(1)}</p>
                </Card>
            </div>
            
            <Card>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">مقارنة نسبة طالب/معلم بين المحافظات (2024)</h3>
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                    <BarChart data={latestData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                        <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                        <YAxis type="category" dataKey="name_ar" width={80} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                        <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(31, 41, 55, 0.8)',
                            borderColor: '#4b5563',
                            borderRadius: '0.5rem',
                            color: '#fff',
                        }}
                        cursor={{ fill: 'rgba(75, 85, 99, 0.2)' }}
                        />
                        <Bar dataKey="student_teacher_ratio" name="نسبة طالب/معلم" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

             <Card>
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">اتجاهات أعداد الطلبة والمعلمين (2020-2024)</h3>
                    <select
                        value={selectedGov}
                        onChange={(e) => setSelectedGov(e.target.value)}
                        className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm"
                    >
                        {EDUCATION_DATA.map(g => <option key={g.name} value={g.name}>{g.name_ar}</option>)}
                    </select>
                </div>
                {selectedGovData && <EducationTrendChart data={selectedGovData} />}
            </Card>
        </div>
    );
};

export default Education;