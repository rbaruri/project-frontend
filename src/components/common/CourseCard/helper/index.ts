export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const getProgressBarWidth = (progress: number): string => {
  return `${Math.min(Math.max(progress, 0), 100)}%`;
};

export const validateCourseName = (name: string): boolean => {
  return name.trim().length > 0;
}; 