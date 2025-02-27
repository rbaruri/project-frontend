import { produce } from 'immer';
import { LoginState } from '../../types/loginTypes';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_RESET,
  LOGOUT,
} from './loginConstants';

const initialState: LoginState = {
  loading: false,
  error: null,
  success: false,
  token: null,
  user: null,
};

const loginReducer = (state = initialState, action: any) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOGIN_REQUEST:
        draft.loading = true;
        draft.error = null;
        draft.success = false;
        break;

      case LOGIN_SUCCESS:
        draft.loading = false;
        draft.error = null;
        draft.success = true;
        draft.token = action.payload.token;
        draft.user = action.payload.user;
        break;

      case LOGIN_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        draft.success = false;
        draft.token = null;
        draft.user = null;
        break;

      case LOGIN_RESET:
      case LOGOUT:
        return initialState;

      default:
        break;
    }
  });

export default loginReducer;
