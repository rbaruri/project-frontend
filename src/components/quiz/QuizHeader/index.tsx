import React from 'react';
import { QuizHeaderProps } from './types';
import { Timer, ProgressBar } from './components';
import { getScoreColor } from './helper';

const QuizHeader: React.FC<QuizHeaderProps> = ({
  moduleTitle,
  timeLeft,
  cutoffScore,
  currentQuestion,
  totalQuestions,
  attempts,
  isSubmitted,
  score,
  progress
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {moduleTitle} - Quiz
          </h2>
          <Timer timeLeft={timeLeft} />
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Cutoff Score: {cutoffScore}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">
              Questions: {currentQuestion}/{totalQuestions}
            </span>
          </div>
          {attempts > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">
                Attempts: {attempts + 1}
              </span>
            </div>
          )}
          {isSubmitted && (
            <div className="flex items-center space-x-2">
              <span className={getScoreColor(score, cutoffScore)}>
                Score: {Math.round((score / totalQuestions) * 10)}/10
                <span className="ml-1">({score}%)</span>
              </span>
            </div>
          )}
        </div>

        <ProgressBar progress={progress} />
      </div>
    </div>
  );
};

export default QuizHeader; 