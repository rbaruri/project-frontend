import React from 'react';
import { QuizQuestionProps } from './types';
import { getOptionClassName } from './helper';

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerSelect,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">
          Question {questionNumber}
        </h3>
        <p className="mt-2 text-gray-600">{question.question}</p>
      </div>

      <div className="space-y-3">
        {question.options.map((option) => (
          <label
            key={option}
            className={getOptionClassName(selectedAnswer === option)}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option}
              checked={selectedAnswer === option}
              onChange={() => onAnswerSelect(question.id, option)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-3">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion; 