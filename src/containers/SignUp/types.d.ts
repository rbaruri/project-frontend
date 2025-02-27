// State Types
export interface SignUpState {
  loading: boolean;
  error: string | null;
  user: User | null;
}

// User Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
}

// Form Data Types
export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

// Action Types
export interface SignUpRequestAction {
  type: typeof SIGNUP_REQUEST;
  payload: Omit<SignUpFormData, 'confirmPassword'>;
  [key: string]: any;
}

export interface SignUpSuccessAction {
  type: typeof SIGNUP_SUCCESS;
  payload: User;
  [key: string]: any;
}

export interface SignUpErrorAction {
  type: typeof SIGNUP_ERROR;
  payload: string;
  [key: string]: any;
}

export interface ResetSignUpStateAction {
  type: typeof RESET_SIGNUP_STATE;
  [key: string]: any;
}

export type SignUpActionTypes = 
  | SignUpRequestAction 
  | SignUpSuccessAction 
  | SignUpErrorAction 
  | ResetSignUpStateAction;

// Selector Types
export interface RootState {
  signup: SignUpState;
} 