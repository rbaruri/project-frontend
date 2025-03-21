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
  progress,
  isReviewMode
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {moduleTitle} - Quiz {isReviewMode ? '(Review)' : ''}
          </h2>
          {!isReviewMode && !isSubmitted && <Timer timeLeft={timeLeft} />}
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          {isReviewMode ? (
            <div className="flex items-center space-x-2">
              <span className={getScoreColor(score, cutoffScore)}>
                Score: {score}% ({Math.round(score * totalQuestions / 100)}/{totalQuestions} questions correct)
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Required Score: {cutoffScore}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">
                  Question {currentQuestion} of {totalQuestions}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">
                  Attempts made: {attempts + 1}
                </span>
              </div>
              {isSubmitted && (
                <div className="flex items-center space-x-2">
                  <span className={getScoreColor(score, cutoffScore)}>
                    Score: {score}%
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {!isReviewMode && !isSubmitted && <ProgressBar progress={progress} />}
      </div>
    </div>
  );
};

export default QuizHeader; 