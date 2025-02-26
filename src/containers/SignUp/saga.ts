import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { SIGNUP_REQUEST } from './constants';
import { signupSuccess, signupError } from './actions';
import { SignUpRequestAction, User } from './types';
import { get, isError } from 'lodash';

function* signUp(action: SignUpRequestAction): Generator<any, void, any> {
  try {
    const response = yield call(axios.post, `${import.meta.env.VITE_API_URL}/auth/signup`, action.payload);
    const user: User = get(response, 'data.user');
    yield put(signupSuccess(user));
  } catch (error: unknown) {
    const errorMessage = isError(error) 
      ? get(error, 'response.data.message', 'An error occurred during signup')
      : 'An error occurred during signup';
    yield put(signupError(errorMessage));
  }
}

export default function* signUpSaga(): Generator<any, void, any> {
  yield takeLatest(SIGNUP_REQUEST, signUp);
} 