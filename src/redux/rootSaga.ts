import { all } from "redux-saga/effects";
import { syllabusSaga } from "../containers/SyllabusUpload/syllabusSaga";

export function* rootSaga() {
  yield all([
    syllabusSaga(),
    // Add more sagas here as needed
  ]);
}
