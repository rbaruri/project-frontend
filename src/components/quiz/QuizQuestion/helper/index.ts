export const getOptionClassName = (isSelected: boolean): string => {
  const baseClasses = 'flex items-center p-4 rounded-lg border transition-colors cursor-pointer';
  return `${baseClasses} ${
    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
  }`;
}; 