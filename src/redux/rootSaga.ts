import { all } from "redux-saga/effects";
import { watchLearningPathSaga } from "@/containers/LearningPath/learningPathSaga";
import { watchSyllabusSaga } from "@/containers/SyllabusUpload/syllabusSaga";
import { moduleSaga } from "@/containers/Modules/moduleSaga";
import { watchQuizSaga } from "@/containers/Quiz/quizSaga";
import { watchLoginSaga } from "@/containers/Login/loginSaga";
import { watchSignupSaga } from "@/containers/SignUp/signupSaga";
import { watchSummary } from "@/containers/SummaryReport/summaryIndex";

export default function* rootSaga() {
  yield all([
    watchLearningPathSaga(),
    syllabusSaga(),
    moduleSaga(),
    watchQuizSaga(),
    watchLoginSaga(),
    watchSignupSaga(),
    watchSummary(),
  ]);
}
