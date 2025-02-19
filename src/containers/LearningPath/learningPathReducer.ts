import { FETCH_LEARNING_PATH_REQUEST, FETCH_LEARNING_PATH_SUCCESS, FETCH_LEARNING_PATH_FAILURE } from "./learningPathConstants";

const initialState = {
  learningPath: null,
  loading: false,
  error: null,
};

export const learningPathReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_LEARNING_PATH_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_LEARNING_PATH_SUCCESS:
      return { ...state, loading: false, learningPath: action.payload };

    case FETCH_LEARNING_PATH_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
