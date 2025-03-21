import React from 'react';
import { OptionButtonProps, NavigationButtonsProps } from '../types';
import { getOptionButtonClass, getNavigationButtonClass, getNavigationButtonText, shouldShowPreviousButton } from '../helper';

export const OptionButton: React.FC<OptionButtonProps> = ({ option, isSelected, onSelect }) => (
  <button
    className={getOptionButtonClass(isSelected)}
    onClick={onSelect}
    type="button"
  >
    {option}
  </button>
);

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onFinish
}) => {
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const showPrevious = shouldShowPreviousButton(currentQuestion);

  return (
    <div className="flex justify-between mt-6">
      <button
        type="button"
        onClick={onPrevious}
        className={getNavigationButtonClass(!showPrevious)}
        disabled={!showPrevious}
      >
        Previous
      </button>
      <button
        type="button"
        onClick={isLastQuestion ? onFinish : onNext}
        className={getNavigationButtonClass(false)}
      >
        {getNavigationButtonText(isLastQuestion)}
      </button>
    </div>
  );
}; 