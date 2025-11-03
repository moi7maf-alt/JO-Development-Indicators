import { GovernorateData } from './types';

// Population data updated to 2024 estimates
// Static unemployment and participation rates are removed as they are now handled by dedicated time-series data files.
export const GOVERNORATES_DATA: GovernorateData[] = [
  { name: 'Amman', name_ar: 'عمان', population: 4920100, internet_penetration: 88.2, education_index: 0.85 },
  { name: 'Irbid', name_ar: 'إربد', population: 2173200, internet_penetration: 82.1, education_index: 0.81 },
  { name: 'Zarqa', name_ar: 'الزرقاء', population: 1675700, internet_penetration: 80.5, education_index: 0.79 },
  { name: 'Balqa', name_ar: 'البلقاء', population: 603700, internet_penetration: 85.3, education_index: 0.83 },
  { name: 'Mafraq', name_ar: 'المفرق', population: 675200, internet_penetration: 70.1, education_index: 0.72 },
  { name: 'Karak', name_ar: 'الكرك', population: 388700, internet_penetration: 78.4, education_index: 0.78 },
  { name: 'Jarash', name_ar: 'جرش', population: 291000, internet_penetration: 79.9, education_index: 0.80 },
  { name: 'Madaba', name_ar: 'مأدبا', population: 232300, internet_penetration: 77.2, education_index: 0.77 },
  { name: 'Ajloun', name_ar: 'عجلون', population: 216200, internet_penetration: 75.6, education_index: 0.76 },
  { name: 'Aqaba', name_ar: 'العقبة', population: 245200, internet_penetration: 90.1, education_index: 0.84 },
  { name: 'Maan', name_ar: 'معان', population: 194500, internet_penetration: 68.9, education_index: 0.71 },
  { name: 'Tafilah', name_ar: 'الطفيلة', population: 118200, internet_penetration: 72.3, education_index: 0.74 },
];

export const JORDAN_VISION_2033_TARGETS = {
    unemployment_rate: 12.0,
    female_labor_force_participation: 28.0,
};

// Official national averages for 2024
export const NATIONAL_AVERAGES_2024 = {
    unemployment_rate: 21.4,
    female_labor_force_participation: 14.9,
};