import React from 'react';
import { QuizQuestion as QuizQuestionType } from '../../types/quiz.types';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  selectedAnswer?: string;
  onAnswerSelect: (questionId: string, answer: string) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerSelect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Question {questionNumber}
      </h3>
      <p className="text-gray-700 mb-6">{question.question}</p>
      
      <div className="space-y-3">
        {question.options.map((option, optionIndex) => {
          const isSelected = selectedAnswer === option;
          
          return (
            <label
              key={optionIndex}
              className={`flex items-center p-4 rounded-lg border transition-colors cursor-pointer ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={isSelected}
                onChange={() => onAnswerSelect(question.id, option)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default QuizQuestion; 