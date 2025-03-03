import React from 'react';
import { QuizQuestionProps } from './types';
import { getOptionClassName } from './helper';

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerSelect,
  isReviewMode = false,
  correctOption
}) => {
  const getAnswerStatusClass = (option: string) => {
    if (!isReviewMode) return '';
    
    if (option === correctOption) {
      return 'bg-green-100 border-green-500';
    }
    if (option === selectedAnswer && option !== correctOption) {
      return 'bg-red-100 border-red-500';
    }
    return '';
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">
          Question {questionNumber}
        </h3>
        <p className="mt-2 text-gray-600">{question.question}</p>
      </div>

      <div className="space-y-2">
        {question.options.map((option) => (
          <label
            key={option}
            className={`flex items-center p-3 border rounded-lg transition-colors ${
              getOptionClassName(selectedAnswer === option)
            } ${isReviewMode ? 'cursor-not-allowed' : ''} ${
              getAnswerStatusClass(option)
            }`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option}
              checked={selectedAnswer === option}
              onChange={() => !isReviewMode && onAnswerSelect(question.id, option)}
              disabled={isReviewMode}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-3 flex-grow">{option}</span>
            {isReviewMode && (
              <div className="flex items-center">
                {option === correctOption && (
                  <span className="text-green-600 text-sm ml-2">
                    ✓ Correct Answer
                  </span>
                )}
                {option === selectedAnswer && option !== correctOption && (
                  <span className="text-red-600 text-sm ml-2">
                    ✗ Your Answer
                  </span>
                )}
              </div>
            )}
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion; 