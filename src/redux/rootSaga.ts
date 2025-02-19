import { all } from "redux-saga/effects";
import { watchLearningPathSaga } from "../containers/LearningPath/learningPathSaga";
import { syllabusSaga } from "../containers/SyllabusUpload/syllabusSaga";

export function* rootSaga() {
  yield all([
    watchLearningPathSaga(),
    syllabusSaga(),
  ]);
}
