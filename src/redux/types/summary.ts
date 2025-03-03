export const GENERATE_MODULE_SUMMARY = 'GENERATE_MODULE_SUMMARY';
export const GENERATE_MODULE_SUMMARY_SUCCESS = 'GENERATE_MODULE_SUMMARY_SUCCESS';
export const GENERATE_MODULE_SUMMARY_FAILURE = 'GENERATE_MODULE_SUMMARY_FAILURE';

export interface GenerateModuleSummaryAction {
  type: typeof GENERATE_MODULE_SUMMARY;
  payload: {
    moduleId: string;
    moduleReports: any[];
  };
}

export interface GenerateModuleSummarySuccessAction {
  type: typeof GENERATE_MODULE_SUMMARY_SUCCESS;
  payload: {
    moduleId: string;
    analysis: string;
  };
}

export interface GenerateModuleSummaryFailureAction {
  type: typeof GENERATE_MODULE_SUMMARY_FAILURE;
  payload: {
    moduleId: string;
    error: string;
  };
}

export type SummaryActionTypes =
  | GenerateModuleSummaryAction
  | GenerateModuleSummarySuccessAction
  | GenerateModuleSummaryFailureAction; 