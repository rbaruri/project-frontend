import { Module, Quiz, ProgressData } from '../types';

export const formatModuleStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'not_started':
      return 'Not Started';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'not_started':
      return 'bg-gray-100 text-gray-600';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-600';
    case 'completed':
      return 'bg-green-100 text-green-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export const getQuizStatusColor = (status: string): string => {
  switch (status) {
    case "passed":
      return "bg-green-500 hover:bg-green-600";
    case "failed":
      return "bg-red-500 hover:bg-red-600";
    case "in_progress":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "not_attempted":
    default:
      return "bg-green-500 hover:bg-green-600";
  }
};

export const getProgressBarColor = (percentage: number): string => {
  if (percentage <= 30) {
    return "bg-red-500";
  } else if (percentage <= 50) {
    return "bg-yellow-500";
  } else if (percentage <= 75) {
    return "bg-blue-500";
  } else if (percentage < 100) {
    return "bg-indigo-500";
  } else {
    return "bg-green-500";
  }
};

export const getProgressTextColor = (percentage: number): string => {
  if (percentage <= 30) {
    return "text-red-600";
  } else if (percentage <= 50) {
    return "text-yellow-600";
  } else if (percentage <= 75) {
    return "text-blue-600";
  } else if (percentage < 100) {
    return "text-indigo-600";
  } else {
    return "text-green-600";
  }
};

export const calculateProgress = (modules: Module[]): ProgressData => {
  if (!modules?.length) {
    return {
      completedCount: 0,
      totalCount: 0,
      progressPercentage: 0,
    };
  }

  const totalModules = modules.length;
  const completedModules = modules.filter((m) => m.status === "completed").length;

  return {
    completedCount: completedModules,
    totalCount: totalModules,
    progressPercentage: Math.round((completedModules / totalModules) * 100),
  };
};

export const isModuleLocked = (moduleIndex: number, modules: Module[]): boolean => {
  if (moduleIndex === 0) return false;

  const previousModule = modules[moduleIndex - 1];
  const previousQuiz = previousModule?.quizzes?.[0];

  return !previousQuiz || previousQuiz.status !== "passed";
};

export const getQuizButtonText = (quiz: Quiz, isLocked: boolean): string => {
  if (isLocked) return "Locked";

  switch (quiz.status) {
    case "passed":
      return "Review Quiz";
    case "failed":
      return "Retry Quiz";
    case "not_attempted":
    default:
      return "Take Quiz";
  }
}; 