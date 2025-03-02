import { Location } from 'react-router-dom';

export const getActiveLinkClass = (currentPath: string, linkPath: string): string => {
  const baseClasses = 'px-3 py-2 rounded-md text-sm font-medium';
  return currentPath === linkPath
    ? `${baseClasses} bg-gray-900 text-white`
    : `${baseClasses} text-gray-300 hover:bg-gray-700 hover:text-white`;
};

export const getMobileMenuClasses = (isOpen: boolean): string => {
  const baseClasses = 'md:hidden';
  return isOpen
    ? `${baseClasses} block`
    : `${baseClasses} hidden`;
}; 