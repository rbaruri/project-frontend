import { useCallback } from 'react';
import { QUIZ_TIME_LIMIT } from '../helper/quizHelper';

interface UserAnswers {
  [questionId: string]: string;
}

export const useQuizStorage = (quizId: string | undefined) => {
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

  const clearLocalStorage = useCallback(() => {
    if (quizId) {
      localStorage.removeItem(`quiz_${quizId}_answers`);
      localStorage.removeItem(`quiz_${quizId}_timestamp`);
    }
  }, [quizId]);

  return {
    saveAnswersToLocalStorage,
    loadAnswersFromLocalStorage,
    clearLocalStorage
  };
}; 