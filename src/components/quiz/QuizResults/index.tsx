import React from 'react';
import { useDispatch } from 'react-redux';
import { QuizResultsProps } from './types';
import { calculateResults } from './helper';
import { TimeExpired, QuestionResult } from './components';
import { generateModuleSummary } from '@/redux/actions/summary';

const QuizResults: React.FC<QuizResultsProps> = ({
  questions,
  userAnswers,
  score,
  cutoffScore,
  onRetake,
  onBackToModule,
  onNextModule,
  hasNextModule,
  timeExpired = false,
  onReview,
  timeTaken,
  moduleId,
  moduleName,
  moduleReports
}) => {
  const dispatch = useDispatch();

  if (timeExpired) {
    return <TimeExpired onRetake={onRetake} />;
  }

  const { correctAnswers, totalQuestions } = calculateResults(questions, userAnswers);
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleViewSummary = () => {
    if (moduleId && moduleReports) {
      dispatch(generateModuleSummary(moduleId, moduleReports));
    }
  };

  const isReviewMode = window.location.search.includes('mode=review');

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
          <div className="mt-2">
            <p className="text-lg">
              {score >= cutoffScore ? (
                <>
                  Congratulations! You've passed the quiz.
                  {hasNextModule && !isReviewMode && (
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
            <p className="text-gray-600 mt-2">
              Time taken: {formatTime(timeTaken)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {/* View Summary button - always show if data is available */}
          {moduleId && moduleReports && (
            <button
              onClick={handleViewSummary}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
            >
              View Summary
            </button>
          )}

          {/* Failed quiz buttons */}
          {score < cutoffScore && !isReviewMode && (
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
          )}

          {/* Passed quiz buttons */}
          {score >= cutoffScore && (
            <>
              {onReview && !timeExpired && !isReviewMode && (
                <button
                  onClick={onReview}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  Review Quiz
                </button>
              )}
              {hasNextModule && !isReviewMode ? (
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
                  {isReviewMode ? 'Back to Course' : 'Complete Module'}
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