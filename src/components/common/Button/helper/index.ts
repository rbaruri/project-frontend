export const getButtonClasses = (className: string = ''): string => {
  return `w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center ${className}`.trim();
}; 