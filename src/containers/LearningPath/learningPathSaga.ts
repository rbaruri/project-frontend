import { call, put, takeLatest } from "redux-saga/effects";
import { FETCH_LEARNING_PATH_REQUEST } from "./learningPathConstants";
import { fetchLearningPathSuccess, fetchLearningPathFailure } from "./learningPathActions";
import { api } from "../../api/axios";

function* fetchLearningPathSaga(action: any): Generator<any, void, any> {
  try {
    const { userId } = action.payload;
    const { data } = yield call(api.get, `/api/learning-path/${userId}`);

    if (!data) {
      throw new Error("No learning path found");
    }

    yield put(fetchLearningPathSuccess(data));
  } catch (error: any) {
    yield put(fetchLearningPathFailure(error.message || "Failed to fetch learning path"));
  }
}

export function* watchLearningPathSaga() {
  yield takeLatest(FETCH_LEARNING_PATH_REQUEST, fetchLearningPathSaga);
}
