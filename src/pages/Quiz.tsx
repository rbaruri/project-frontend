import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
// import { ModuleStatus } from '../graphql/queries/modules';

const GET_QUIZ_WITH_QUESTIONS = gql`
  query GetQuizWithQuestions($quizId: uuid!) {
    quizzes_by_pk(id: $quizId) {
      id
      cutoff_score
      status
      score
      created_at
      module {
        id
        title
        course_id
      }
      quiz_questions {
        id
        question
        options
        correct_option
      }
    }
  }
`;

const UPDATE_QUIZ_STATUS = gql`
  mutation UpdateQuizStatus($quizId: uuid!, $status: String!, $score: Int!) {
    update_quizzes_by_pk(
      pk_columns: { id: $quizId },
      _set: { 
        status: $status,
        score: $score
      }
    ) {
      id
      status
      score
    }
  }
`;

const GET_NEXT_MODULE = gql`
  query GetNextModule($courseId: uuid!, $currentModuleId: uuid!) {
    modules(
      where: {
        course_id: { _eq: $courseId },
        id: { _gt: $currentModuleId }
      },
      order_by: { created_at: asc },
      limit: 1
    ) {
      id
      title
    }
  }
`;

const UPDATE_MODULE_STATUS = gql`
  mutation UpdateModuleStatus($moduleId: uuid!, $status: String!) {
    update_modules_by_pk(
      pk_columns: { id: $moduleId },
      _set: { status: $status }
    ) {
      id
      status
    }
  }
`;

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_option: string;
}

interface QuizData {
  quizzes_by_pk: {
    id: string;
    cutoff_score: number;
    status: string;
    score: number;
    created_at: string;
    module: {
      id: string;
      title: string;
      course_id: string;
    };
    quiz_questions: QuizQuestion[];
  };
}

interface NextModuleData {
  modules: {
    id: string;
    title: string;
  }[];
}

interface UserAnswers {
  [questionId: string]: string;
}

const QUIZ_TIME_LIMIT = 30 * 60; // 30 minutes in seconds

// Define quiz status values to match the database check constraint
const QuizStatus = {
  NOT_STARTED: 'not_attempted',
  IN_PROGRESS: 'not_attempted',  // We'll use not_attempted for in progress too since it's not in the constraint
  COMPLETED: 'passed',
  FAILED: 'failed'
} as const;

type QuizStatusType = typeof QuizStatus[keyof typeof QuizStatus];

