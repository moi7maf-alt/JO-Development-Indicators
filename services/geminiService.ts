import { GoogleGenAI, Type } from "@google/genai";
import { GovernorateData, GeneratedReportData } from '../types';
import { JORDAN_VISION_2033_TARGETS } from '../constants';
import { AGRICULTURE_DATA } from '../constants/agricultureData';
import { POPULATION_DATA_2024 } from '../constants/populationData';
import { WOMEN_DEV_DATA_2024 } from '../constants/womensDevelopmentData';
import { ECONOMIC_DEV_DATA } from '../constants/economicDevelopmentData';
import { WATER_DATA } from '../constants/waterData';
import { TRAFFIC_ACCIDENTS_2024 } from '../constants/trafficAccidentsData';
import { EDUCATION_DATA } from '../constants/educationData';
import { HEALTH_INDICATORS_DATA } from '../constants/healthIndicatorsData';
import { HEALTHCARE_INFRASTRUCTURE_DATA } from '../constants/healthcareInfrastructureData';
import { LIVESTOCK_DATA } from '../constants/livestockData';
import { INCOME_DATA } from '../constants/incomeData';
import { UNEMPLOYMENT_DATA } from '../constants/unemploymentData';
import { ECONOMIC_PARTICIPATION_DATA } from '../constants/economicParticipationData';
import { ECONOMIC_EMPOWERMENT_DATA } from '../constants/economicEmpowermentData';
import { SOLID_WASTE_DATA } from '../constants/solidWasteData';


interface ChatResponse {
    text: string;
    sources: {
        uri: string;
        title: string;
    }[];
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getChatResponse = async (prompt: string): Promise<ChatResponse> => {
    try {
        const model = "gemini-2.5-flash";
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

        let sources: { uri: string; title: string }[] = [];
        if (groundingMetadata?.groundingChunks) {
            sources = groundingMetadata.groundingChunks
                .map((chunk: any) => {
                    if (chunk.web) {
                        return {
                            uri: chunk.web.uri || '',
                            title: chunk.web.title || '',
                        };
                    }
                    return null;
                })
                .filter((source: any): source is { uri: string; title: string } => source !== null && source.uri !== '');
        }

        return { text, sources };
    } catch (error) {
        console.error("Error getting chat response from Gemini:", error);
        throw new Error("Failed to get response from the AI assistant. Please try again.");
    }
};

export const generateReportSummary = async (topic: string): Promise<string> => {
    try {
        const model = "gemini-2.5-flash";
        const prompt = `Generate a concise report summary in Arabic about the following topic: "${topic}". Focus on key points and provide a professional overview.`;
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating report summary from Gemini:", error);
        throw new Error("Failed to generate the report summary. Please try again.");
    }
};

const analysisSectionSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A concise summary of the analysis for this section." },
        keyPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of key insights or data points." }
    },
    required: ["summary", "keyPoints"]
};

const reportSchema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: {
      type: Type.STRING,
      description: "A concise executive summary of the governorate's development status, in Arabic.",
    },
    swot: {
      type: Type.OBJECT,
      description: "A SWOT analysis in Arabic. Strengths, Weaknesses, Opportunities, and Threats.",
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        threats: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
       required: ["strengths", "weaknesses", "opportunities", "threats"],
    },
    visionAlignment: {
      type: Type.ARRAY,
      description: "Analysis of alignment with Jordan's Vision 2033 targets.",
      items: {
        type: Type.OBJECT,
        properties: {
          indicator: { type: Type.STRING, description: "Name of the indicator in Arabic (e.g., 'معدل البطالة')." },
          currentValue: { type: Type.NUMBER },
          targetValue: { type: Type.NUMBER },
          unit: { type: Type.STRING, description: "The unit of the indicator (e.g., '%')." },
        },
        required: ["indicator", "currentValue", "targetValue", "unit"],
      },
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of actionable recommendations in Arabic.",
    },
    agricultureAnalysis: {
        type: Type.OBJECT,
        description: "An analysis of the agricultural sector in the governorate, in Arabic. Including trends in field crops and fruit trees based on the provided data.",
        properties: {
            summary: { type: Type.STRING, description: "A summary of the agricultural situation and its importance to the governorate." },
            trends: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key observed trends over the past few years for field crops and fruit trees." }
        },
        required: ["summary", "trends"]
    },
    demographicAnalysis: { ...analysisSectionSchema, description: "An analysis of the demographic situation based on population, area, and density for 2024." },
    womensDevelopmentAnalysis: { ...analysisSectionSchema, description: "Analysis of development indicators for women who are heads of households in 2024 and the trend of social security enrollment." },
    economicOpportunitiesAnalysis: { ...analysisSectionSchema, description: "Analysis of loans, employment, and financing from the Development and Employment Fund for 2023-2024." },
    waterSecurityAnalysis: { ...analysisSectionSchema, description: "Analysis of per capita water supply trends from 2020 to 2023." },
    publicSafetyAnalysis: { ...analysisSectionSchema, description: "Analysis of traffic accident statistics for 2024." },
    educationAnalysis: { ...analysisSectionSchema, description: "Analysis of education indicators from 2020-2024, including schools, students, teachers, and key ratios." },
    healthAnalysis: { ...analysisSectionSchema, description: "Analysis of health indicators (2017 vs 2023) and healthcare infrastructure (2020-2024)." },
    livestockAnalysis: { ...analysisSectionSchema, description: "Analysis of livestock (sheep, goats, cows) numbers from 2020-2023." },
    incomeAnalysis: { ...analysisSectionSchema, description: "Analysis of average annual household income and its sources." },
    laborMarketAnalysis: { ...analysisSectionSchema, description: "Analysis of the labor market including unemployment trends (2020-2024) and economic participation (2022-2024)." },
    environmentAnalysis: { ...analysisSectionSchema, description: "Analysis of the environmental situation, focusing on solid waste management (2021-2022)." },
  },
  required: ["executiveSummary", "swot", "visionAlignment", "recommendations", "agricultureAnalysis", "demographicAnalysis", "womensDevelopmentAnalysis", "economicOpportunitiesAnalysis", "waterSecurityAnalysis", "publicSafetyAnalysis", "educationAnalysis", "healthAnalysis", "livestockAnalysis", "incomeAnalysis", "laborMarketAnalysis", "environmentAnalysis"],
};

