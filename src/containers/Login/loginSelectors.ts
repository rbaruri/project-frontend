import { get } from 'lodash';
import { LoginState } from './loginTypes';

interface RootState {
  login: LoginState;
}

export const selectLoginState = (state: RootState) => get(state, 'login', {});

export const selectLoginLoading = (state: RootState) =>
  get(state, 'login.loading', false);

export const selectLoginError = (state: RootState) =>
  get(state, 'login.error', null);

export const selectLoginSuccess = (state: RootState) =>
  get(state, 'login.success', false);

export const selectLoginToken = (state: RootState) =>
  get(state, 'login.token', null);

export const selectLoginUser = (state: RootState) =>
  get(state, 'login.user', null);
