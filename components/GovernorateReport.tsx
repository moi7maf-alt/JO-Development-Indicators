import React, { useState, useEffect } from 'react';
import { Packer, Document, Paragraph, HeadingLevel, TextRun, AlignmentType, convertInchesToTwip } from 'docx';
import saveAs from 'file-saver';
import { generateGovernorateReport } from '../services/geminiService';
import { GovernorateData, GeneratedReportData } from '../types';
import { AGRICULTURE_DATA } from '../constants/agricultureData';
import { ECONOMIC_DEV_DATA } from '../constants/economicDevelopmentData';
import { TRAFFIC_ACCIDENTS_2024 } from '../constants/trafficAccidentsData';
import { WATER_DATA } from '../constants/waterData';
import { EDUCATION_DATA } from '../constants/educationData';
import { HEALTHCARE_INFRASTRUCTURE_DATA } from '../constants/healthcareInfrastructureData';
import { LIVESTOCK_DATA } from '../constants/livestockData';
import { INCOME_DATA } from '../constants/incomeData';
import { UNEMPLOYMENT_DATA } from '../constants/unemploymentData';
import { ECONOMIC_EMPOWERMENT_DATA } from '../constants/economicEmpowermentData';
import { SOLID_WASTE_DATA } from '../constants/solidWasteData';
import AgricultureTrendChart from './charts/AgricultureTrendChart';
import AccidentsPieChart from './charts/AccidentsPieChart';
import EconomicDevBarChart from './charts/EconomicDevBarChart';
import WaterTrendChart from './charts/WaterTrendChart';
import EducationTrendChart from './charts/EducationTrendChart';
import HealthcareInfrastructureChart from './charts/HealthcareInfrastructureChart';
import LivestockTrendChart from './charts/LivestockTrendChart';
import IncomeSourceBreakdownChart from './charts/IncomeSourceBreakdownChart';
import UnemploymentTrendChart from './charts/UnemploymentTrendChart';
import EconomicEmpowermentChart from './charts/EconomicEmpowermentChart';
import SolidWasteChart from './charts/SolidWasteChart';


interface GovernorateReportProps {
    governorate: GovernorateData;
}

const StatCard: React.FC<{ title: string; value: string | number; unit: string }> = ({ title, value, unit }) => (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center h-full flex flex-col justify-center">
        <h4 className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</h4>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {value} <span className="text-lg">{unit}</span>
        </p>
    </div>
);

