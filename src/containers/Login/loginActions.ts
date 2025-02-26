import { LoginFormData, LoginResponse } from './loginTypes';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_RESET,
  LOGOUT,
} from './loginConstants';

export const loginRequest = (formData: LoginFormData) => ({
  type: LOGIN_REQUEST,
  payload: formData,
});

export const loginSuccess = (response: LoginResponse) => ({
  type: LOGIN_SUCCESS,
  payload: response,
});

export const loginFailure = (error: string) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const loginReset = () => ({
  type: LOGIN_RESET,
});

export const logout = () => ({
  type: LOGOUT,
});
