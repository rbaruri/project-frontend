import React from 'react';
import { QuizQuestion, UserAnswers } from '../../types/quiz.types';

interface QuizResultsProps {
  questions: QuizQuestion[];
  userAnswers: UserAnswers;
  score: number;
  cutoffScore: number;
  onRetake: () => void;
  onBackToModule: () => void;
  onNextModule: () => void;
  hasNextModule: boolean;
}

const getAnswerStatus = (question: QuizQuestion, userAnswer: string | undefined): {
  isCorrect: boolean;
  className: string;
} => {
  if (!userAnswer) {
    return { isCorrect: false, className: '' };
  }

  const isCorrect = userAnswer === question.correct_option;
  return {
    isCorrect,
    className: isCorrect 
      ? 'border-green-500 bg-green-50'
      : 'border-red-500 bg-red-50'
  };
};

export const QuizResults: React.FC<QuizResultsProps> = ({
  questions,
  userAnswers,
  score,
  cutoffScore,
  onRetake,
  onBackToModule,
  onNextModule,
  hasNextModule
}) => {
  return (
    <div className="space-y-8">
      {questions.map((question, index) => {
        const answerStatus = getAnswerStatus(question, userAnswers[question.id]);
        
        return (
          <div
            key={question.id}
            className={`bg-white rounded-lg shadow-md p-6 ${answerStatus.className}`}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Question {index + 1}
            </h3>
            <p className="text-gray-700 mb-4">{question.question}</p>
            
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => {
                const isSelected = userAnswers[question.id] === option;
                const isCorrectOption = question.correct_option === option;
                
                let optionClassName = "flex items-center p-3 rounded-lg border transition-colors ";
                
                if (isCorrectOption) {
                  optionClassName += "border-green-500 bg-green-50";
                } else if (isSelected && !isCorrectOption) {
                  optionClassName += "border-red-500 bg-red-50";
                } else {
                  optionClassName += "border-gray-200";
                }

                return (
                  <div
                    key={optionIndex}
                    className={optionClassName}
                  >
                    <span className="ml-3">{option}</span>
                    {isCorrectOption && (
                      <span className="ml-2 text-green-600">
                        (Correct Answer)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4">
              {answerStatus.isCorrect ? (
                <p className="text-green-600">✓ Correct!</p>
              ) : (
                <p className="text-red-600">
                  ✗ Incorrect. The correct answer is: {question.correct_option}
                </p>
              )}
            </div>
          </div>
        );
      })}

      <div className="mt-8">
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold ${score >= cutoffScore ? 'text-green-600' : 'text-red-600'}`}>
            Final Score: {score}%
          </h2>
          <p className="mt-2 text-lg">
            {score >= cutoffScore ? (
              <>
                Congratulations! You've passed the quiz.
                {hasNextModule && (
                  <span className="block mt-1 text-gray-600">
                    You can now proceed to the next module.
                  </span>
                )}
              </>
            ) : (
              <span className="text-red-600">
                You need {cutoffScore}% to pass. Please try again.
              </span>
            )}
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          {score < cutoffScore ? (
            <>
              <button
                onClick={onRetake}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Retake Quiz
              </button>
              <button
                onClick={onBackToModule}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Back to Course
              </button>
            </>
          ) : (
            <>
              {hasNextModule ? (
                <button
                  onClick={onNextModule}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Next Module
                </button>
              ) : (
                <button
                  onClick={onBackToModule}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Complete Module
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResults; 