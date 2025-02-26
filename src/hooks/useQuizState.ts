import { useState, useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import { useMutation } from '@apollo/client';
import { UserAnswers, QuizData } from '../types/quiz.types';
import { UPDATE_QUIZ_STATUS, UPDATE_MODULE_STATUS } from '../graphql/mutations/quiz';
import { QUIZ_TIME_LIMIT } from '../helper/quizHelper';

interface QuizState {
  userAnswers: UserAnswers;
  isSubmitted: boolean;
  score: number;
  timeLeft: number;
  currentQuestionIndex: number;
  showResults: boolean;
  attempts: number;
}

interface QuizActions {
  setUserAnswers: Dispatch<SetStateAction<UserAnswers>>;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
  setScore: Dispatch<SetStateAction<number>>;
  setTimeLeft: Dispatch<SetStateAction<number>>;
  setCurrentQuestionIndex: Dispatch<SetStateAction<number>>;
  setShowResults: Dispatch<SetStateAction<boolean>>;
  setAttempts: Dispatch<SetStateAction<number>>;
  handleAnswerSelect: (questionId: string, selectedOption: string) => void;
  calculateScore: (questions: QuizData['quizzes_by_pk']['quiz_questions'], answers: UserAnswers) => number;
  resetQuiz: () => void;
  handleSubmit: (questions?: QuizData['quizzes_by_pk']['quiz_questions'], moduleId?: string, cutoffScore?: number) => Promise<void>;
  handleRetake: (moduleId?: string) => Promise<void>;
}

interface UseQuizStateProps {
  quizId: string;
  refetch: () => Promise<any>;
}

export const useQuizState = ({ quizId, refetch }: UseQuizStateProps) => {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!quizId) return QUIZ_TIME_LIMIT;
    const savedTime = localStorage.getItem(`quiz_${quizId}_time`);
    const savedTimestamp = localStorage.getItem(`quiz_${quizId}_last_timestamp`);
    
    if (savedTime && savedTimestamp) {
      const elapsedSeconds = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000);
      const remainingTime = Math.max(parseInt(savedTime) - elapsedSeconds, 0);
      return remainingTime > 0 ? remainingTime : QUIZ_TIME_LIMIT;
    }
    return QUIZ_TIME_LIMIT;
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const [updateQuizStatus] = useMutation(UPDATE_QUIZ_STATUS);
  const [updateModuleStatus] = useMutation(UPDATE_MODULE_STATUS);

  const saveAnswersToLocalStorage = useCallback((answers: UserAnswers) => {
    if (quizId) {
      localStorage.setItem(`quiz_${quizId}_answers`, JSON.stringify(answers));
      localStorage.setItem(`quiz_${quizId}_timestamp`, Date.now().toString());
    }
  }, [quizId]);

  const loadAnswersFromLocalStorage = useCallback((): UserAnswers | null => {
    if (!quizId) return null;

    const savedAnswers = localStorage.getItem(`quiz_${quizId}_answers`);
    const savedTimestamp = localStorage.getItem(`quiz_${quizId}_timestamp`);

    if (savedAnswers && savedTimestamp) {
      const timestamp = parseInt(savedTimestamp);
      const now = Date.now();
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

  const calculateScore = useCallback((questions: QuizData['quizzes_by_pk']['quiz_questions'], answers: UserAnswers): number => {
    if (!questions.length) return 0;
    const correctAnswers = questions.filter(q => answers[q.id] === q.correct_option).length;
    return Math.round((correctAnswers / questions.length) * 100);
  }, []);

  const handleAnswerSelect = useCallback((questionId: string, selectedOption: string) => {
    const newAnswers = {
      ...userAnswers,
      [questionId]: selectedOption
    };
    setUserAnswers(newAnswers);
    saveAnswersToLocalStorage(newAnswers);
  }, [userAnswers, saveAnswersToLocalStorage]);

  const handleSubmit = useCallback(async (
    questions?: QuizData['quizzes_by_pk']['quiz_questions'],
    moduleId?: string,
    cutoffScore?: number
  ) => {
    if (!questions) return;
    
    const calculatedScore = calculateScore(questions, userAnswers);
    
    try {
      const newStatus = calculatedScore >= (cutoffScore || 0) ? 'passed' : 'failed';

      const result = await updateQuizStatus({
        variables: {
          quizId,
          status: newStatus,
          score: calculatedScore
        }
      });

      if (result.data) {
        setScore(calculatedScore);
        setIsSubmitted(true);
        setShowResults(true);

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
  }, [calculateScore, userAnswers, quizId, updateQuizStatus, updateModuleStatus, refetch]);

  const handleRetake = useCallback(async (moduleId?: string) => {
    try {
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

        await refetch();
      }
    } catch (error) {
      console.error('Error resetting quiz:', error);
    }
  }, [quizId, updateQuizStatus, updateModuleStatus, refetch]);

  const resetQuiz = useCallback(() => {
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    setTimeLeft(QUIZ_TIME_LIMIT);
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setAttempts(prev => prev + 1);
    if (quizId) {
      localStorage.removeItem(`quiz_${quizId}_time`);
      localStorage.removeItem(`quiz_${quizId}_last_timestamp`);
    }
  }, [quizId]);

  // Load saved answers when component mounts
  useEffect(() => {
    const loadSavedAnswers = () => {
      const savedAnswers = loadAnswersFromLocalStorage();
      if (savedAnswers) {
        setUserAnswers(savedAnswers);
        const answeredQuestions = Object.keys(savedAnswers).length;
        if (answeredQuestions > 0) {
          setCurrentQuestionIndex(prev => Math.min(answeredQuestions - 1, prev));
        }
      }
    };

    if (!isSubmitted && !showResults) {
      loadSavedAnswers();
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
    let timerId: number;

    const updateTimer = () => {
      if (!isSubmitted && !showResults) {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          // Save time to localStorage
          if (quizId) {
            localStorage.setItem(`quiz_${quizId}_time`, (prev - 1).toString());
            localStorage.setItem(`quiz_${quizId}_last_timestamp`, Date.now().toString());
          }
          return prev - 1;
        });
        timerId = window.setTimeout(updateTimer, 1000);
      }
    };

    if (!isSubmitted && !showResults) {
      timerId = window.setTimeout(updateTimer, 1000);
    }

    return () => {
      if (timerId) {
        window.clearTimeout(timerId);
      }
    };
  }, [isSubmitted, showResults, quizId, handleSubmit]);

  // Clear time from localStorage when quiz is submitted or retaken
  useEffect(() => {
    if (quizId && (isSubmitted || showResults)) {
      localStorage.removeItem(`quiz_${quizId}_time`);
      localStorage.removeItem(`quiz_${quizId}_last_timestamp`);
    }
  }, [quizId, isSubmitted, showResults]);

  return {
    state: {
      userAnswers,
      isSubmitted,
      score,
      timeLeft,
      currentQuestionIndex,
      showResults,
      attempts
    } as QuizState,
    actions: {
      setUserAnswers,
      setIsSubmitted,
      setScore,
      setTimeLeft,
      setCurrentQuestionIndex,
      setShowResults,
      setAttempts,
      handleAnswerSelect,
      calculateScore,
      resetQuiz,
      handleSubmit,
      handleRetake
    } as QuizActions
  };
}; 