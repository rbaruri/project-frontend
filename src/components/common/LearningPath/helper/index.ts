export const getGradientClass = (index: number): string => {
  const gradients = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-cyan-500 to-cyan-600',
    'from-teal-500 to-teal-600'
  ];
  return gradients[index % gradients.length];
};

export const getProgressBarWidth = (progress: number): string => {
  return `${progress}%`;
}; 