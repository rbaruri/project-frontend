import { takeLatest, call, put } from 'redux-saga/effects';
import { api } from '../../api/axios';
import { get } from 'lodash';
import { LOGIN_REQUEST, LOGOUT } from './loginConstants';
import { loginSuccess, loginFailure } from './loginActions';
import { LoginFormData, LoginResponse, User } from '../../types/loginTypes';
import { AxiosResponse } from 'axios';

function* loginSaga(action: { type: string; payload: LoginFormData }) {
  try {
    console.log('Attempting login with payload:', action.payload);
    
    const response: AxiosResponse = yield call(
      api.post,
      '/api/auth/login',
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

    const rawUser = response.data.user;
    
    // Log the received user data for debugging
    console.log('Received user data:', rawUser);

    // Validate all required user fields
    if (!rawUser.id || !rawUser.email || !rawUser.first_name || !rawUser.last_name) {
      console.error('Missing required user fields:', {
        hasId: !!rawUser.id,
        hasEmail: !!rawUser.email,
        hasFirstName: !!rawUser.first_name,
        hasLastName: !!rawUser.last_name
      });
      throw new Error('Missing required user data');
    }

    // Transform the user data
    const user: User = {
      id: rawUser.id,
      userId: rawUser.id, // Use id as userId since they're the same
      email: rawUser.email,
      first_name: rawUser.first_name,
      last_name: rawUser.last_name
    };

    const responseData: LoginResponse = {
      message: response.data.message || 'Login successful',
      user
    };

    console.log('Transformed response data:', responseData);
    yield put(loginSuccess(responseData));
  } catch (error: any) {
    // Enhanced error logging
    console.error('Login error details:', {
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
      error.message || 'An error occurred during login'
    );
    yield put(loginFailure(errorMessage));
  }
}

function* logoutSaga() {
  try {
    yield call(api.post, '/api/auth/logout');
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

export function* watchLoginSaga() {
  yield takeLatest(LOGIN_REQUEST, loginSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}

