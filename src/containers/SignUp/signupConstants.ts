export const SIGNUP_REQUEST = 'signup/SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'signup/SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'signup/SIGNUP_FAILURE';
export const SIGNUP_RESET = 'signup/SIGNUP_RESET';

export interface SignUpState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface SignUpResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface SignUpError {
  message: string;
  field?: string;
}
