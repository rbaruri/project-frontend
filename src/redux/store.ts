import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { signUpReducer, signUpSaga } from '../containers/SignUp';
import { syllabusReducer, syllabusSaga } from '../containers/SyllabusUpload';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Root saga
function* rootSaga() {
  yield all([
    signUpSaga(),
    syllabusSaga(),
  ]);
}

// Create store
const store = configureStore({
  reducer: {
    signup: signUpReducer,
    syllabus: syllabusReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

// Run saga middleware
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 