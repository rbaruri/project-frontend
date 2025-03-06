import { RootState } from '@/redux/rootReducer';
import { SignUpState } from './signupConstants';

const initialState: SignUpState = {
  loading: false,
  error: null,
  success: false,
};

const selectSignupState = (state: RootState): SignUpState => 
  state.signup || initialState;

export const selectSignupLoading = (state: RootState): boolean => 
  selectSignupState(state).loading;

export const selectSignupError = (state: RootState): string | null => 
  selectSignupState(state).error;

export const selectSignupSuccess = (state: RootState): boolean => 
  selectSignupState(state).success;
