import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { get } from 'lodash';
import { LOGIN_REQUEST, LOGOUT } from './loginConstants';
import { loginSuccess, loginFailure } from './loginActions';
import { LoginFormData, LoginResponse } from './loginTypes';

function* loginSaga(action: { type: string; payload: LoginFormData }) {
  try {
    const response: { data: LoginResponse } = yield call(
      axios.post,
      `${import.meta.env.VITE_API_URL}/auth/login`,
      action.payload
    );

    // Store token in localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    yield put(loginSuccess(response.data));
  } catch (error: any) {
    const errorMessage = get(error, 'response.data.message', 'An error occurred during login');
    yield put(loginFailure(errorMessage));
  }
}

function* logoutSaga() {
  try {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

export function* watchLoginSaga() {
  yield takeLatest(LOGIN_REQUEST, loginSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}
