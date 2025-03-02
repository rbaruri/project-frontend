import React from 'react';
import { QuizQuestion } from '../types';
import { getAnswerStatus, getOptionClassName } from '../helper';

interface TimeExpiredProps {
  onRetake: () => void;
}

export const TimeExpired: React.FC<TimeExpiredProps> = ({ onRetake }) => (
  <div className="text-center space-y-6">
    <h2 className="text-3xl font-bold text-red-600">Uh Oh! Time's Up!</h2>
    <p className="text-gray-600 text-lg">
      Don't worry, you can try again. Take your time to review the questions carefully.
    </p>
    <button
      onClick={onRetake}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
    >
      Retake Quiz
    </button>
  </div>
);

interface QuestionResultProps {
  question: QuizQuestion;
  userAnswer: string | undefined;
  index: number;
}

export const QuestionResult: React.FC<QuestionResultProps> = ({ question, userAnswer, index }) => {
  const answerStatus = getAnswerStatus(question, userAnswer);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${answerStatus.className}`}>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Question {index + 1}
      </h3>
      <p className="text-gray-700 mb-4">{question.question}</p>
      
      <div className="space-y-2">
        {question.options.map((option, optionIndex) => {
          const isSelected = userAnswer === option;
          const isCorrectOption = question.correct_option === option;
          
          return (
            <div
              key={optionIndex}
              className={getOptionClassName(isSelected, isCorrectOption)}
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
}; 