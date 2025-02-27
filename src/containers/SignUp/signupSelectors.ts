import { get } from 'lodash';
import { SignUpState } from '../../types/signupTypes';

interface RootState {
  signup: SignUpState;
}

export const selectSignupState = (state: RootState) => get(state, 'signup', {});

export const selectSignupLoading = (state: RootState) =>
  get(state, 'signup.loading', false);

export const selectSignupError = (state: RootState) =>
  get(state, 'signup.error', null);

export const selectSignupSuccess = (state: RootState) =>
  get(state, 'signup.success', false);
