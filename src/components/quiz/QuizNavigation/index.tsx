import React from 'react';
import { QuizNavigationProps } from './types';
import { NavigationButton, ProgressIndicator } from './components';
import { getButtonClasses, canSubmitQuiz, isLastQuestion } from './helper';

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  currentQuestionIndex,
  totalQuestions,
  answeredQuestions,
  onPrevious,
  onNext,
  onSubmit,
  isReviewMode = false
}) => {
  const isFirst = currentQuestionIndex === 0;
  const isLast = isLastQuestion(currentQuestionIndex, totalQuestions);
  const canSubmit = canSubmitQuiz(answeredQuestions, totalQuestions);

  const buttonClasses = getButtonClasses({
    isFirstQuestion: isFirst,
    canSubmit
  });

  return (
    <div className="flex flex-col space-y-4">
      <ProgressIndicator
        answeredQuestions={answeredQuestions}
        totalQuestions={totalQuestions}
      />

      <div className="flex justify-between items-center">
        <NavigationButton
          onClick={onPrevious}
          disabled={isFirst}
          className={buttonClasses.previousButton}
        >
          Previous
        </NavigationButton>

        {isLast ? (
          <NavigationButton
            onClick={onSubmit}
            disabled={!canSubmit && !isReviewMode}
            className={buttonClasses.submitButton}
          >
            {isReviewMode ? 'Done' : 'Submit Quiz'}
          </NavigationButton>
        ) : (
          <NavigationButton
            onClick={onNext}
            className={buttonClasses.nextButton}
          >
            Next
          </NavigationButton>
        )}
      </div>
    </div>
  );
};

export default QuizNavigation; 