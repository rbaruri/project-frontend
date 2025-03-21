import { get } from 'lodash';
import { LoginState } from './loginConstants';

interface RootState {
  login: LoginState;
}

const selectLoginState = (state: RootState) => state.login;

export const selectLoginLoading = (state: RootState) => selectLoginState(state).loading;
export const selectLoginError = (state: RootState) => selectLoginState(state).error;
export const selectLoginSuccess = (state: RootState) => selectLoginState(state).success;

export const selectLoginToken = (state: RootState) =>
  get(state, 'login.token', null);

export const selectLoginUser = (state: RootState) =>
  get(state, 'login.user', null);

export const selectIsAuthenticated = (state: RootState) => 
  !!selectLoginToken(state) && !!selectLoginUser(state);
