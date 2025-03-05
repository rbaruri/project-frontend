import { Course, Module } from '@/types/courseTypes';

export interface ProgressStatus {
  status: 'ahead' | 'on_track' | 'behind';
  daysOffset: number;
  completedModules: number;
  expectedModules: number;
}

export const isInProgress = (course: Course): boolean => {
  if (!course.modules || course.modules.length === 0) return false;

  // First check if all modules are completed - if so, return false
  const allModulesCompleted = course.modules.every((m: Module) => m.status === 'completed');
  if (allModulesCompleted) return false;

  const hasInProgressModules = course.modules.some((m: Module) => m.status === 'in_progress');
  const completedCount = course.modules.filter((m: Module) => m.status === 'completed').length;
  const notStartedCount = course.modules.filter((m: Module) => m.status === 'not_started').length;
  const totalModules = course.modules.length;

  // Include courses that:
  // 1. Have modules in progress OR
  // 2. Have some completed modules but not all OR
  // 3. Have all modules not started (newly uploaded courses)
  return hasInProgressModules || 
         (completedCount > 0 && completedCount < totalModules) || 
         (notStartedCount === totalModules);
};

export const calculateOverallProgress = (courses: Course[]): number => {
  if (!courses || courses.length === 0) return 0;
  
  const totalProgress = courses.reduce((acc: number, course: Course) => {
    const completedModules = course.modules.filter((module: Module) => module.status === 'completed').length;
    const totalModules = course.modules.length;
    return acc + (completedModules / totalModules) * 100;
  }, 0);
  
  return Math.round(totalProgress / courses.length);
};

export const getCompletedCoursesCount = (courses: Course[]): number => {
  if (!courses) return 0;
  return courses.filter(course => 
    course.modules.every((module: Module) => module.status === 'completed')
  ).length;
};

export const getCoursesInProgressCount = (courses: Course[]): number => {
  if (!courses) return 0;
  return courses.filter(course => isInProgress(course)).length;
};

export const calculateProgressStatus = (course: Course): ProgressStatus => {
  if (!course.modules || course.modules.length === 0) {
    return {
      status: 'on_track',
      daysOffset: 0,
      completedModules: 0,
      expectedModules: 0
    };
  }

  const today = new Date();
  const startDate = new Date(course.start_date);
  const endDate = new Date(course.end_date);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate expected progress based on time elapsed
  const progressRatio = Math.min(Math.max(daysPassed / totalDays, 0), 1);
  const expectedModules = Math.ceil(course.modules.length * progressRatio);
  
  // Count completed modules
  const completedModules = course.modules.filter(
    (module: Module) => module.status === 'completed'
  ).length;

  // Calculate days ahead/behind
  const expectedCompletionDate = new Date(startDate);
  expectedCompletionDate.setDate(startDate.getDate() + Math.ceil(completedModules * totalDays / course.modules.length));
  const daysOffset = Math.ceil((expectedCompletionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Determine status
  let status: 'ahead' | 'on_track' | 'behind';
  if (completedModules > expectedModules) {
    status = 'ahead';
  } else if (completedModules < expectedModules) {
    status = 'behind';
  } else {
    status = 'on_track';
  }

  return {
    status,
    daysOffset: Math.abs(daysOffset),
    completedModules,
    expectedModules
  };
};

export const getProgressStatusColor = (status: ProgressStatus['status']): string => {
  switch (status) {
    case 'ahead':
      return 'text-green-600';
    case 'behind':
      return 'text-red-600';
    case 'on_track':
    default:
      return 'text-blue-600';
  }
};

export const getProgressStatusText = (status: ProgressStatus): string => {
  const { status: progressStatus, daysOffset } = status;
  switch (progressStatus) {
    case 'ahead':
      return `${daysOffset} day${daysOffset !== 1 ? 's' : ''} ahead of schedule`;
    case 'behind':
      return `${daysOffset} day${daysOffset !== 1 ? 's' : ''} behind schedule`;
    case 'on_track':
    default:
      return 'On track';
  }
};