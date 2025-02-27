import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { learningPathReducer } from "../containers/LearningPath/learningPathReducer";
import { syllabusReducer } from "../containers/SyllabusUpload/syllabusReducer";
import moduleReducer from "../containers/Modules/moduleReducer";
import quizReducer from "../containers/Quiz/quizReducer";
import rootSaga from "./rootSaga";

// Create Saga Middleware
const sagaMiddleware = createSagaMiddleware();

// Combine Reducers
const rootReducer = combineReducers({
  learningPath: learningPathReducer,
  syllabus: syllabusReducer,
  modules: moduleReducer,
  quiz: quizReducer, 
});

// Enable Redux DevTools if available
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;  //hit and try check without 

// Create Store with Middleware
export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

// Run Root Saga
sagaMiddleware.run(rootSaga);

// Define RootState Type
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
