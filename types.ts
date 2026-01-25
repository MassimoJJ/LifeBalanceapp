
export type LanguageCode = 'en' | 'es' | 'fr' | 'ar' | 'fa' | 'de';
export type Gender = 'male' | 'female';

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  unit: string;
}

export interface LoggedFood {
  itemId: string;
  name: string;
  quantity: number;
  totalCalories: number;
}

export interface LoggedActivity {
  activityId: string;
  name: string;
  quantity: number;
  unit: 'min' | 'set';
  totalBurn: number;
}

export interface DailyLog {
  id: string;
  timestamp: string;
  // Physiological Profile
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  
  foodCalories: number;
  loggedFoods: LoggedFood[];
  loggedActivities: LoggedActivity[];
  activityMinutes: number; 
  workHours: number;
  sleepHours: number;
  sleepQuality: number; 
  aiOptimizationTip?: string;
  language?: LanguageCode;
}

export interface SummaryResult {
  totalIntake: number;
  bmr: number;
  activityBurn: number;
  workBurn: number;
  totalBurn: number;
  netResult: number;
  status: 'Deficit' | 'Surplus' | 'Balanced';
  colorClass: string;
}
