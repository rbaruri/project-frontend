export const LOGIN_REQUEST = 'login/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'login/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'login/LOGIN_FAILURE';
export const LOGIN_RESET = 'login/LOGIN_RESET';
export const LOGOUT = 'login/LOGOUT';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export interface LoginState {
  isAuthenticated: boolean;
  user: LoginResponse['user'] | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface LoginError {
  message: string;
  field?: string;
}

export interface User {
  id: string;
  userId: string;
  email: string;
  first_name: string;
  last_name: string;
}

export type LoginAction =
  | { type: 'login/LOGIN_REQUEST'; payload: LoginFormData }
  | { type: 'login/LOGIN_SUCCESS'; payload: LoginResponse }
  | { type: 'login/LOGIN_FAILURE'; payload: string }
  | { type: 'login/LOGIN_RESET' }
  | { type: 'login/LOGOUT' }; 