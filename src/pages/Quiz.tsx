import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_QUIZ_WITH_QUESTIONS, GET_NEXT_MODULE } from '../graphql/queries/quiz';
import { UPDATE_QUIZ_STATUS, UPDATE_MODULE_STATUS } from '../graphql/mutations/quiz';
import { QuizData, NextModuleData } from '../types/quizypes';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizResults from '../components/quiz/QuizResults';
import QuizHeader from '../components/quiz/QuizHeader';
import QuizNavigation from '../components/quiz/QuizNavigation';
import { useQuizState } from '../hooks/useQuizState';
import { useQuizStorage } from '../hooks/useQuizStorage';

const Quiz: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const { loading, error, data, refetch } = useQuery<QuizData>(GET_QUIZ_WITH_QUESTIONS, {
    variables: { quizId },
    skip: !quizId,
  });

  const [updateQuizStatus] = useMutation(UPDATE_QUIZ_STATUS);
  const [updateModuleStatus] = useMutation(UPDATE_MODULE_STATUS);

  const { state, actions } = useQuizState({
    quizId: quizId || '',
    refetch
  });

  const storage = useQuizStorage(quizId);

  const { data: nextModuleData } = useQuery<NextModuleData>(GET_NEXT_MODULE, {
    variables: {
      courseId: data?.quizzes_by_pk.module.course_id,
      currentModuleId: data?.quizzes_by_pk.module.id
    },
    skip: !data?.quizzes_by_pk?.module?.course_id || !data?.quizzes_by_pk?.module?.id
  });

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
    if (nextModuleData?.modules?.[0]?.id) {
      navigate(`/courses/${data?.quizzes_by_pk.module.course_id}`);
    } else {
      handleBackToModule();
    }
  }, [nextModuleData?.modules, data?.quizzes_by_pk.module.course_id, navigate, handleBackToModule]);

  // Load saved answers only once when component mounts
  useEffect(() => {
    if (!state.isSubmitted && !state.showResults) {
      const savedAnswers = storage.loadAnswersFromLocalStorage();
      if (savedAnswers) {
        actions.setUserAnswers(savedAnswers);
      }
    }
  }, []);  // Empty dependency array since we only want this to run once

  // Clear saved answers when quiz is submitted or retaken
  useEffect(() => {
    if (state.isSubmitted || state.showResults) {
      storage.clearLocalStorage();
    }
  }, [state.isSubmitted, state.showResults, storage]);

  // Timer functionality
  useEffect(() => {
    if (!state.isSubmitted && !state.showResults) {
      const timer = setInterval(() => {
        actions.setTimeLeft((prevTime: number) => {
          if (prevTime <= 1) {
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [state.isSubmitted, state.showResults]);

  const handleSubmit = async () => {
    if (!data?.quizzes_by_pk.quiz_questions) return;
    
    const calculatedScore = actions.calculateScore(data.quizzes_by_pk.quiz_questions, state.userAnswers);
    
    try {
      const newStatus = calculatedScore >= data.quizzes_by_pk.cutoff_score ? 'passed' : 'failed';

      const result = await updateQuizStatus({
        variables: {
          quizId,
          status: newStatus,
          score: calculatedScore
        }
      });

      if (result.data) {
        actions.setScore(calculatedScore);
        actions.setIsSubmitted(true);
        actions.setShowResults(true);

        if (newStatus === 'passed' && data.quizzes_by_pk.module.id) {
          await updateModuleStatus({
            variables: {
              moduleId: data.quizzes_by_pk.module.id,
              status: 'completed'
            }
          });
        }

        await refetch();
      }
    } catch (error) {
      console.error('Error updating quiz status and score:', error);
    }
  };

  const handleRetake = async () => {
    try {
      const result = await updateQuizStatus({
        variables: {
          quizId,
          status: 'not_attempted',
          score: 0
        }
      });

      if (result.data) {
        if (data?.quizzes_by_pk.module.id) {
          await updateModuleStatus({
            variables: {
              moduleId: data.quizzes_by_pk.module.id,
              status: 'in_progress'
            }
          });
        }

        actions.resetQuiz();
        await refetch();
      }
    } catch (error) {
      console.error('Error resetting quiz:', error);
    }
  };

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
      <div className="max-w-3xl mx-auto">
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
        />

        {!state.showResults ? (
          <>
            <QuizQuestion
              question={currentQuestion}
              questionNumber={state.currentQuestionIndex + 1}
              selectedAnswer={state.userAnswers[currentQuestion.id]}
              onAnswerSelect={handleAnswerSelect}
            />

            <QuizNavigation
              currentQuestionIndex={state.currentQuestionIndex}
              totalQuestions={totalQuestions}
              answeredQuestions={Object.keys(state.userAnswers).length}
              onPrevious={() => actions.setCurrentQuestionIndex(prev => prev - 1)}
              onNext={() => actions.setCurrentQuestionIndex(prev => prev + 1)}
              onSubmit={() => actions.handleSubmit(quiz.quiz_questions, quiz.module.id, quiz.cutoff_score)}
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
          />
        )}
      </div>
    </div>
  );
};

export default Quiz; 