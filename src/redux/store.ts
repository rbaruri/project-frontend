import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { signUpReducer, signUpSaga } from '../containers/SignUp';
import { syllabusReducer, syllabusSaga } from '../containers/SyllabusUpload';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Combine Reducers
const rootReducer = combineReducers({
  learningPath: learningPathReducer,
  syllabus: syllabusReducer,
  modules: moduleReducer,
  quiz: quizReducer, 
});

// Run saga middleware
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 