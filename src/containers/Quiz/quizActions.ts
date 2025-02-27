import {
  FETCH_QUIZ_REQUEST,
  FETCH_QUIZ_SUCCESS,
  FETCH_QUIZ_FAILURE,
  SET_CURRENT_QUESTION,
  SET_USER_ANSWER,
  UPDATE_QUIZ_STATUS_REQUEST,
  UPDATE_QUIZ_STATUS_SUCCESS,
  UPDATE_QUIZ_STATUS_FAILURE,
  SET_QUIZ_SUBMITTED,
  SET_SHOW_RESULTS,
  SET_QUIZ_SCORE,
  UPDATE_TIME_LEFT,
  RESET_QUIZ,
} from './quizConstants';

import { 
  QuizData, 
  UpdateQuizStatusPayload
} from './quizTypes';

// Quiz Data Loading Actions
export const fetchQuizRequest = (quizId: string) => ({
  type: FETCH_QUIZ_REQUEST,
  payload: quizId,
});

export const fetchQuizSuccess = (data: QuizData) => ({
  type: FETCH_QUIZ_SUCCESS,
  payload: data,
});

export const fetchQuizFailure = (error: string) => ({
  type: FETCH_QUIZ_FAILURE,
  payload: error,
});

// Quiz Navigation Actions
export const setCurrentQuestion = (index: number) => ({
  type: SET_CURRENT_QUESTION,
  payload: index,
});

export const setUserAnswer = (questionId: string, answer: string) => ({
  type: SET_USER_ANSWER,
  payload: { questionId, answer },
});

// Quiz Status Actions
export const updateQuizStatusRequest = (payload: UpdateQuizStatusPayload) => ({
  type: UPDATE_QUIZ_STATUS_REQUEST,
  payload,
});

export const updateQuizStatusSuccess = () => ({
  type: UPDATE_QUIZ_STATUS_SUCCESS,
});

export const updateQuizStatusFailure = (error: string) => ({
  type: UPDATE_QUIZ_STATUS_FAILURE,
  payload: error,
});

// Quiz State Actions
export const setQuizSubmitted = (isSubmitted: boolean) => ({
  type: SET_QUIZ_SUBMITTED,
  payload: isSubmitted,
});

export const setShowResults = (show: boolean) => ({
  type: SET_SHOW_RESULTS,
  payload: show,
});

export const setQuizScore = (score: number) => ({
  type: SET_QUIZ_SCORE,
  payload: score,
});

export const updateTimeLeft = (timeLeft: number) => ({
  type: UPDATE_TIME_LEFT,
  payload: timeLeft,
});

export const resetQuiz = () => ({
  type: RESET_QUIZ,
});
