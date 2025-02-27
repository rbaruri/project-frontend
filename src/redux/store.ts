import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { learningPathReducer } from "../containers/LearningPath/learningPathReducer";
import { syllabusReducer } from "../containers/SyllabusUpload/syllabusReducer";
import moduleReducer from "../containers/Modules/moduleReducer";
import quizReducer from "../containers/Quiz/quizReducer";
import loginReducer from "../containers/Login/loginReducer";
import { signupReducer } from "../containers/SignUp/signupIndex";
import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";

// Create Saga Middleware
const sagaMiddleware = createSagaMiddleware();

// Create Store with Middleware
export const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(sagaMiddleware),
    // Enable Redux DevTools if available
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? 
    (window as any).__REDUX_DEVTOOLS_EXTENSION__() : 
    (f: any) => f
  )
);

// Run Root Saga
sagaMiddleware.run(rootSaga);

// Export types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
