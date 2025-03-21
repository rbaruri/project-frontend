export const getModalClasses = (isOpen: boolean): string => {
  return `fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ease-in-out ${
    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`;
};

export const getOverlayClasses = (isOpen: boolean): string => {
  return `fixed inset-0 transition-opacity duration-300 ease-in-out ${
    isOpen ? 'opacity-75' : 'opacity-0'
  }`;
};

export const getModalPanelClasses = (isOpen: boolean): string => {
  return `inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all duration-300 ease-out sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 ${
    isOpen 
      ? 'opacity-100 translate-y-0 sm:scale-100' 
      : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
  }`;
}; 