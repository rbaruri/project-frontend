export const getOptionButtonClass = (isSelected: boolean): string => {
  const baseClasses = 'w-full p-4 text-left rounded-lg border transition-all duration-200';
  return `${baseClasses} ${
    isSelected
      ? 'border-blue-500 bg-blue-50 text-blue-700'
      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
  }`;
};

export const getNavigationButtonText = (isLastQuestion: boolean): string => {
  return isLastQuestion ? "Finish" : "Next";
};

export const shouldShowPreviousButton = (currentQuestion: number): boolean => {
  return currentQuestion > 0;
};

export const getNavigationButtonClass = (isDisabled: boolean): string => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors duration-200';
  return `${baseClasses} ${
    isDisabled
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
      : 'bg-blue-600 text-white hover:bg-blue-700'
  }`;
}; 