const SwotSection: React.FC<{ title: string; items: string[]; className: string }> = ({ title, items, className }) => (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg h-full">
        <h4 className={`text-lg font-bold mb-3 ${className}`}>{title}</h4>
        <ul className="space-y-2">
            {items.map((item, index) => (
                <li key={index} className="flex items-start">
                    <span className={`flex-shrink-0 mr-2 mt-1 w-2 h-2 rounded-full ${className.replace('text', 'bg')}`}></span>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

const VisionProgressBar: React.FC<{ label: string; current: number; target: number; unit: string; }> = ({ label, current, target, unit }) => {
    const isLowerBetter = label.includes('البطالة') || label.includes('الفقر');
    const progress = isLowerBetter ? Math.min((target / current) * 100, 100) : Math.min((current / target) * 100, 100);
    const goalAchieved = isLowerBetter ? current <= target : current >= target;
    const colorClass = goalAchieved ? 'bg-green-500' : 'bg-yellow-500';

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{current.toFixed(1)}{unit} / <span className="text-gray-500">الهدف: {target}{unit}</span></span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

const AnalysisSection: React.FC<{ title: string; analysis?: { summary: string; keyPoints: string[] }; children?: React.ReactNode }> = ({ title, analysis, children }) => {
    if (!analysis) return null;

    return (
        <section className="page-break">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{title}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {children && (
                     <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        {children}
                    </div>
                )}
                <div className={children ? "lg:col-span-3" : "lg:col-span-5"}>
                    <h4 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">ملخص التحليل</h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{analysis.summary}</p>
                    <h4 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">أبرز النقاط</h4>
                    <ul className="space-y-2">
                        {analysis.keyPoints.map((point, index) => (
                             <li key={index} className="flex items-start">
                                <svg className="flex-shrink-0 w-4 h-4 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                <span className="text-gray-600 dark:text-gray-400">{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};


const handleExportWord = (report: GeneratedReportData, gov: GovernorateData) => {
    // A helper to create bulleted list paragraphs
    const createBulletList = (items: string[] | undefined) => {
        return items ? items.map(item => new Paragraph({ text: item, bullet: { level: 0 } })) : [new Paragraph('')];
    };

    // A helper to create analysis sections
    const createAnalysisSection = (title: string, headingLevel: HeadingLevel, analysis: { summary: string; keyPoints: string[] } | undefined) => {
        if (!analysis) return [];
        return [
            new Paragraph({ text: title, heading: headingLevel }),
            new Paragraph({ text: "الملخص:", style: "strong" }),
            new Paragraph(analysis.summary),
            new Paragraph({ text: "أبرز النقاط:", style: "strong" }),
            ...createBulletList(analysis.keyPoints)
        ];
    };

    const doc = new Document({
        styles: {
            paragraphStyles: [{
                id: "strong",
                name: "Strong",
                basedOn: "Normal",
                next: "Normal",
                run: { bold: true },
            }]
        },
        sections: [{
            properties: {
                page: {
                    margin: { top: convertInchesToTwip(1), right: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1) },
                },
            },
            children: [
                new Paragraph({ text: `تقرير تنموي: محافظة ${gov.name_ar}`, heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
                new Paragraph({ text: "ملخص تنفيذي", heading: HeadingLevel.HEADING_1 }),
                new Paragraph(report.executiveSummary),
                
                new Paragraph({ text: "تحليل SWOT", heading: HeadingLevel.HEADING_1 }),
                new Paragraph({ text: "نقاط القوة", heading: HeadingLevel.HEADING_2 }),
                ...createBulletList(report.swot.strengths),
                new Paragraph({ text: "نقاط الضعف", heading: HeadingLevel.HEADING_2 }),
                ...createBulletList(report.swot.weaknesses),
                new Paragraph({ text: "الفرص", heading: HeadingLevel.HEADING_2 }),
                ...createBulletList(report.swot.opportunities),
                new Paragraph({ text: "التهديدات", heading: HeadingLevel.HEADING_2 }),
                ...createBulletList(report.swot.threats),
                
                ...createAnalysisSection("التحليل الديموغرافي", HeadingLevel.HEADING_1, report.demographicAnalysis),
                ...createAnalysisSection("تحليل سوق العمل", HeadingLevel.HEADING_1, report.laborMarketAnalysis),
                ...createAnalysisSection("تحليل تنمية المرأة", HeadingLevel.HEADING_1, report.womensDevelopmentAnalysis),
                ...createAnalysisSection("تحليل الفرص الاقتصادية", HeadingLevel.HEADING_1, report.economicOpportunitiesAnalysis),
                ...createAnalysisSection("تحليل قطاع التعليم", HeadingLevel.HEADING_1, report.educationAnalysis),
                ...createAnalysisSection("تحليل القطاع الصحي", HeadingLevel.HEADING_1, report.healthAnalysis),
                ...createAnalysisSection("تحليل الثروة الحيوانية", HeadingLevel.HEADING_1, report.livestockAnalysis),
                ...createAnalysisSection("تحليل دخل الأسرة", HeadingLevel.HEADING_1, report.incomeAnalysis),

                new Paragraph({ text: "التحليل الزراعي", heading: HeadingLevel.HEADING_1 }),
                new Paragraph({ text: "ملخص القطاع الزراعي", heading: HeadingLevel.HEADING_2 }),
                new Paragraph(report.agricultureAnalysis.summary),
                new Paragraph({ text: "أبرز الاتجاهات", heading: HeadingLevel.HEADING_2 }),
                ...createBulletList(report.agricultureAnalysis.trends),

                ...createAnalysisSection("تحليل الأمن المائي", HeadingLevel.HEADING_1, report.waterSecurityAnalysis),
                ...createAnalysisSection("تحليل السلامة العامة", HeadingLevel.HEADING_1, report.publicSafetyAnalysis),
                ...createAnalysisSection("التحليل البيئي", HeadingLevel.HEADING_1, report.environmentAnalysis),

                new Paragraph({ text: "التوافق مع رؤية 2033", heading: HeadingLevel.HEADING_1 }),
                 ...report.visionAlignment.map(item => new Paragraph(`${item.indicator}: ${item.currentValue.toFixed(1)}${item.unit} (الهدف: ${item.targetValue}${item.unit})`)),

                new Paragraph({ text: "التوصيات", heading: HeadingLevel.HEADING_1 }),
                ...createBulletList(report.recommendations),
            ],
        }],
    });

    Packer.toBlob(doc).then(blob => {
        saveAs(blob, `report-${gov.name}.docx`);
    });
};


const GovernorateReport: React.FC<GovernorateReportProps> = ({ governorate }) => {
    const [report, setReport] = useState<GeneratedReportData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generateReport = async () => {
            if (!governorate) {
                setError('Governorate data not found.');
                return;
            }

            setIsLoading(true);
            setError(null);
            setReport(null);

            try {
                const summary = await generateGovernorateReport(governorate);
                setReport(summary);
            } catch (err: any) {
                setError(err.message || 'An error occurred while generating the report.');
            } finally {
                setIsLoading(false);
            }
        };

        generateReport();
    }, [governorate]);
    
    // Find data for charts
    const governorateAgriData = AGRICULTURE_DATA.find(g => g.name === governorate.name)?.data;
    const accidentsData = TRAFFIC_ACCIDENTS_2024.find(g => g.name === governorate.name);
    const economicDevData = ECONOMIC_DEV_DATA.find(g => g.name === governorate.name)?.data;
    const waterData = WATER_DATA.find(g => g.name === governorate.name)?.data;
    const educationData = EDUCATION_DATA.find(g => g.name === governorate.name)?.data;
    const healthcareInfraData = HEALTHCARE_INFRASTRUCTURE_DATA.find(g => g.name === governorate.name)?.data;
    const livestockData = LIVESTOCK_DATA.find(g => g.name === governorate.name)?.data;
    const incomeData = INCOME_DATA.find(g => g.name === governorate.name);
    const unemploymentData = UNEMPLOYMENT_DATA.find(g => g.name === governorate.name)?.data;
    const economicEmpowermentData = ECONOMIC_EMPOWERMENT_DATA.find(g => g.name === governorate.name)?.data;
    const solidWasteData = SOLID_WASTE_DATA.find(g => g.name === governorate.name)?.data;

    // FIX: Transform solidWasteData to match the props required by SolidWasteChart
    const solidWasteChartData = solidWasteData?.map(d => ({
        name_ar: String(d.year),
        quantity_tons_2022: d.quantity_tons,
    }));

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mr-4 text-gray-500 dark:text-gray-400">...جاري إنشاء تقرير شامل عن محافظة {governorate.name_ar}</p>
            </div>
        );
    }
    
    if (error) {
        return <div className="p-4 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded-lg text-center"><strong>خطأ:</strong> {error}</div>;
    }

    if (!report) {
        return null;
    }
    
    const latestUnemployment = unemploymentData ? unemploymentData[unemploymentData.length-1].rate : 0;

    return (
        <div id="report-content" className="space-y-12 bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            {/* Header and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 dark:border-gray-700 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">التقرير التنموي لمحافظة {governorate.name_ar}</h2>
                    <p className="text-md text-gray-500 dark:text-gray-400 mt-1">تحليل شامل للوضع التنموي بناءً على أحدث البيانات.</p>
                </div>
                <div className="flex space-x-2 rtl:space-x-reverse mt-4 md:mt-0 no-print">
                    <button onClick={() => handleExportWord(report, governorate)} className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800">تصدير Word</button>
                    <button onClick={() => window.print()} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">طباعة</button>
                </div>
            </div>

            {/* Executive Summary */}
            <section>
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">ملخص تنفيذي</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{report.executiveSummary}</p>
            </section>

            {/* Key Indicators */}
            <section>
                 <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">المؤشرات العامة الرئيسية</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard title="السكان (2024)" value={governorate.population.toLocaleString()} unit="" />
                    <StatCard title="البطالة (2024)" value={latestUnemployment.toFixed(1)} unit="%" />
                 </div>
            </section>
            
            {/* SWOT Analysis */}
            <section>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">تحليل SWOT</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SwotSection title="نقاط القوة" items={report.swot.strengths} className="text-green-600 dark:text-green-400" />
                    <SwotSection title="نقاط الضعف" items={report.swot.weaknesses} className="text-red-600 dark:text-red-400" />
                    <SwotSection title="الفرص" items={report.swot.opportunities} className="text-blue-600 dark:text-blue-400" />
                    <SwotSection title="التهديدات" items={report.swot.threats} className="text-yellow-600 dark:text-yellow-400" />
                </div>
            </section>

            <AnalysisSection title="التحليل الديموغرافي (2024)" analysis={report.demographicAnalysis} />

            <AnalysisSection title="تحليل سوق العمل" analysis={report.laborMarketAnalysis}>
                {unemploymentData && <UnemploymentTrendChart data={unemploymentData} height={250} />}
            </AnalysisSection>
            
            <AnalysisSection title="تحليل تنمية وتمكين المرأة" analysis={report.womensDevelopmentAnalysis}>
                {economicEmpowermentData && <EconomicEmpowermentChart data={economicEmpowermentData} height={250} />}
            </AnalysisSection>
            
            <AnalysisSection title="تحليل الفرص الاقتصادية" analysis={report.economicOpportunitiesAnalysis}>
                 {economicDevData && <EconomicDevBarChart data={economicDevData} />}
            </AnalysisSection>

            <AnalysisSection title="تحليل قطاع التعليم" analysis={report.educationAnalysis}>
                {educationData && <EducationTrendChart data={educationData} />}
            </AnalysisSection>

             <AnalysisSection title="تحليل القطاع الصحي" analysis={report.healthAnalysis}>
                {healthcareInfraData && <HealthcareInfrastructureChart data={healthcareInfraData} />}
            </AnalysisSection>

            <AnalysisSection title="التحليل الزراعي" analysis={{ summary: report.agricultureAnalysis.summary, keyPoints: report.agricultureAnalysis.trends }}>
                {governorateAgriData && <AgricultureTrendChart data={governorateAgriData} />}
            </AnalysisSection>

            <AnalysisSection title="تحليل الثروة الحيوانية" analysis={report.livestockAnalysis}>
                {livestockData && <LivestockTrendChart data={livestockData} />}
            </AnalysisSection>

             <AnalysisSection title="تحليل دخل الأسرة" analysis={report.incomeAnalysis}>
                {incomeData && <IncomeSourceBreakdownChart data={[incomeData]} height={250} />}
            </AnalysisSection>

            <AnalysisSection title="تحليل الأمن المائي" analysis={report.waterSecurityAnalysis}>
                {waterData && <WaterTrendChart data={waterData} />}
            </AnalysisSection>

            <AnalysisSection title="تحليل السلامة العامة (2024)" analysis={report.publicSafetyAnalysis}>
                {accidentsData && <AccidentsPieChart data={accidentsData} />}
            </AnalysisSection>
            
            <AnalysisSection title="التحليل البيئي" analysis={report.environmentAnalysis}>
                {solidWasteChartData && <SolidWasteChart data={solidWasteChartData} isTimeSeries={true} />}
            </AnalysisSection>

             {/* Vision 2033 Alignment */}
            <section className="page-break">
                 <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">التوافق مع رؤية 2033</h3>
                 <div className="space-y-4">
                    {report.visionAlignment.map(item => (
                        <VisionProgressBar 
                            key={item.indicator}
                            label={item.indicator}
                            current={item.currentValue}
                            target={item.targetValue}
                            unit={item.unit}
                        />
                    ))}
                 </div>
            </section>

            {/* Recommendations */}
            <section>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">التوصيات</h3>
                <ul className="space-y-3">
                    {report.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                            <svg className="flex-shrink-0 w-5 h-5 text-blue-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default GovernorateReport;