export const generateGovernorateReport = async (governorateData: GovernorateData): Promise<GeneratedReportData> => {
    try {
        const model = "gemini-2.5-pro";
        const name = governorateData.name;

        // Find all data for the selected governorate
        const agricultureData = AGRICULTURE_DATA.find(g => g.name === name)?.data;
        const populationData = POPULATION_DATA_2024.find(g => g.name === name);
        const womenDevData = WOMEN_DEV_DATA_2024.find(g => g.name === name);
        const economicDevData = ECONOMIC_DEV_DATA.find(g => g.name === name)?.data;
        const waterData = WATER_DATA.find(g => g.name === name)?.data;
        const accidentsData = TRAFFIC_ACCIDENTS_2024.find(g => g.name === name);
        const educationData = EDUCATION_DATA.find(g => g.name === name)?.data;
        const healthIndicatorsData = HEALTH_INDICATORS_DATA.find(g => g.name === name)?.data;
        const healthcareInfraData = HEALTHCARE_INFRASTRUCTURE_DATA.find(g => g.name === name)?.data;
        const livestockData = LIVESTOCK_DATA.find(g => g.name === name)?.data;
        const incomeData = INCOME_DATA.find(g => g.name === name)?.data;
        const unemploymentData = UNEMPLOYMENT_DATA.find(g => g.name === name)?.data;
        const economicParticipationData = ECONOMIC_PARTICIPATION_DATA.find(g => g.name === name)?.data;
        const economicEmpowermentData = ECONOMIC_EMPOWERMENT_DATA.find(g => g.name === name)?.data;
        const solidWasteData = SOLID_WASTE_DATA.find(g => g.name === name)?.data;
        
        const prompt = `
            Please generate a detailed development report for the ${governorateData.name_ar} governorate in Jordan, in Arabic.
            Analyze all the provided data and structure your response as a JSON object according to the provided schema.
            The analysis must be insightful, professional, and cross-reference data where relevant (e.g., link demographics to economic or health data). Ensure all fields in the JSON schema are populated.
            For the SWOT analysis, provide at least 2 points for each category.
            For recommendations, provide at least 3 concrete recommendations.
            The entire response must be in Arabic.

            Contextual Data:
            - General Governorate Data: ${JSON.stringify(governorateData, null, 2)}
            - Jordan Vision 2033 Targets: ${JSON.stringify(JORDAN_VISION_2033_TARGETS, null, 2)}
            ${populationData ? `- 2024 Population Data: ${JSON.stringify(populationData, null, 2)}` : ''}
            ${unemploymentData ? `- Unemployment Rate Data (%): ${JSON.stringify(unemploymentData, null, 2)}` : ''}
            ${economicParticipationData ? `- Economic Participation Rate Data (%): ${JSON.stringify(economicParticipationData, null, 2)}` : ''}
            ${economicEmpowermentData ? `- Social Security Insured Workers Data: ${JSON.stringify(economicEmpowermentData, null, 2)}` : ''}
            ${womenDevData ? `- 2024 Women's Development Data (for female heads of household): ${JSON.stringify(womenDevData, null, 2)}` : ''}
            ${economicDevData ? `- Economic Development Fund Data (Loans, Employment, Financing): ${JSON.stringify(economicDevData, null, 2)}` : ''}
            ${waterData ? `- Per Capita Water Supply Data (m³/year): ${JSON.stringify(waterData, null, 2)}` : ''}
            ${accidentsData ? `- 2024 Traffic Accidents Data: ${JSON.stringify(accidentsData, null, 2)}` : ''}
            ${educationData ? `- Education Data (2020-2024): ${JSON.stringify(educationData, null, 2)}` : ''}
            ${healthIndicatorsData ? `- Health Indicators Data (2017 & 2023): ${JSON.stringify(healthIndicatorsData, null, 2)}` : ''}
            ${healthcareInfraData ? `- Healthcare Infrastructure Data (2020-2024): ${JSON.stringify(healthcareInfraData, null, 2)}` : ''}
            ${livestockData ? `- Livestock Data (Sheep, Goats, Cows counts from 2020-2023): ${JSON.stringify(livestockData, null, 2)}` : ''}
            ${incomeData ? `- Annual Household Income Data (JOD): ${JSON.stringify(incomeData, null, 2)}` : ''}
            ${solidWasteData ? `- Collected Solid Waste Data (tons): ${JSON.stringify(solidWasteData, null, 2)}` : ''}
            ${agricultureData ? `- Agricultural Area Data (dunams): ${JSON.stringify(agricultureData, null, 2)}` : ''}
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: reportSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as GeneratedReportData;
    } catch (error) {
        console.error("Error generating governorate report from Gemini:", error);
        if (error instanceof SyntaxError) {
             throw new Error("Failed to parse the report data from the AI. The format was invalid.");
        }
        throw new Error("Failed to generate the governorate report. Please try again.");
    }
}