import { LoginFormData, LoginResponse, User } from './loginConstants';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_RESET,
  LOGOUT,
  UPDATE_AUTH_CONTEXT,
} from '@/containers/Login/loginConstants';

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

export const updateAuthContext = (user: User) => ({
  type: UPDATE_AUTH_CONTEXT,
  payload: user,
});
