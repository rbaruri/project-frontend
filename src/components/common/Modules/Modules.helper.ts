import { Module } from './Modules.types';

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const hasResources = (module: Module): boolean => {
  return !!(module.resources && 
    (module.resources.sources.length > 0 || module.resources.similarQuestions.length > 0));
};

export const hasQuizContent = (module: Module): boolean => {
  return !!(module.quiz && module.quiz.length > 0);
}; 