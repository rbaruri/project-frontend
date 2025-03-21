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

export const getProgressBarWidth = (progress: number): string => {
  return `${Math.min(Math.max(progress, 0), 100)}%`;
};

export const validateCourseName = (name: string): boolean => {
  return name.trim().length > 0;
};

export const isCourseStarted = (startDate: string): boolean => {
  // Parse dates in local timezone
  const courseStartDate = new Date(startDate);
  courseStartDate.setHours(0, 0, 0, 0);  // Set to start of day in local time
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);  // Set to start of day in local time

  // Debug logging
  console.log('Date Comparison:', {
    startDate,
    courseStartDate: courseStartDate.toLocaleString(),
    currentDate: now.toLocaleString(),
    isAccessible: now >= courseStartDate
  });

  return now >= courseStartDate;
}; 