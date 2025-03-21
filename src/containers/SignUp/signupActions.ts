import { SignUpFormData, SignUpResponse } from './signupConstants';
import {
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_RESET,
} from '@/containers/SignUp/signupConstants';

export const signupRequest = (formData: SignUpFormData) => ({
  type: SIGNUP_REQUEST,
  payload: formData,
});

export const signupSuccess = (response: SignUpResponse) => ({
  type: SIGNUP_SUCCESS,
  payload: response,
});

export const signupFailure = (error: string) => ({
  type: SIGNUP_FAILURE,
  payload: error,
});

export const signupReset = () => ({
  type: SIGNUP_RESET,
});
