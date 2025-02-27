import { 
  SIGNUP_REQUEST, 
  SIGNUP_SUCCESS, 
  SIGNUP_ERROR,
  RESET_SIGNUP_STATE
} from './constants';
import { SignUpState, SignUpActionTypes, SignUpSuccessAction, SignUpErrorAction } from './types';
import { produce } from 'immer';
import { isNull } from 'lodash';

const initialState: SignUpState = {
  loading: false,
  error: null,
  user: null,
};

const isSignUpSuccessAction = (action: SignUpActionTypes): action is SignUpSuccessAction => 
  action.type === SIGNUP_SUCCESS;

const isSignUpErrorAction = (action: SignUpActionTypes): action is SignUpErrorAction =>
  action.type === SIGNUP_ERROR;

const signUpReducer = (
  state = initialState, 
  action: SignUpActionTypes
): SignUpState => {
  return produce(state, draft => {
    switch (action.type) {
      case SIGNUP_REQUEST:
        draft.loading = true;
        draft.error = null;
        break;
        
      case SIGNUP_SUCCESS:
        if (isSignUpSuccessAction(action)) {
          draft.loading = false;
          draft.user = action.payload;
          draft.error = null;
        }
        break;
        
      case SIGNUP_ERROR:
        if (isSignUpErrorAction(action)) {
          draft.loading = false;
          draft.error = action.payload;
          if (!isNull(draft.user)) {
            draft.user = null;
          }
        }
        break;
        
      case RESET_SIGNUP_STATE:
        return initialState;
    }
  });
};

export default signUpReducer; 