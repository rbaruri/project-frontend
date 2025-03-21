import React from 'react';

interface NavigationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className: string;
  children: React.ReactNode;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  onClick,
  disabled = false,
  className,
  children
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={className}
  >
    {children}
  </button>
);

interface ProgressIndicatorProps {
  answeredQuestions: number;
  totalQuestions: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  answeredQuestions,
  totalQuestions
}) => (
  <div className="text-sm text-gray-600">
    {answeredQuestions} of {totalQuestions} questions answered
  </div>
); 