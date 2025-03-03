import { get } from 'lodash';
import { QuizState } from '@/components/quiz/types';

interface RootState {
  quiz: QuizState;
}

export const selectQuizState = (state: RootState) => get(state, 'quiz', {});

export const selectQuizLoading = (state: RootState) =>
  get(state, 'quiz.loading', false);

export const selectQuizError = (state: RootState) =>
  get(state, 'quiz.error', null);

export const selectQuizData = (state: RootState) =>
  get(state, 'quiz.data', null);

export const selectNextModule = (state: RootState) =>
  get(state, 'quiz.nextModule', null);

export const selectCurrentQuestionIndex = (state: RootState) =>
  get(state, 'quiz.currentQuestionIndex', 0);

export const selectUserAnswers = (state: RootState) =>
  get(state, 'quiz.userAnswers', {});

export const selectTimeLeft = (state: RootState) =>
  get(state, 'quiz.timeLeft', 3600);

export const selectQuizScore = (state: RootState) =>
  get(state, 'quiz.score', 0);

export const selectIsSubmitted = (state: RootState) =>
  get(state, 'quiz.isSubmitted', false);

export const selectShowResults = (state: RootState) =>
  get(state, 'quiz.showResults', false);

export const selectAttempts = (state: RootState) =>
  get(state, 'quiz.attempts', 0);
