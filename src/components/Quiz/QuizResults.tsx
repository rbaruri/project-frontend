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
  timeExpired?: boolean;
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
  hasNextModule,
  timeExpired
}) => {
  const isPassed = score >= cutoffScore;

  return (
    <div className="space-y-8">
      {timeExpired ? (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Uh Oh! Time's Up!</h2>
          <p className="text-gray-600 text-lg mb-6">
            Don't worry, you can try again. Take your time to review the questions carefully.
          </p>
          <button
            onClick={onRetake}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
          >
            Retake Quiz
          </button>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'} mb-4`}>
              {isPassed ? 'Congratulations!' : 'Almost There!'}
            </h2>
            <p className="text-gray-600 text-lg mb-2">
              You scored {score}% {isPassed ? '- You passed!' : '- Keep trying!'}
            </p>
            <p className="text-gray-500">
              Required score to pass: {cutoffScore}%
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {questions.map((question, index) => {
              const answerStatus = getAnswerStatus(question, userAnswers[question.id]);
              
              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg bg-gray-50 ${answerStatus.className}`}
                >
                  <p className="font-medium text-gray-800 mb-2">
                    Question {index + 1}: {question.question}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Your answer: {userAnswers[question.id] || 'Not answered'}
                  </p>
                  <p className={`text-sm ${userAnswers[question.id] === question.correct_option ? 'text-green-600' : 'text-red-600'}`}>
                    Correct answer: {question.correct_option}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center space-x-4">
            {!isPassed && (
              <button
                onClick={onRetake}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Try Again
              </button>
            )}
            {isPassed && hasNextModule && (
              <button
                onClick={onNextModule}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
              >
                Next Module
              </button>
            )}
            <button
              onClick={onBackToModule}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
            >
              Back to Module
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizResults; 