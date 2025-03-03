import { useState, useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_QUIZ_STATUS, UPDATE_MODULE_STATUS } from '@/graphql/mutations/quiz';

const QUIZ_TIME_LIMIT = 300; // 5 minutes in seconds

interface UserAnswers {
  [questionId: string]: string;
}

interface QuizState {
  userAnswers: UserAnswers;
  isSubmitted: boolean;
  score: number;
  timeLeft: number;
  currentQuestionIndex: number;
  showResults: boolean;
  attempts: number;
  isReviewMode: boolean;
  timeTaken: number;
  allModuleReports: ModuleQuizReports;
}

interface QuizAttemptSummary {
  attemptNumber: number;
  score: number;
  timeTaken: number;
  timestamp: string;
  wrongAnswers: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
  }[];
}

interface QuizSummaryReport {
  moduleId: string;
  moduleName: string;
  quizId: string;
  attempts: QuizAttemptSummary[];
}

interface ModuleQuizReports {
  [moduleId: string]: QuizSummaryReport[];
}

interface QuizActions {
  setUserAnswers: Dispatch<SetStateAction<UserAnswers>>;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
  setScore: Dispatch<SetStateAction<number>>;
  setTimeLeft: Dispatch<SetStateAction<number>>;
  setCurrentQuestionIndex: Dispatch<SetStateAction<number>>;
  setShowResults: Dispatch<SetStateAction<boolean>>;
  setAttempts: Dispatch<SetStateAction<number>>;
  setIsReviewMode: Dispatch<SetStateAction<boolean>>;
  handleAnswerSelect: (questionId: string, selectedOption: string) => void;
  calculateScore: (questions: QuizData['quiz_questions'], answers: UserAnswers) => number;
  resetQuiz: () => void;
  handleSubmit: (questions?: QuizData['quiz_questions'], moduleId?: string, cutoffScore?: number) => Promise<void>;
  handleRetake: (moduleId?: string, isReview?: boolean) => Promise<void>;
}

interface UseQuizStateProps {
  quizId: string;
  refetch: () => Promise<any>;
  initialReviewMode?: boolean;
  initialShowResults?: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_option: string;
}

interface QuizData {
  quiz_questions: QuizQuestion[];
  module?: {
    id: string;
    title: string;
  };
}

