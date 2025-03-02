import { Course, Module } from '@/types/courseTypes';

export const isInProgress = (course: Course): boolean => {
  if (!course.modules || course.modules.length === 0) return false;

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