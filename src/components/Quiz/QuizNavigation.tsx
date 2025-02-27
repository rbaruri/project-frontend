import React from 'react';

interface QuizNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const QuizNavigation: React.FC<QuizNavigationProps> = ({
  currentQuestionIndex,
  totalQuestions,
  answeredQuestions,
  onPrevious,
  onNext,
  onSubmit
}) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const canSubmit = answeredQuestions === totalQuestions;

  return (
    <div className="mt-8 flex justify-between">
      <button
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        className={`px-4 py-2 rounded-md ${
          currentQuestionIndex === 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gray-600 text-white hover:bg-gray-700'
        }`}
      >
        Previous
      </button>
      
      {isLastQuestion ? (
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className={`px-6 py-2 rounded-md text-white font-medium ${
            canSubmit
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Submit Quiz
        </button>
      ) : (
        <button
          onClick={onNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default QuizNavigation; 