const useQuizState = ({ quizId, refetch, initialReviewMode = false, initialShowResults = false }: UseQuizStateProps) => {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>(() => {
    // Initialize userAnswers from localStorage if in review mode
    if (initialReviewMode && quizId) {
      const savedAnswers = localStorage.getItem(`quiz_${quizId}_answers`);
      if (savedAnswers) {
        try {
          return JSON.parse(savedAnswers);
        } catch (e) {
          console.error('Error parsing saved answers:', e);
        }
      }
    }
    return {};
  });
  const [isSubmitted, setIsSubmitted] = useState(initialReviewMode);
  const [score, setScore] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!quizId || initialReviewMode) return 0;
    
    const savedTime = localStorage.getItem(`quiz_${quizId}_time`);
    const savedTimestamp = localStorage.getItem(`quiz_${quizId}_timestamp`);
    const startTime = localStorage.getItem(`quiz_${quizId}_start_time`);
    
    if (savedTime && savedTimestamp) {
      const elapsedSeconds = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000);
      const remainingTime = Math.max(parseInt(savedTime) - elapsedSeconds, 0);
      return remainingTime > 0 ? remainingTime : QUIZ_TIME_LIMIT;
    }
    
    // Store start time when starting a new quiz
    if (!startTime) {
      localStorage.setItem(`quiz_${quizId}_start_time`, Date.now().toString());
    }
    
    return QUIZ_TIME_LIMIT;
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(initialShowResults);
  const [attempts, setAttempts] = useState(() => {
    if (!quizId) return 0;
    const savedAttempts = localStorage.getItem(`quiz_${quizId}_attempts`);
    return savedAttempts ? parseInt(savedAttempts) : 0;
  });
  const [isReviewMode, setIsReviewMode] = useState(initialReviewMode);

  // Add new state for quiz summary
  const [quizSummary, setQuizSummary] = useState<QuizSummaryReport>(() => {
    const savedSummary = localStorage.getItem(`quiz_${quizId}_summary`);
    if (savedSummary) {
      try {
        return JSON.parse(savedSummary);
      } catch (e) {
        console.error('Error parsing saved quiz summary:', e);
      }
    }
    return {
      moduleId: '',
      moduleName: '',
      quizId,
      attempts: []
    };
  });

  // Add new state for all module quiz reports
  const [allModuleReports, setAllModuleReports] = useState<ModuleQuizReports>(() => {
    const savedReports = localStorage.getItem('all_module_quiz_reports');
    if (savedReports) {
      try {
        return JSON.parse(savedReports);
      } catch (e) {
        console.error('Error parsing saved module reports:', e);
        return {};
      }
    }
    return {};
  });

  const [updateQuizStatus] = useMutation(UPDATE_QUIZ_STATUS);
  const [updateModuleStatus] = useMutation(UPDATE_MODULE_STATUS);

  const calculateScore = useCallback((questions: QuizData['quiz_questions'], answers: UserAnswers): number => {
    if (!questions.length) return 0;
    const correctAnswers = questions.filter((q: { id: string; correct_option: string }) => 
      answers[q.id] === q.correct_option
    ).length;
    return Math.round((correctAnswers / questions.length) * 100);
  }, []);

  const handleAnswerSelect = useCallback((questionId: string, selectedOption: string) => {
    const newAnswers = {
      ...userAnswers,
      [questionId]: selectedOption
    };
    setUserAnswers(newAnswers);
  }, [userAnswers]);

  // Function to save quiz summary
  const saveQuizSummary = useCallback((
    questions: QuizQuestion[],
    score: number,
    timeTaken: number,
    moduleId: string,
    moduleName: string
  ) => {
    const wrongAnswers = questions
      .filter((q: QuizQuestion) => userAnswers[q.id] !== q.correct_option)
      .map((q: QuizQuestion) => ({
        questionId: q.id,
        question: q.question,
        userAnswer: userAnswers[q.id] || 'Not answered',
        correctAnswer: q.correct_option
      }));

    const newAttempt: QuizAttemptSummary = {
      attemptNumber: quizSummary.attempts.length + 1,
      score,
      timeTaken,
      timestamp: new Date().toISOString(),
      wrongAnswers
    };

    const updatedSummary = {
      moduleId,
      moduleName,
      quizId,
      attempts: [...quizSummary.attempts, newAttempt]
    };

    // Update individual quiz summary
    setQuizSummary(updatedSummary);
    localStorage.setItem(`quiz_${quizId}_summary`, JSON.stringify(updatedSummary));

    // Update all module reports
    const updatedModuleReports = { ...allModuleReports };
    if (!updatedModuleReports[moduleId]) {
      updatedModuleReports[moduleId] = [];
    }

    // Find existing report for this quiz
    const existingReportIndex = updatedModuleReports[moduleId].findIndex(
      report => report.quizId === quizId
    );

    if (existingReportIndex !== -1) {
      // Update existing report
      updatedModuleReports[moduleId][existingReportIndex] = updatedSummary;
    } else {
      // Add new report
      updatedModuleReports[moduleId].push(updatedSummary);
    }

    // Save updated reports to localStorage
    setAllModuleReports(updatedModuleReports);
    localStorage.setItem('all_module_quiz_reports', JSON.stringify(updatedModuleReports));

    // Log the summary report to console
    console.group('Quiz Summary Report');
    console.log('Module ID:', moduleId);
    console.log('Module Name:', moduleName);
    console.log('Quiz ID:', quizId);
    console.log('Attempt Number:', newAttempt.attemptNumber);
    console.log('Score:', score + '%');
    console.log('Time Taken:', timeTaken + ' seconds');
    console.log('Timestamp:', new Date(newAttempt.timestamp).toLocaleString());
    
    if (wrongAnswers.length > 0) {
      console.group('Wrong Answers');
      wrongAnswers.forEach((wrong: { question: string; userAnswer: string; correctAnswer: string }, index: number) => {
        console.group(`Question ${index + 1}`);
        console.log('Question:', wrong.question);
        console.log('Your Answer:', wrong.userAnswer);
        console.log('Correct Answer:', wrong.correctAnswer);
        console.groupEnd();
      });
      console.groupEnd();
    } else {
      console.log('All answers were correct!');
    }

    // Log all reports for this module
    console.group('All Quiz Reports for Module');
    console.log('Module Name:', moduleName);
    console.log('Total Quizzes:', updatedModuleReports[moduleId].length);
    updatedModuleReports[moduleId].forEach((report, index) => {
      console.group(`Quiz ${index + 1} - ${report.quizId}`);
      console.log('Total Attempts:', report.attempts.length);
      console.log('Latest Score:', report.attempts[report.attempts.length - 1].score + '%');
      console.log('Best Score:', Math.max(...report.attempts.map(a => a.score)) + '%');
      
      // Add detailed wrong answers history for each attempt
      console.group('Attempts History');
      report.attempts.forEach((attempt, attemptIndex) => {
        console.group(`Attempt ${attempt.attemptNumber} - Score: ${attempt.score}% - Time: ${attempt.timeTaken}s`);
        if (attempt.wrongAnswers.length > 0) {
          console.group('Wrong Answers');
          attempt.wrongAnswers.forEach((wrong, wrongIndex) => {
            console.group(`Question ${wrongIndex + 1}`);
            console.log('Question:', wrong.question);
            console.log('Your Answer:', wrong.userAnswer);
            console.log('Correct Answer:', wrong.correctAnswer);
            console.groupEnd();
          });
          console.groupEnd();
        } else {
          console.log('All answers were correct in this attempt!');
        }
        console.groupEnd();
      });
      console.groupEnd();
      
      console.groupEnd();
    });
    console.groupEnd();

    console.groupEnd();
  }, [quizId, quizSummary, userAnswers, allModuleReports]);

  // Add cleanup function for quiz data
  const cleanupQuizData = useCallback((moduleId: string) => {
    // Remove individual quiz summary
    localStorage.removeItem(`quiz_${quizId}_summary`);
    
    // Update module reports
    const updatedModuleReports = { ...allModuleReports };
    if (updatedModuleReports[moduleId]) {
      updatedModuleReports[moduleId] = updatedModuleReports[moduleId].filter(
        report => report.quizId !== quizId
      );
      if (updatedModuleReports[moduleId].length === 0) {
        delete updatedModuleReports[moduleId];
      }
      setAllModuleReports(updatedModuleReports);
      localStorage.setItem('all_module_quiz_reports', JSON.stringify(updatedModuleReports));
    }
  }, [quizId, allModuleReports]);

  const handleSubmit = useCallback(async (
    questions?: QuizData['quiz_questions'],
    moduleId?: string,
    cutoffScore?: number
  ) => {
    if (!questions || !moduleId) return;
    
    const calculatedScore = calculateScore(questions, userAnswers);
    
    try {
      const newStatus = calculatedScore >= (cutoffScore || 0) ? 'passed' : 'failed';

      // Calculate time taken
      const startTime = localStorage.getItem(`quiz_${quizId}_start_time`);
      let duration = 0;
      if (startTime) {
        duration = Math.floor((Date.now() - parseInt(startTime)) / 1000);
        setTimeTaken(duration);
      }

      // Get module title from refetch result
      const result = await refetch();
      const moduleName = result.data?.quizzes_by_pk?.module?.title || 'Unknown Module';

      // Save quiz summary before updating status
      saveQuizSummary(questions, calculatedScore, duration, moduleId, moduleName);

      // Save user answers to localStorage for review mode
      localStorage.setItem(`quiz_${quizId}_answers`, JSON.stringify(userAnswers));

      const updateResult = await updateQuizStatus({
        variables: {
          quizId,
          status: newStatus,
          score: calculatedScore
        }
      });

      if (updateResult.data) {
        setScore(calculatedScore);
        setIsSubmitted(true);
        setShowResults(true);

        // Clear timer data from localStorage when quiz is submitted
        if (quizId) {
          localStorage.removeItem(`quiz_${quizId}_time`);
          localStorage.removeItem(`quiz_${quizId}_timestamp`);
          localStorage.removeItem(`quiz_${quizId}_start_time`);
        }

        if (newStatus === 'passed' && moduleId) {
          await updateModuleStatus({
            variables: {
              moduleId,
              status: 'completed'
            }
          });
        }

        await refetch();
      }
    } catch (error) {
      console.error('Error updating quiz status and score:', error);
    }
  }, [calculateScore, userAnswers, quizId, updateQuizStatus, updateModuleStatus, refetch, saveQuizSummary]);

  const handleRetake = useCallback(async (moduleId?: string, isReview?: boolean) => {
    if (isReview) {
      setIsReviewMode(true);
      setCurrentQuestionIndex(0);
      setShowResults(false);
      setIsSubmitted(true);
      setTimeLeft(0);
      // Do not clear userAnswers in review mode
      if (quizId) {
        localStorage.removeItem(`quiz_${quizId}_time`);
        localStorage.removeItem(`quiz_${quizId}_timestamp`);
        localStorage.removeItem(`quiz_${quizId}_start_time`);
      }
      return;
    }

    try {
      if (moduleId) {
        cleanupQuizData(moduleId);
      }

      const result = await updateQuizStatus({
        variables: {
          quizId,
          status: 'not_attempted',
          score: 0
        }
      });

      if (result.data) {
        if (moduleId) {
          await updateModuleStatus({
            variables: {
              moduleId,
              status: 'in_progress'
            }
          });
        }

        setUserAnswers({});
        setIsSubmitted(false);
        setScore(0);
        setTimeLeft(QUIZ_TIME_LIMIT);
        setCurrentQuestionIndex(0);
        setShowResults(false);
        setAttempts(prev => prev + 1);
        setIsReviewMode(false);
        setTimeTaken(0);

        // Initialize timer data in localStorage for new attempt
        if (quizId) {
          localStorage.setItem(`quiz_${quizId}_time`, QUIZ_TIME_LIMIT.toString());
          localStorage.setItem(`quiz_${quizId}_timestamp`, Date.now().toString());
          localStorage.setItem(`quiz_${quizId}_start_time`, Date.now().toString());
        }

        await refetch();
      }
    } catch (error) {
      console.error('Error resetting quiz:', error);
    }
  }, [quizId, updateQuizStatus, updateModuleStatus, refetch, cleanupQuizData]);

  const resetQuiz = useCallback(() => {
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setTimeLeft(QUIZ_TIME_LIMIT);
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setAttempts(prev => prev + 1);
  }, []);

  // Timer functionality
  useEffect(() => {
    let timerId: number;

    const updateTimer = () => {
      if (!isSubmitted && !showResults && !isReviewMode) {
        setTimeLeft((prev: number) => {
          const newTime = prev <= 1 ? 0 : prev - 1;
          
          // Save current time and timestamp to localStorage
          if (quizId && newTime > 0) {
            localStorage.setItem(`quiz_${quizId}_time`, newTime.toString());
            localStorage.setItem(`quiz_${quizId}_timestamp`, Date.now().toString());
          }

          if (newTime <= 0) {
            handleSubmit();
          }

          return newTime;
        });
        timerId = window.setTimeout(updateTimer, 1000);
      }
    };

    if (!isSubmitted && !showResults && !isReviewMode) {
      timerId = window.setTimeout(updateTimer, 1000);
    }

    return () => {
      if (timerId) {
        window.clearTimeout(timerId);
      }
    };
  }, [isSubmitted, showResults, isReviewMode, quizId, handleSubmit]);

  // Clear timer from localStorage when quiz is complete
  useEffect(() => {
    if (quizId && (isSubmitted || showResults)) {
      localStorage.removeItem(`quiz_${quizId}_time`);
      localStorage.removeItem(`quiz_${quizId}_timestamp`);
    }
  }, [quizId, isSubmitted, showResults]);

  // Initialize review mode if needed
  useEffect(() => {
    if (initialReviewMode) {
      setIsReviewMode(true);
      setIsSubmitted(true);
    }
  }, [initialReviewMode]);

  // Load previous quiz data when in review mode
  useEffect(() => {
    const loadPreviousQuizData = async () => {
      if (initialReviewMode && quizId) {
        try {
          const result = await refetch();
          const quiz = result.data?.quizzes_by_pk;
          if (quiz) {
            setScore(quiz.score || 0);
            // Always try to load saved answers in review mode
            const savedAnswers = localStorage.getItem(`quiz_${quizId}_answers`);
            if (savedAnswers) {
              try {
                const parsedAnswers = JSON.parse(savedAnswers);
                // Only update if we have answers and they're different from current state
                if (Object.keys(parsedAnswers).length > 0 && 
                    JSON.stringify(parsedAnswers) !== JSON.stringify(userAnswers)) {
                  setUserAnswers(parsedAnswers);
                }
              } catch (e) {
                console.error('Error parsing saved answers:', e);
              }
            }
          }
        } catch (error) {
          console.error('Error loading previous quiz data:', error);
        }
      }
    };

    loadPreviousQuizData();
  }, [initialReviewMode, quizId, refetch, userAnswers]);

  // Save attempts to localStorage whenever it changes
  useEffect(() => {
    if (quizId) {
      localStorage.setItem(`quiz_${quizId}_attempts`, attempts.toString());
    }
  }, [attempts, quizId]);

  return {
    state: {
      userAnswers,
      isSubmitted,
      score,
      timeLeft,
      currentQuestionIndex,
      showResults,
      attempts,
      isReviewMode,
      timeTaken,
      allModuleReports
    },
    actions: {
      setUserAnswers,
      setIsSubmitted,
      setScore,
      setTimeLeft,
      setCurrentQuestionIndex,
      setShowResults,
      setAttempts,
      setIsReviewMode,
      handleAnswerSelect,
      calculateScore,
      resetQuiz,
      handleSubmit,
      handleRetake
    } as QuizActions
  };
};

export default useQuizState; 