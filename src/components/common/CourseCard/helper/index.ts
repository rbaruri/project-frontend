export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const getProgressBarWidth = (progress: number): string => {
  return `${Math.min(Math.max(progress, 0), 100)}%`;
};

export const validateCourseName = (name: string): boolean => {
  return name.trim().length > 0;
};

export const isCourseStarted = (startDate: string): boolean => {
  const courseStartDate = new Date(startDate);
  const currentDate = new Date();
  return currentDate >= courseStartDate;
}; 