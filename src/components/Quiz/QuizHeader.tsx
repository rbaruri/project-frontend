import React from 'react';
import { formatTime } from '@/helper/quizHelper';

interface QuizHeaderProps {
  moduleTitle: string;
  timeLeft: number;
  cutoffScore: number;
  currentQuestion: number;
  totalQuestions: number;
  attempts: number;
  isSubmitted: boolean;
  score: number;
  progress: number;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
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
  // Calculate actual marks based on percentage
  const scoreMarks = Math.round((score / 100) * totalQuestions);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          {moduleTitle} - Quiz
        </h1>
        <div className="text-xl font-semibold text-blue-600">
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="space-x-4">
            <span>Cutoff Score: {cutoffScore}%</span>
            <span>Questions: {currentQuestion}/{totalQuestions}</span>
            {attempts > 0 && <span>Attempts: {attempts + 1}</span>}
          </div>
          {isSubmitted && (
            <div className={`font-bold ${score >= cutoffScore ? 'text-green-600' : 'text-red-600'}`}>
              <span className="mr-2">Score: {scoreMarks}/{totalQuestions}</span>
              <span>({score}%)</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizHeader; 