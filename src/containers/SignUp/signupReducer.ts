import { produce } from 'immer';
import { SignUpState } from '@/types/signupTypes';
import {
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_RESET,
} from '@/containers/SignUp/signupConstants';

const initialState: SignUpState = {
  loading: false,
  error: null,
  success: false,
};

const signupReducer = (state = initialState, action: any) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SIGNUP_REQUEST:
        draft.loading = true;
        draft.error = null;
        draft.success = false;
        break;

      case SIGNUP_SUCCESS:
        draft.loading = true;
        draft.error = null;
        draft.success = true;
        break;

      case SIGNUP_FAILURE:
        draft.loading = false;
        draft.error = action.payload;
        draft.success = false;
        break;

      case SIGNUP_RESET:
        return initialState;

      default:
        break;
    }
  });

export default signupReducer;
