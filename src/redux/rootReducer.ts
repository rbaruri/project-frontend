import { combineReducers } from "redux";
import { syllabusReducer } from "../containers/SyllabusUpload/syllabusReducer";

const rootReducer = combineReducers({
  syllabus: syllabusReducer,
  // Add more reducers here as needed
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