const Quiz: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_LIMIT);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const { loading, error, data, refetch } = useQuery<QuizData>(GET_QUIZ_WITH_QUESTIONS, {
    variables: { quizId },
    skip: !quizId,
  });

  const [updateQuizStatus] = useMutation(UPDATE_QUIZ_STATUS);

  const { loading: nextModuleLoading, data: nextModuleData } = useQuery<NextModuleData>(GET_NEXT_MODULE, {
    variables: {
      courseId: data?.quizzes_by_pk.module.course_id,
      currentModuleId: data?.quizzes_by_pk.module.id
    },
    skip: !data?.quizzes_by_pk?.module?.course_id || !data?.quizzes_by_pk?.module?.id
  });

  const [updateModuleStatus] = useMutation(UPDATE_MODULE_STATUS);

  // Function to save answers to local storage
  const saveAnswersToLocalStorage = useCallback((answers: UserAnswers) => {
    if (quizId) {
      localStorage.setItem(`quiz_${quizId}_answers`, JSON.stringify(answers));
      localStorage.setItem(`quiz_${quizId}_timestamp`, Date.now().toString());
    }
  }, [quizId]);

  // Function to load answers from local storage
  const loadAnswersFromLocalStorage = useCallback((): UserAnswers | null => {
    if (!quizId) return null;

    const savedAnswers = localStorage.getItem(`quiz_${quizId}_answers`);
    const savedTimestamp = localStorage.getItem(`quiz_${quizId}_timestamp`);

    if (savedAnswers && savedTimestamp) {
      const timestamp = parseInt(savedTimestamp);
      const now = Date.now();
      // Only restore answers if they were saved within the quiz time limit
      if (now - timestamp <= QUIZ_TIME_LIMIT * 1000) {
        try {
          return JSON.parse(savedAnswers);
        } catch (e) {
          console.error('Error parsing saved answers:', e);
        }
      }
    }
    return null;
  }, [quizId]);

  // Load saved answers when component mounts
  useEffect(() => {
    if (!isSubmitted && !showResults) {
      const savedAnswers = loadAnswersFromLocalStorage();
      if (savedAnswers) {
        setUserAnswers(savedAnswers);
        // Update current question index based on the last answered question
        const answeredQuestions = Object.keys(savedAnswers).length;
        if (answeredQuestions > 0) {
          setCurrentQuestionIndex(Math.min(answeredQuestions - 1, currentQuestionIndex));
        }
      }
    }
  }, [loadAnswersFromLocalStorage, isSubmitted, showResults]);

  // Clear saved answers when quiz is submitted or retaken
  useEffect(() => {
    if (isSubmitted || showResults) {
      localStorage.removeItem(`quiz_${quizId}_answers`);
      localStorage.removeItem(`quiz_${quizId}_timestamp`);
    }
  }, [isSubmitted, showResults, quizId]);

  // Timer functionality
  useEffect(() => {
    if (!isSubmitted && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isSubmitted, showResults]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, selectedOption: string) => {
    const newAnswers = {
      ...userAnswers,
      [questionId]: selectedOption
    };
    setUserAnswers(newAnswers);
    // Save to local storage whenever an answer is selected
    saveAnswersToLocalStorage(newAnswers);
  };

  const calculateScore = (questions: QuizQuestion[], answers: UserAnswers): number => {
    if (!questions.length) return 0;
    const correctAnswers = questions.filter(q => answers[q.id] === q.correct_option).length;
    // Ensure we return a whole number
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const handleSubmit = async () => {
    if (!data?.quizzes_by_pk.quiz_questions) return;
    
    // Calculate the score first
    const calculatedScore = calculateScore(data.quizzes_by_pk.quiz_questions, userAnswers);
    
    try {
      // Determine quiz status based on score
      const newStatus = calculatedScore >= data.quizzes_by_pk.cutoff_score 
        ? 'passed'
        : 'failed';

      console.log('Updating quiz with status:', newStatus, 'and score:', calculatedScore);

      // First update quiz status and score
      const result = await updateQuizStatus({
        variables: {
          quizId,
          status: newStatus,
          score: calculatedScore
        }
      });

      // Update local state after successful database update
      if (result.data) {
        setScore(calculatedScore);
        setIsSubmitted(true);
        setShowResults(true);

        // If quiz is passed, update module status
        if (newStatus === 'passed' && data.quizzes_by_pk.module.id) {
          await updateModuleStatus({
            variables: {
              moduleId: data.quizzes_by_pk.module.id,
              status: 'completed'  // Keep module status as 'completed' since it's a different table
            }
          });
        }

        await refetch();
      }
    } catch (error) {
      console.error('Error updating quiz status and score:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
    }
  };

  const handleRetake = async () => {
    try {
      console.log('Retaking quiz - setting status to not_attempted');

      // Update quiz status and reset score to 0
      const result = await updateQuizStatus({
        variables: {
          quizId,
          status: 'not_attempted',
          score: 0
        }
      });

      if (result.data) {
        // Update module status if needed
        if (data?.quizzes_by_pk.module.id) {
          await updateModuleStatus({
            variables: {
              moduleId: data.quizzes_by_pk.module.id,
              status: 'in_progress'  // Keep module status as 'in_progress' since it's a different table
            }
          });
        }

        // Reset local state
        setUserAnswers({});
        setIsSubmitted(false);
        setScore(0);
        setTimeLeft(QUIZ_TIME_LIMIT);
        setCurrentQuestionIndex(0);
        setShowResults(false);
        setAttempts(prev => prev + 1);

        await refetch();
      }
    } catch (error) {
      console.error('Error resetting quiz:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
    }
  };

  // Update initial quiz status
  useEffect(() => {
    const initializeQuiz = async () => {
      if (data?.quizzes_by_pk && data.quizzes_by_pk.status === 'not_attempted') {
        try {
          console.log('Initializing quiz - setting status to not_attempted');
          
          await updateQuizStatus({
            variables: {
              quizId,
              status: 'not_attempted',
              score: 0
            }
          });

          if (data.quizzes_by_pk.module.id) {
            await updateModuleStatus({
              variables: {
                moduleId: data.quizzes_by_pk.module.id,
                status: 'in_progress'  // Keep module status as 'in_progress' since it's a different table
              }
            });
          }

          await refetch();
        } catch (error) {
          console.error('Error initializing quiz:', error);
          if (error instanceof Error) {
            console.error('Error details:', error.message);
          }
        }
      }
    };

    initializeQuiz();
  }, [data?.quizzes_by_pk, quizId, updateQuizStatus, updateModuleStatus, refetch]);

  const handleNextQuestion = () => {
    if (data?.quizzes_by_pk.quiz_questions && 
        currentQuestionIndex < data.quizzes_by_pk.quiz_questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const getAnswerStatus = (question: QuizQuestion, userAnswer: string | undefined): {
    isCorrect: boolean;
    className: string;
  } => {
    if (!isSubmitted || !userAnswer) {
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

  const handleBackToModule = () => {
    if (data?.quizzes_by_pk?.module?.course_id) {
      navigate(`/courses/${data.quizzes_by_pk.module.course_id}`);
    } else {
      navigate('/courses');
    }
  };

  const handleNextModule = () => {
    if (nextModuleData?.modules?.[0]?.id) {
      navigate(`/courses/${data?.quizzes_by_pk.module.course_id}`);
    } else {
      // If there's no next module, go back to course
      handleBackToModule();
    }
  };

  if (!quizId) {
    return <div className="p-4">Quiz ID not provided</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <h3 className="text-xl font-semibold mb-2">Error Loading Quiz</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data?.quizzes_by_pk) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold mb-2">Quiz Not Found</h3>
        <p>The requested quiz could not be found.</p>
      </div>
    );
  }

  const quiz = data.quizzes_by_pk;
  const totalQuestions = quiz.quiz_questions.length;
  const currentQuestion = quiz.quiz_questions[currentQuestionIndex];
  const progress = (Object.keys(userAnswers).length / totalQuestions) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {quiz.module.title} - Quiz
            </h1>
            <div className="text-xl font-semibold text-blue-600">
              Time Left: {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-center">
              <div className="space-x-4">
                <span>Cutoff Score: {quiz.cutoff_score}%</span>
                <span>Questions: {currentQuestionIndex + 1}/{totalQuestions}</span>
                {attempts > 0 && <span>Attempts: {attempts + 1}</span>}
              </div>
              {isSubmitted && (
                <span className={`font-bold ${score >= quiz.cutoff_score ? 'text-green-600' : 'text-red-600'}`}>
                  Score: {score}%
                </span>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {!showResults ? (
          // Question View
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Question {currentQuestionIndex + 1}
            </h3>
            <p className="text-gray-700 mb-6">{currentQuestion.question}</p>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, optionIndex) => {
                const isSelected = userAnswers[currentQuestion.id] === option;
                
                return (
                  <label
                    key={optionIndex}
                    className={`flex items-center p-4 rounded-lg border transition-colors cursor-pointer ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={isSelected}
                      onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3">{option}</span>
                  </label>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 rounded-md ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                Previous
              </button>
              
              {currentQuestionIndex === totalQuestions - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(userAnswers).length !== totalQuestions}
                  className={`px-6 py-2 rounded-md text-white font-medium ${
                    Object.keys(userAnswers).length === totalQuestions
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        ) : (
          // Results View
          <div className="space-y-8">
            {quiz.quiz_questions.map((question, index) => {
              const answerStatus = getAnswerStatus(question, userAnswers[question.id]);
              
              return (
                <div
                  key={question.id}
                  className={`bg-white rounded-lg shadow-md p-6 ${answerStatus.className}`}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Question {index + 1}
                  </h3>
                  <p className="text-gray-700 mb-4">{question.question}</p>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = userAnswers[question.id] === option;
                      const isCorrectOption = question.correct_option === option;
                      
                      let optionClassName = "flex items-center p-3 rounded-lg border transition-colors ";
                      
                      if (isCorrectOption) {
                        optionClassName += "border-green-500 bg-green-50";
                      } else if (isSelected && !isCorrectOption) {
                        optionClassName += "border-red-500 bg-red-50";
                      } else {
                        optionClassName += "border-gray-200";
                      }

                      return (
                        <div
                          key={optionIndex}
                          className={optionClassName}
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
            })}

            <div className="mt-8">
              {/* Show final score and message */}
              <div className="text-center mb-6">
                <h2 className={`text-2xl font-bold ${score >= quiz.cutoff_score ? 'text-green-600' : 'text-red-600'}`}>
                  Final Score: {score}%
                </h2>
                <p className="mt-2 text-lg">
                  {score >= quiz.cutoff_score ? (
                    <>
                      Congratulations! You've passed the quiz.
                      {nextModuleData?.modules?.[0] && (
                        <span className="block mt-1 text-gray-600">
                          You can now proceed to the next module.
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-red-600">
                      You need {quiz.cutoff_score}% to pass. Please try again.
                    </span>
                  )}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex justify-center space-x-4">
                {score < quiz.cutoff_score ? (
                  <>
                    <button
                      onClick={handleRetake}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Retake Quiz
                    </button>
                    <button
                      onClick={handleBackToModule}
                      className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Back to Course
                    </button>
                  </>
                ) : (
                  <>
                    {nextModuleData?.modules?.[0] ? (
                      <button
                        onClick={handleNextModule}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Next Module
                      </button>
                    ) : (
                      <button
                        onClick={handleBackToModule}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Complete Module
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz; 