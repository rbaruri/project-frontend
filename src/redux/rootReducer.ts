import { combineReducers } from "redux";
import { syllabusReducer } from "@/containers/SyllabusUpload/syllabusReducer";
import { signupReducer } from "@/containers/SignUp/signupIndex";
import { loginReducer } from "@/containers/Login/loginIndex";
import { learningPathReducer } from "@/containers/LearningPath/learningPathReducer";
import moduleReducer from "@/containers/Modules/moduleReducer";
import quizReducer from "@/containers/Quiz/quizReducer";

const rootReducer = combineReducers({
  syllabus: syllabusReducer,
  signup: signupReducer,
  login: loginReducer,
  learningPath: learningPathReducer,
  modules: moduleReducer,
  quiz: quizReducer,
  // Add more reducers here as needed
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
