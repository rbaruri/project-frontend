import { call, put, takeLatest } from "redux-saga/effects";
import { FETCH_LEARNING_PATH_REQUEST, FETCH_LEARNING_PATH_SUCCESS, FETCH_LEARNING_PATH_FAILURE } from "./learningPathConstants";
import { GET_USER_LEARNING_PATHS } from "../../graphql/queries";
import { fetchLearningPathSuccess, fetchLearningPathFailure } from "./learningPathActions";
import { client } from "../../api/apolloClient";

function* fetchLearningPathSaga(action: any) {
  try {
    const { userId } = action.payload;
    const { data } = yield call(client.query, {
      query: GET_USER_LEARNING_PATHS,
      variables: { userId },
      fetchPolicy: "network-only",
    });

    if (!data?.learning_paths?.length) {
      throw new Error("No learning paths found");
    }

    yield put(fetchLearningPathSuccess(data.learning_paths[0]));
  } catch (error: any) {
    yield put(fetchLearningPathFailure(error.message || "Failed to fetch learning path"));
  }
}

export function* watchLearningPathSaga() {
  yield takeLatest(FETCH_LEARNING_PATH_REQUEST, fetchLearningPathSaga);
}
