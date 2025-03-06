import { Module } from '../types';

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'Not set';
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    return 'Invalid Date';
  }
};

export const hasResources = (module: Module): boolean => {
  return !!(module.resources && 
    (module.resources.sources.length > 0 || module.resources.similarQuestions.length > 0));
};

export const hasQuizContent = (module: Module): boolean => {
  return !!(module.quiz && module.quiz.length > 0);
}; 