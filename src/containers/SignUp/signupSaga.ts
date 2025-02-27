import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import { get } from 'lodash';
import { SIGNUP_REQUEST } from './signupConstants';
import { signupSuccess, signupFailure } from './signupActions';
import { SignUpFormData, SignUpResponse } from '../../types/signupTypes';

function* signupSaga(action: { type: string; payload: SignUpFormData }) {
  try {
    const response: { data: SignUpResponse } = yield call(axios.post, 
      `${import.meta.env.VITE_API_URL}/signup`,
      action.payload
    );

    yield put(signupSuccess(response.data));
  } catch (error: any) {
    const errorMessage = get(error, 'response.data.message', 'An error occurred during signup');
    yield put(signupFailure(errorMessage));
  }
}

export function* watchSignupSaga() {
  yield takeLatest(SIGNUP_REQUEST, signupSaga);
}
