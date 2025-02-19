import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { learningPathReducer } from "../containers/LearningPath/learningPathReducer";
import { syllabusReducer } from "../containers/SyllabusUpload/syllabusReducer"; // Import syllabus reducer
import { rootSaga } from "./rootSaga"; // Import rootSaga

// Create Saga Middleware
const sagaMiddleware = createSagaMiddleware();

// Combine Reducers
const rootReducer = combineReducers({
  learningPath: learningPathReducer,
  syllabus: syllabusReducer, // Add syllabus reducer
});

// Create Store with Middleware
export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

// Run Root Saga
sagaMiddleware.run(rootSaga);

// Define RootState Type
export type RootState = ReturnType<typeof rootReducer>;
