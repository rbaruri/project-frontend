import { produce } from 'immer';
import { QuizState } from '@/types/quizTypes';
import {
  FETCH_QUIZ_REQUEST,
  FETCH_QUIZ_SUCCESS,
  FETCH_QUIZ_FAILURE,
  SET_CURRENT_QUESTION,
  SET_USER_ANSWER,
  SET_QUIZ_SUBMITTED,
  SET_SHOW_RESULTS,
  SET_QUIZ_SCORE,
  UPDATE_TIME_LEFT,
  RESET_QUIZ,
} from '@/containers/Quiz/quizConstants';

const initialState: QuizState = {
  loading: false,
  error: null,
  data: null,
  nextModule: null,
  currentQuestionIndex: 0,
  userAnswers: {},
  timeLeft: 3600, // 1 hour in seconds
  score: 0,
  isSubmitted: false,
  showResults: false,
  attempts: 0,
};

const quizReducer = (state = initialState, action: any) =>
  produce(state, (draft) => {
    switch (action.type) {
      case FETCH_QUIZ_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;

      case FETCH_QUIZ_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.data = action.payload;
        draft.attempts = draft.attempts + 1;
        break;

      case FETCH_QUIZ_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        break;

      case SET_CURRENT_QUESTION:
        draft.currentQuestionIndex = action.payload;
        break;

      case SET_USER_ANSWER:
        draft.userAnswers[action.payload.questionId] = action.payload.answer;
        break;

      case SET_QUIZ_SUBMITTED:
        draft.isSubmitted = action.payload;
        break;

      case SET_SHOW_RESULTS:
        draft.showResults = action.payload;
        break;

      case SET_QUIZ_SCORE:
        draft.score = action.payload;
        break;

      case UPDATE_TIME_LEFT:
        draft.timeLeft = action.payload;
        break;

      case RESET_QUIZ:
        return {
          ...initialState,
          attempts: state.attempts + 1,
        };

      default:
        break;
    }
  });

export default quizReducer;
