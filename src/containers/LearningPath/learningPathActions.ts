import { FETCH_LEARNING_PATH_REQUEST, FETCH_LEARNING_PATH_SUCCESS, FETCH_LEARNING_PATH_FAILURE } from "../LearningPath/learningPathConstants";

export const fetchLearningPathRequest = (userId: string) => ({
  type: FETCH_LEARNING_PATH_REQUEST,
  payload: { userId },
});

export const fetchLearningPathSuccess = (learningPath: any) => ({
  type: FETCH_LEARNING_PATH_SUCCESS,
  payload: learningPath,
});

export const fetchLearningPathFailure = (error: string) => ({
  type: FETCH_LEARNING_PATH_FAILURE,
  payload: error,
});
