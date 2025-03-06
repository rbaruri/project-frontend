import {
    FETCH_MODULES_REQUEST,
    FETCH_MODULES_SUCCESS,
    FETCH_MODULES_FAILURE,
    Module,
    FetchModulesRequestAction,
    FetchModulesSuccessAction,
    FetchModulesFailureAction
} from "./modulesConstants";
  
  export const fetchModulesRequest = (): FetchModulesRequestAction => ({
    type: FETCH_MODULES_REQUEST,
  });
  
  export const fetchModulesSuccess = (modules: Module[]): FetchModulesSuccessAction => ({
    type: FETCH_MODULES_SUCCESS,
    payload: modules,
  });
  
  export const fetchModulesFailure = (error: string): FetchModulesFailureAction => ({
    type: FETCH_MODULES_FAILURE,
    payload: error,
  });
  