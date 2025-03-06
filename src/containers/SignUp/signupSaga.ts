import { takeLatest, call, put } from 'redux-saga/effects';
import { api } from '@/api/axios';
import { get } from 'lodash';
import { SIGNUP_REQUEST } from '@/containers/SignUp/signupConstants';
import { signupSuccess, signupFailure } from '@/containers/SignUp/signupActions';
import { SignUpFormData, SignUpResponse } from './signupConstants';
import { AxiosResponse } from 'axios';

function* signupSaga(action: { type: string; payload: SignUpFormData }) {
  try {
    console.log('Attempting signup with payload:', action.payload);

    const response: AxiosResponse<SignUpResponse> = yield call(
      api.post,
      '/api/auth/signup',
      action.payload
    );

    console.log('Raw API response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });

    // Check if response exists and has user data
    if (!response?.data?.user) {
      console.error('Invalid response structure:', response?.data);
      throw new Error('Invalid response from server');
    }

    console.log('Signup successful, dispatching success action');
    yield put(signupSuccess(response.data));
  } catch (error: any) {
    // Enhanced error logging
    console.error('Signup error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      fullUrl: `${error.config?.baseURL || ''}${error.config?.url || ''}`,
      requestData: error.config?.data
    });

    const errorMessage = get(
      error,
      'response.data.message',
      error.message || 'An error occurred during signup'
    );
    yield put(signupFailure(errorMessage));
  }
}

export function* watchSignupSaga() {
  yield takeLatest(SIGNUP_REQUEST, signupSaga);
}
