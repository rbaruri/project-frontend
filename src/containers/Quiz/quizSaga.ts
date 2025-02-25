import { call, put, takeLatest } from "redux-saga/effects";
import { FETCH_QUIZ_REQUEST, fetchQuizSuccess, fetchQuizFailure } from "./quizActions";

const fetchQuizAPI = async () => {
  const response = await fetch("/api/quiz");
  if (!response.ok) throw new Error("Failed to fetch quiz");
  return response.json();
};

function* fetchQuizSaga(): Generator<any, void, any> {
  try {
    const data = yield call(fetchQuizAPI);
    yield put(fetchQuizSuccess(data));
  } catch (error: any) {
    yield put(fetchQuizFailure(error.message));
  }
}

export function* watchQuizSaga() {
  yield takeLatest(FETCH_QUIZ_REQUEST, fetchQuizSaga);
}
