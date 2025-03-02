export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getProgressBarWidth = (progress: number): string => {
  return `${Math.min(Math.max(progress, 0), 100)}%`;
};

export const getProgressBarColor = (progress: number): string => {
  if (progress < 30) return 'bg-red-500';
  if (progress < 70) return 'bg-yellow-500';
  return 'bg-green-500';
};

export const getScoreColor = (score: number, cutoffScore: number): string => {
  return score >= cutoffScore ? 'text-green-600' : 'text-red-600';
}; 