import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";

// Create Saga Middleware
const sagaMiddleware = createSagaMiddleware();

// Create Store with Middleware
export const store = createStore(   //configureStore 
  rootReducer,
  compose(
    applyMiddleware(sagaMiddleware),
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
