import React, { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_QUIZ_WITH_QUESTIONS, GET_NEXT_MODULE } from '@/graphql/queries/quiz';
// import { UPDATE_QUIZ_STATUS, UPDATE_MODULE_STATUS } from '@/graphql/mutations/quiz';
import { QuizData, NextModuleData } from '@/components/quiz/types';
import QuizQuestion from '@/components/quiz/QuizQuestion';
import QuizResults from '@/components/quiz/QuizResults';
import QuizHeader from '@/components/quiz/QuizHeader';
import QuizNavigation from '@/components/quiz/QuizNavigation';
import TimeoutModal from '@/components/quiz/TimeoutModal';
import useQuizState from '@/hooks/useQuizState';
import { useQuizStorage } from '@/hooks/useQuizStorage';
import ConfirmDialog from '@/components/common/ConfirmDialog';

const Quiz: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode');
  const isReviewMode = mode === 'review';
  const isResultsMode = mode === 'results';
  const shouldShowResults = searchParams.get('showResults') === 'true';

  const { loading, error, data, refetch } = useQuery<QuizData>(GET_QUIZ_WITH_QUESTIONS, {
    variables: { quizId },
    skip: !quizId,
  });

  // const [updateQuizStatus] = useMutation(UPDATE_QUIZ_STATUS);
  // const [updateModuleStatus] = useMutation(UPDATE_MODULE_STATUS);

  const { state, actions } = useQuizState({
    quizId: quizId || '',
    refetch,
    initialReviewMode: isReviewMode,
    initialShowResults: shouldShowResults || isResultsMode
  });

  const storage = useQuizStorage(quizId);

  const { data: nextModuleData } = useQuery<NextModuleData>(GET_NEXT_MODULE, {
    variables: {
      courseId: data?.quizzes_by_pk.module.course_id,
      currentModuleId: data?.quizzes_by_pk.module.id
    },
    skip: !data?.quizzes_by_pk?.module?.course_id || !data?.quizzes_by_pk?.module?.id
  });

  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const handleAnswerSelect = useCallback((questionId: string, selectedOption: string) => {
    actions.handleAnswerSelect(questionId, selectedOption);
    storage.saveAnswersToLocalStorage({
      ...state.userAnswers,
      [questionId]: selectedOption
    });
  }, [actions.handleAnswerSelect, storage.saveAnswersToLocalStorage, state.userAnswers]);

  const handleBackToModule = useCallback(() => {
    if (data?.quizzes_by_pk?.module?.course_id) {
      navigate(`/courses/${data.quizzes_by_pk.module.course_id}`);
    } else {
      navigate('/courses');
    }
  }, [data?.quizzes_by_pk?.module?.course_id, navigate]);

  const handleNextModule = useCallback(() => {
    // Clear local storage regardless of quiz score
    if (quizId) {
      // Clear timer data
      localStorage.removeItem(`quiz_${quizId}_time`);
      localStorage.removeItem(`quiz_${quizId}_timestamp`);
      localStorage.removeItem(`quiz_${quizId}_start_time`);
      localStorage.removeItem(`quiz_${quizId}_expired`);
      
      // Clear answers and submission data
      localStorage.removeItem(`quiz_${quizId}_answers`);
      localStorage.removeItem(`quiz_${quizId}_submitted`);
      localStorage.removeItem(`quiz_${quizId}_score`);
      localStorage.removeItem(`quiz_${quizId}_time_taken`);
      localStorage.removeItem(`quiz_${quizId}_show_results`);
      localStorage.removeItem(`quiz_${quizId}_attempts`);
      
      // Clear quiz summary
      localStorage.removeItem(`quiz_${quizId}_summary`);
      
      // Clean up module reports
      if (data?.quizzes_by_pk?.module?.id) {
        const moduleId = data.quizzes_by_pk.module.id;
        const savedReports = localStorage.getItem('all_module_quiz_reports');
        if (savedReports) {
          try {
            const reports = JSON.parse(savedReports);
            if (reports[moduleId]) {
              delete reports[moduleId];
              localStorage.setItem('all_module_quiz_reports', JSON.stringify(reports));
            }
          } catch (e) {
            console.error('Error parsing module reports:', e);
          }
        }
      }
    }

    if (nextModuleData?.modules?.[0]?.id) {
      navigate(`/courses/${data?.quizzes_by_pk.module.course_id}`);
    } else {
      handleBackToModule();
    }
  }, [nextModuleData?.modules, data?.quizzes_by_pk, navigate, handleBackToModule, quizId]);

  const handleSubmitClick = useCallback(() => {
    setShowSubmitConfirm(true);
  }, []);

  const handleConfirmSubmit = useCallback(() => {
    setShowSubmitConfirm(false);
    actions.handleSubmit(data?.quizzes_by_pk.quiz_questions, data?.quizzes_by_pk.module.id, data?.quizzes_by_pk.cutoff_score);
  }, [actions, data]);

  useEffect(() => {
    // When returning to results mode, ensure we show the complete results page
    if (isResultsMode) {
      actions.setShowResults(true);
      actions.setIsSubmitted(true);
      // Load saved answers if they exist
      const savedAnswers = localStorage.getItem(`quiz_${quizId}_answers`);
      if (savedAnswers) {
        try {
          const parsedAnswers = JSON.parse(savedAnswers);
          actions.setUserAnswers(parsedAnswers);
        } catch (e) {
          console.error('Error parsing saved answers:', e);
        }
      }
    }
  }, [isResultsMode, quizId, actions]);

  if (!quizId) return <div className="p-4">Quiz ID not provided</div>;
  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-center p-8 text-red-600"><h3 className="text-xl font-semibold mb-2">Error Loading Quiz</h3><p>{error.message}</p></div>;
  if (!data?.quizzes_by_pk) return <div className="text-center p-8"><h3 className="text-xl font-semibold mb-2">Quiz Not Found</h3><p>The requested quiz could not be found.</p></div>;

  const quiz = data.quizzes_by_pk;
  const totalQuestions = quiz.quiz_questions.length;
  const currentQuestion = quiz.quiz_questions[state.currentQuestionIndex];
  const progress = (Object.keys(state.userAnswers).length / totalQuestions) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <ConfirmDialog
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={handleConfirmSubmit}
        title="Submit Quiz"
        message="Are you sure you want to submit this quiz? You won't be able to change your answers after submission."
        confirmText="Submit"
        cancelText="Cancel"
        type="warning"
      />
      <TimeoutModal 
        isOpen={state.timeLeft === 0 && !state.showResults} 
        onRetake={() => actions.handleRetake(quiz.module.id)}
      />

      <div className="max-w-3xl mx-auto">
        <button
          onClick={handleBackToModule}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Module
        </button>

        <QuizHeader
          moduleTitle={quiz.module.title}
          timeLeft={state.timeLeft}
          cutoffScore={quiz.cutoff_score}
          currentQuestion={state.currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          attempts={state.attempts}
          isSubmitted={state.isSubmitted}
          score={state.score}
          progress={progress}
          isReviewMode={state.isReviewMode}
        />

        {state.isReviewMode ? (
          <div className="space-y-8">
            {quiz.quiz_questions.map((question, index) => (
              <QuizQuestion
                key={question.id}
                question={question}
                questionNumber={index + 1}
                selectedAnswer={state.userAnswers[question.id]}
                onAnswerSelect={handleAnswerSelect}
                isReviewMode={true}
                correctOption={question.correct_option}
              />
            ))}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleBackToModule}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Done
              </button>
            </div>
          </div>
        ) : !state.showResults ? (
          <>
            <QuizQuestion
              question={currentQuestion}
              questionNumber={state.currentQuestionIndex + 1}
              selectedAnswer={state.userAnswers[currentQuestion.id]}
              onAnswerSelect={handleAnswerSelect}
              isReviewMode={state.isReviewMode}
              correctOption={state.isReviewMode ? currentQuestion.correct_option : undefined}
            />

            <QuizNavigation
              currentQuestionIndex={state.currentQuestionIndex}
              totalQuestions={totalQuestions}
              answeredQuestions={Object.keys(state.userAnswers).length}
              onPrevious={() => actions.setCurrentQuestionIndex(prev => prev - 1)}
              onNext={() => actions.setCurrentQuestionIndex(prev => prev + 1)}
              onSubmit={handleSubmitClick}
              isReviewMode={state.isReviewMode}
            />
          </>
        ) : (
          <QuizResults
            questions={quiz.quiz_questions}
            userAnswers={state.userAnswers}
            score={state.score}
            cutoffScore={quiz.cutoff_score}
            onRetake={() => actions.handleRetake(quiz.module.id)}
            onBackToModule={handleBackToModule}
            onNextModule={handleNextModule}
            hasNextModule={!!nextModuleData?.modules?.[0]}
            onReview={state.score >= quiz.cutoff_score 
              ? () => actions.handleRetake(quiz.module.id, true) 
              : () => {}}
            timeTaken={state.timeTaken}
            moduleId={quiz.module.id}
            moduleName={quiz.module.title}
            moduleReports={state.allModuleReports[quiz.module.id]}
            quizId={quizId}
          />
        )}
      </div>
    </div>
  );
};

export default Quiz; 