
import { DailyLog, SummaryResult } from '../types';
import { 
  WORK_CALORIES_PER_HOUR, 
  BALANCE_THRESHOLD 
} from '../constants';

/**
 * Mifflin-St Jeor Equation for BMR
 */
export const calculateBMR = (log: DailyLog): number => {
  const { weight, height, age, gender } = log;
  // Men: BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5
  // Women: BMR = (10 × weight) + (6.25 × height) - (5 × age) - 161
  const base = (10 * weight) + (6.25 * height) - (5 * age);
  return gender === 'male' ? base + 5 : base - 161;
};

export const calculateDailySummary = (log: DailyLog): SummaryResult => {
  const bmr = calculateBMR(log);
  
  // Sum up calories from specific activities
  const activityBurn = (log.loggedActivities || []).reduce((sum, act) => sum + act.totalBurn, 0);
  
  const workBurn = log.workHours * WORK_CALORIES_PER_HOUR;
  const totalBurn = bmr + activityBurn + workBurn;
  const netResult = log.foodCalories - totalBurn;

  let status: 'Deficit' | 'Surplus' | 'Balanced' = 'Balanced';
  let colorClass = 'bg-green-500';

  if (netResult > BALANCE_THRESHOLD) {
    status = 'Surplus';
    colorClass = 'bg-orange-500';
  } else if (netResult < -BALANCE_THRESHOLD) {
    status = 'Deficit';
    colorClass = 'bg-blue-500';
  }

  return {
    totalIntake: log.foodCalories,
    bmr,
    activityBurn,
    workBurn,
    totalBurn,
    netResult,
    status,
    colorClass
  };
};
