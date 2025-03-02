export const getInitial = (name: string): string => {
  return name ? name.charAt(0).toUpperCase() : '';
};

export const getSkeletonClasses = {
  container: 'bg-white rounded-lg shadow p-6 border border-gray-100',
  title: 'text-xl font-semibold text-gray-800 mb-4',
  skeletonWrapper: 'animate-pulse space-y-4',
  avatarSkeleton: 'bg-gray-200 p-4 rounded-full w-12 h-12',
  nameSkeleton: 'h-4 bg-gray-200 rounded w-24',
  emailSkeleton: 'h-3 bg-gray-200 rounded w-32',
  buttonSkeleton: 'h-8 bg-gray-200 rounded w-32',
}; 