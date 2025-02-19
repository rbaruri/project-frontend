import {
    FETCH_MODULES_REQUEST,
    FETCH_MODULES_SUCCESS,
    FETCH_MODULES_FAILURE,
    Module,
    ModuleActionTypes,
  } from "./moduleTypes";
  
  export const fetchModulesRequest = (): ModuleActionTypes => ({
    type: FETCH_MODULES_REQUEST,
  });
  
  export const fetchModulesSuccess = (modules: Module[]): ModuleActionTypes => ({
    type: FETCH_MODULES_SUCCESS,
    payload: modules,
  });
  
  export const fetchModulesFailure = (error: string): ModuleActionTypes => ({
    type: FETCH_MODULES_FAILURE,
    payload: error,
  });
  