import { FETCH_QUIZ_REQUEST, FETCH_QUIZ_SUCCESS, FETCH_QUIZ_FAILURE } from "./quizActions";

const initialState = {
  quiz: [],
  loading: false,
  error: null,
};

const quizReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_QUIZ_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_QUIZ_SUCCESS:
      return { ...state, loading: false, quiz: action.payload };
    case FETCH_QUIZ_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default quizReducer;
