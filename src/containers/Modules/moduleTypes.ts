export const FETCH_MODULES_REQUEST = "FETCH_MODULES_REQUEST";
export const FETCH_MODULES_SUCCESS = "FETCH_MODULES_SUCCESS";
export const FETCH_MODULES_FAILURE = "FETCH_MODULES_FAILURE";

export interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  hoursRequired: string;
  startDate: string;
  endDate: string;
  status: string;
  resources?: {
    sources: Array<{ name: string; url: string }>;
    similarQuestions: string[];
  };
  quiz?: Array<{ question: string; options: string[]; correctAnswer: string }>;
}

export interface ModuleState {
  modules: Module[];
  loading: boolean;
  error: string | null;
}

interface FetchModulesRequestAction {
  type: typeof FETCH_MODULES_REQUEST;
}

interface FetchModulesSuccessAction {
  type: typeof FETCH_MODULES_SUCCESS;
  payload: Module[];
}

interface FetchModulesFailureAction {
  type: typeof FETCH_MODULES_FAILURE;
  payload: string;
}

export type ModuleActionTypes =
  | FetchModulesRequestAction
  | FetchModulesSuccessAction
  | FetchModulesFailureAction;
