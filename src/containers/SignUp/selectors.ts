import { createSelector } from '@reduxjs/toolkit';
import { RootState, SignUpState, User } from './types';
import { get } from 'lodash';

const selectSignUpDomain = (state: RootState): SignUpState => 
  get(state, 'signup', { loading: false, error: null, user: null });

export const selectSignUpLoading = createSelector(
  [selectSignUpDomain],
  (signupState: SignUpState): boolean => get(signupState, 'loading', false)
);

export const selectSignUpError = createSelector(
  [selectSignUpDomain],
  (signupState: SignUpState): string | null => get(signupState, 'error', null)
);

export const selectSignUpUser = createSelector(
  [selectSignUpDomain],
  (signupState: SignUpState): User | null => get(signupState, 'user', null)
); 