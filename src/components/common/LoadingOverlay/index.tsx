import React from 'react';
import { LoadingOverlayProps } from './types';
import { getOverlayClasses, getSpinnerClasses } from './helper';

const LoadingOverlay: React.FC<LoadingOverlayProps> = () => {
  return (
    <div className={getOverlayClasses()} aria-hidden="true">
      <div className="bg-white rounded-lg p-8">
        <div className={getSpinnerClasses()}></div>
      </div>
    </div>
  );
};

export default LoadingOverlay; 