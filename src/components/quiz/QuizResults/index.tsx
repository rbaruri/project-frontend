import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { QuizResultsProps } from './types';
import { calculateResults } from './helper';
import { TimeExpired, QuestionResult } from './components';
import {
  generateSummary,
  selectSummaryLoading,
  selectSummaryAnalysis,
  selectSummaryError,
  SummaryActionTypes
} from '@/containers/SummaryReport/summaryIndex';
import { GET_USER_MODULE_DATA } from '@/graphql/queries/summary';
import { RootState } from '@/redux/store';
import { StructuredAnalysis } from '@/summary/types';
import { Dispatch } from 'redux';
import { formatElapsedTime } from '@/components/quiz/SummaryReport/helper';

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
  moduleReports,
  quizId
}) => {
  const dispatch = useDispatch<Dispatch<SummaryActionTypes>>();
  const navigate = useNavigate();

  // Fetch user and module data
  const { data: moduleData, loading: moduleLoading, error: moduleError } = useQuery(GET_USER_MODULE_DATA, {
    variables: { moduleId },
    skip: !moduleId
  });

  if (timeExpired) {
    return <TimeExpired onRetake={onRetake} />;
  }

  const { correctAnswers, totalQuestions } = calculateResults(questions, userAnswers);
  
  const handleViewSummary = () => {
    if (moduleId && moduleReports && moduleData?.modules_by_pk) {
      const userId = moduleData.modules_by_pk.course.user_id;
      if (userId) {
        console.log('Generating summary with:', {
          moduleId,
          userId,
          hasModuleReports: !!moduleReports
        });
        dispatch(generateSummary(moduleId, moduleReports, userId));
        // Navigate to the summary page with quizId in the query params
        navigate(`/quiz-summary/${moduleId}?quizId=${quizId}`);
      } else {
        console.error('User ID not found in module data');
      }
    } else {
      console.error('Missing required data:', {
        hasModuleId: !!moduleId,
        hasModuleReports: !!moduleReports,
        hasModuleData: !!moduleData?.modules_by_pk
      });
    }
  };

  const isReviewMode = window.location.search.includes('mode=review');

  if (moduleLoading) {
    return <div>Loading module data...</div>;
  }

  if (moduleError) {
    return <div>Error loading module data: {moduleError.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Quiz Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-lg font-medium text-gray-600">Score</p>
            <p className="text-3xl font-bold text-gray-800">{score}%</p>
            <p className="text-sm text-gray-500">
              {correctAnswers} out of {totalQuestions} correct
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-lg font-medium text-gray-600">Time Taken</p>
            <p className="text-3xl font-bold text-gray-800">{formatElapsedTime(timeTaken)}</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {/* View Summary button - only show if data is available and score is below cutoff */}
          {moduleId && moduleReports && score < cutoffScore && (
            <button
              onClick={handleViewSummary}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-300"
            >
              Generate Summary
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
          {(score >= cutoffScore || isReviewMode) && (
            <>
              <button
                onClick={onReview}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Review Quiz
              </button>
              <button
                onClick={hasNextModule ? onNextModule : onBackToModule}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
              >
                {hasNextModule ? "Next Module" : "Complete Module"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuestionResult
            key={question.id}
            question={question}
            userAnswer={userAnswers[question.id]}
            questionNumber={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default QuizResults; 