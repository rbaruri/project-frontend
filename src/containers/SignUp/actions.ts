import { 
  SIGNUP_REQUEST, 
  SIGNUP_SUCCESS, 
  SIGNUP_ERROR,
  RESET_SIGNUP_STATE
} from './constants';
import { 
  SignUpFormData, 
  User, 
  SignUpRequestAction, 
  SignUpSuccessAction, 
  SignUpErrorAction,
  ResetSignUpStateAction
} from './types';

export const signupRequest = (data: Omit<SignUpFormData, 'confirmPassword'>): SignUpRequestAction => ({
  type: SIGNUP_REQUEST,
  payload: data,
});

export const signupSuccess = (user: User): SignUpSuccessAction => ({
  type: SIGNUP_SUCCESS,
  payload: user,
});

export const signupError = (error: string): SignUpErrorAction => ({
  type: SIGNUP_ERROR,
  payload: error,
});

export const resetSignupState = (): ResetSignUpStateAction => ({
  type: RESET_SIGNUP_STATE,
}); 