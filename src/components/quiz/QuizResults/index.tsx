import React from 'react';
import { QuizResultsProps } from './types';
import { calculateResults } from './helper';
import { TimeExpired, QuestionResult } from './components';

const QuizResults: React.FC<QuizResultsProps> = ({
  questions,
  userAnswers,
  score,
  cutoffScore,
  onRetake,
  onBackToModule,
  onNextModule,
  hasNextModule,
  timeExpired = false
}) => {
  if (timeExpired) {
    return <TimeExpired onRetake={onRetake} />;
  }

  const { correctAnswers, totalQuestions } = calculateResults(questions, userAnswers);

  return (
    <div className="space-y-8">
      {questions.map((question, index) => (
        <QuestionResult
          key={question.id}
          question={question}
          userAnswer={userAnswers[question.id]}
          index={index}
        />
      ))}

      <div className="mt-8">
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold ${score >= cutoffScore ? 'text-green-600' : 'text-red-600'}`}>
            Final Score: {correctAnswers}/{totalQuestions} ({score}%)
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
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Retake Quiz
              </button>
              <button
                onClick={onBackToModule}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-300"
              >
                Back to Course
              </button>
            </>
          ) : (
            <>
              {hasNextModule ? (
                <button
                  onClick={onNextModule}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
                >
                  Next Module
                </button>
              ) : (
                <button
                  onClick={onBackToModule}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
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