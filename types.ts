

export interface GovernorateData {
  name: string; // English name for keys
  name_ar: string; // Arabic name for display
  population: number;
  // DEPRECATED: unemployment_rate: number;
  // DEPRECATED: female_labor_force_participation: number;
  internet_penetration: number;
  education_index: number; 
  // Education
  student_teacher_ratio?: number;
  student_classroom_ratio?: number;
  // Health Indicators
  infant_mortality_rate?: number;
  under_five_mortality_rate?: number;
  adolescent_fertility_rate?: number;
  // Livestock Indicators
  total_livestock?: number;
  sheep?: number;
  goats?: number;
  cows?: number;
  // Income Indicators
  average_total_income?: number;
  income_from_employment?: number;
  // New indicators for map
  unemployment_rate_2024?: number;
  economic_participation_2024?: number;
  social_security_female_ratio_2024?: number;
  waste_per_capita_2022?: number; // in kg/person/year
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: {
    uri: string;
    title: string;
  }[];
}

export interface Indicator {
  // FIX: Removed 'internet_penetration' and 'education_index' from Omit to allow them as valid indicator keys.
  key: keyof Omit<GovernorateData, 'name' | 'name_ar' | 'population'>;
  name: string;
  unit: string;
  direction: 'lower-is-better' | 'higher-is-better';
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface VisionAlignment {
  indicator: string;
  currentValue: number;
  targetValue: number;
  unit: string;
}

export interface AgricultureAnalysis {
  summary: string;
  trends: string[];
}

export interface GeneratedReportData {
  executiveSummary: string;
  swot: SWOTAnalysis;
  visionAlignment: VisionAlignment[];
  recommendations: string[];
  agricultureAnalysis: AgricultureAnalysis;
  demographicAnalysis?: { summary: string; keyPoints: string[] };
  womensDevelopmentAnalysis?: { summary: string; keyPoints: string[] };
  economicOpportunitiesAnalysis?: { summary: string; keyPoints: string[] };
  waterSecurityAnalysis?: { summary: string; keyPoints: string[] };
  publicSafetyAnalysis?: { summary: string; keyPoints: string[] };
  educationAnalysis?: { summary: string; keyPoints: string[] };
  healthAnalysis?: { summary: string; keyPoints: string[] };
  livestockAnalysis?: { summary: string; keyPoints: string[] };
  incomeAnalysis?: { summary: string; keyPoints: string[] };
  // New analysis sections
  laborMarketAnalysis?: { summary: string; keyPoints: string[] };
  environmentAnalysis?: { summary: string; keyPoints: string[] };
}

export interface AgricultureDataPoint {
  year: number;
  fieldCrops: number;
  fruitTrees: number;
}

export interface GovernorateAgricultureData {
  name: string; // English name
  name_ar: string;
  data: AgricultureDataPoint[];
}


// Newly Added Data Types
export interface PopulationData {
  name: string; // English name
  name_ar: string;
  population: number;
  area: number;
  density: number;
}

export interface WomenDevData {
    name: string; // English name
    name_ar: string;
    economic_activity_rate_fhh: number; // FHH = Female Head of Household
    refined_economic_participation_rate_fhh: number;
    unemployment_rate_fhh: number;
    illiteracy_rate_fhh: number;
}

export interface EconomicDevDataPoint {
    year: number;
    loans_count: number;
    employment_opportunities: number;
    financing_volume: number;
}

export interface GovernorateEconomicDevData {
    name: string; // English name
    name_ar: string;
    data: EconomicDevDataPoint[];
}

export interface WaterDataPoint {
    year: number;
    per_capita_supply: number;
}

export interface GovernorateWaterData {
    name: string; // English name
    name_ar: string;
    data: WaterDataPoint[];
}

export interface TrafficAccidentsData {
    name: string; // English name
    name_ar: string;
    total: number;
    collision: number;
    run_over: number;
    rollover: number;
}

export interface EducationDataPoint {
    year: number;
    schools: number;
    rented_schools: number;
    two_shift_schools: number;
    students: number;
    teachers: number;
    student_teacher_ratio: number;
    student_classroom_ratio: number;
}

export interface GovernorateEducationData {
    name: string; // English name
    name_ar: string;
    data: EducationDataPoint[];
}

// Health Data Types
export interface HealthIndicatorSet {
    infant_mortality_rate: number; // per 1000
    under_five_mortality_rate: number; // per 1000
    family_planning_usage_rate: number; // %
    skilled_birth_attendance_rate: number; // %
    total_fertility_rate: number;
    adolescent_fertility_rate: number; // per 1000
    child_immunization_rate: number; // %
}

export interface GovernorateHealthIndicatorData {
    name: string; // English name
    name_ar: string;
    data: {
        '2017': HealthIndicatorSet;
        '2023': HealthIndicatorSet;
    }
}

export interface HealthcareInfrastructureDataPoint {
    year: number;
    hospital_beds_moh: number;
    hospitals_other_gov: number;
    health_centers: number;
}

export interface GovernorateHealthcareInfrastructureData {
    name: string; // English name
    name_ar: string;
    data: HealthcareInfrastructureDataPoint[];
}

// Livestock Data Types
export interface LivestockDataPoint {
    year: number;
    sheep: number;
    goats: number;
    cows: number;
}

export interface GovernorateLivestockData {
    name: string; // English name
    name_ar: string;
    data: LivestockDataPoint[];
}

// Income Data Types
export interface IncomeDataPoint {
  average_total_income: number;
  transactions_incomes: number;
  property_incomes: number;
  rentals_incomes: number;
  private_work_incomes: number;
  employment_incomes: number;
}

export interface GovernorateIncomeData {
  name: string; // English name
  name_ar: string;
  data: IncomeDataPoint;
}

// Labor Market Data Types
export interface UnemploymentDataPoint {
    year: number;
    rate: number;
}
export interface GovernorateUnemploymentData {
    name: string;
    name_ar: string;
    data: UnemploymentDataPoint[];
}

export interface EconomicParticipationDataPoint {
    year: number;
    rate: number;
}
export interface GovernorateEconomicParticipationData {
    name: string;
    name_ar: string;
    data: EconomicParticipationDataPoint[];
}

export interface EconomicEmpowermentDataPoint {
    year: number;
    female_insured: number;
    male_insured: number;
}
export interface GovernorateEconomicEmpowermentData {
    name: string;
    name_ar: string;
    data: EconomicEmpowermentDataPoint[];
}

// Environment Data Types
export interface SolidWasteDataPoint {
    year: number;
    quantity_tons: number;
}
export interface GovernorateSolidWasteData {
    name: string;
    name_ar: string;
    data: SolidWasteDataPoint[];
}
