import { all } from "redux-saga/effects";
import { watchLearningPathSaga } from "../containers/LearningPath/learningPathSaga";
import { watchSyllabusSaga } from "../containers/SyllabusUpload/syllabusSaga";
import { moduleSaga } from "../containers/Modules/moduleSaga";
import { watchQuizSaga } from "../containers/Quiz/quizSaga";

export default function* rootSaga() {
  yield all([
    watchLearningPathSaga(),
    watchSyllabusSaga(),
    moduleSaga(),
    watchQuizSaga(),
  ]);
}
