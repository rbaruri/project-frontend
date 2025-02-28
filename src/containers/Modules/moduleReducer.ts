import {
    FETCH_MODULES_REQUEST,
    FETCH_MODULES_SUCCESS,
    FETCH_MODULES_FAILURE,
    ModuleState,
    ModuleActionTypes,
  } from "@/types/moduleTypes";
  
  const initialState: ModuleState = {
    modules: [],
    loading: false,
    error: null,
  };
  
  const moduleReducer = (state = initialState, action: ModuleActionTypes): ModuleState => {
    switch (action.type) {
      case FETCH_MODULES_REQUEST:
        return { ...state, loading: true, error: null };
  
      case FETCH_MODULES_SUCCESS:
        return { ...state, modules: action.payload, loading: false };
  
      case FETCH_MODULES_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };
  
  export default moduleReducer;
  