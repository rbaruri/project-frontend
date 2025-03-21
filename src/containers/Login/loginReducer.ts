import { produce } from 'immer';
import { LoginState, LoginAction } from './loginConstants';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_RESET,
  LOGOUT,
  UPDATE_AUTH_CONTEXT,
} from '@/containers/Login/loginConstants';

const initialState: LoginState = {
  loading: false,
  error: null,
  success: false,
  token: null,
  user: null,
  isAuthenticated: false,
  authUpdateAction: null
};

const loginReducer = (state = initialState, action: LoginAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOGIN_REQUEST:
        draft.loading = true;
        draft.error = null;
        draft.success = false;
        break;

      case LOGIN_SUCCESS:
        draft.loading = true; // Keep loading true for transition
        draft.error = null;
        draft.success = true;
        draft.token = action.payload.token;
        draft.user = action.payload.user;
        draft.isAuthenticated = true;
        break;

      case LOGIN_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        draft.success = false;
        draft.token = null;
        draft.user = null;
        draft.isAuthenticated = false;
        break;

      case UPDATE_AUTH_CONTEXT:
        draft.authUpdateAction = {
          type: UPDATE_AUTH_CONTEXT,
          payload: action.payload
        };
        break;

      case LOGOUT:
        draft.authUpdateAction = {
          type: LOGOUT
        };
        return initialState;

      case LOGIN_RESET:
        return initialState;

      default:
        break;
    }
  });

export default loginReducer;
