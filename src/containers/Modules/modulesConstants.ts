// Action Types
export const FETCH_MODULES_REQUEST = 'FETCH_MODULES_REQUEST';
export const FETCH_MODULES_SUCCESS = 'FETCH_MODULES_SUCCESS';
export const FETCH_MODULES_FAILURE = 'FETCH_MODULES_FAILURE';
export const SET_CURRENT_MODULE = 'SET_CURRENT_MODULE';
export const UPDATE_MODULE_STATUS = 'UPDATE_MODULE_STATUS';

export interface Module {
  id: string;
  title: string;
  description: string;
  courseId: string;
  order: number;
  status: 'not_started' | 'in_progress' | 'completed';
  content?: string;
  quiz?: {
    id: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  };
}

export interface ModuleState {
  modules: Module[];
  loading: boolean;
  error: string | null;
  currentModuleIndex: number;
}

export interface ModuleResponse {
  id: string;
  title: string;
  description: string;
  content: string;
  status: string;
  quiz: {
    id: string;
    status: string;
  };
}

export interface UpdateModuleStatusPayload {
  moduleId: string;
  status: string;
}

// Action Interfaces
export interface FetchModulesRequestAction {
  type: typeof FETCH_MODULES_REQUEST;
}

export interface FetchModulesSuccessAction {
  type: typeof FETCH_MODULES_SUCCESS;
  payload: Module[];
}

export interface FetchModulesFailureAction {
  type: typeof FETCH_MODULES_FAILURE;
  payload: string;
}

export interface SetCurrentModuleAction {
  type: typeof SET_CURRENT_MODULE;
  payload: number;
}

export interface UpdateModuleStatusAction {
  type: typeof UPDATE_MODULE_STATUS;
  payload: UpdateModuleStatusPayload;
}

export type ModuleActionTypes =
  | FetchModulesRequestAction
  | FetchModulesSuccessAction
  | FetchModulesFailureAction
  | SetCurrentModuleAction
  | UpdateModuleStatusAction;
