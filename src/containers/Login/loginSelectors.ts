import { get } from 'lodash';
import { LoginState } from '../../types/loginTypes';
import { RootState } from '../../store/types';

interface RootState {
  login: LoginState;
}

const selectLoginState = (state: RootState) => state.login;

export const selectLoginLoading = (state: RootState) => selectLoginState(state).loading;
export const selectLoginError = (state: RootState) => selectLoginState(state).error;
export const selectLoginSuccess = (state: RootState) => selectLoginState(state).success;
export const selectLoginData = (state: RootState) => selectLoginState(state).data;

export const selectLoginToken = (state: RootState) =>
  get(state, 'login.token', null);

export const selectLoginUser = (state: RootState) =>
  get(state, 'login.user', null);
