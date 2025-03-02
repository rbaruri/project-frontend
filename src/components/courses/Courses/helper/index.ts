import { Course, Module } from '../types';

export const calculateCourseProgress = (modules: Module[]): number => {
  if (!modules || modules.length === 0) return 0;
  const completedModules = modules.filter(module => module.status === 'completed').length;
  return Math.round((completedModules / modules.length) * 100);
};

export const calculateDurationBetweenDates = (startDate: Date, endDate: Date): { value: number; unit: 'days' | 'weeks' } => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return { value: diffDays, unit: 'days' };
  }
  
  return { value: Math.ceil(diffDays / 7), unit: 'weeks' };
};

export const calculateTotalHours = (generatedPath: any): number => {
  if (!generatedPath || !generatedPath.topics) return 0;
  return generatedPath.topics.reduce((total: number, topic: any) => {
    return total + (topic.estimated_hours || 0);
  }, 0);
};

export const calculateHoursPerWeek = (totalHours: number, duration: { value: number; unit: 'days' | 'weeks' }): number => {
  if (duration.value === 0) return 0;
  if (duration.unit === 'days') {
    return Math.round((totalHours / duration.value) * 7); // Convert to weekly hours
  }
  return Math.round(totalHours / duration.value);
}; 