import { QuizSummaryReport } from '@/summary/types';
import {
  GENERATE_SUMMARY,
  GENERATE_SUMMARY_SUCCESS,
  GENERATE_SUMMARY_FAILURE,
  CLEAR_SUMMARY
} from './summaryConstants';

export interface GenerateSummaryAction {
  type: typeof GENERATE_SUMMARY;
  payload: {
    moduleId: string;
    moduleReports: QuizSummaryReport[];
  };
}

export interface GenerateSummarySuccessAction {
  type: typeof GENERATE_SUMMARY_SUCCESS;
  payload: {
    moduleId: string;
    analysis: string;
  };
}

export interface GenerateSummaryFailureAction {
  type: typeof GENERATE_SUMMARY_FAILURE;
  payload: {
    moduleId: string;
    error: string;
  };
}

export interface ClearSummaryAction {
  type: typeof CLEAR_SUMMARY;
}

export type SummaryActionTypes =
  | GenerateSummaryAction
  | GenerateSummarySuccessAction
  | GenerateSummaryFailureAction
  | ClearSummaryAction;

export const generateSummary = (
  moduleId: string,
  moduleReports: QuizSummaryReport[]
): GenerateSummaryAction => ({
  type: GENERATE_SUMMARY,
  payload: {
    moduleId,
    moduleReports
  }
});

export const generateSummarySuccess = (
  moduleId: string,
  analysis: string
): GenerateSummarySuccessAction => ({
  type: GENERATE_SUMMARY_SUCCESS,
  payload: {
    moduleId,
    analysis
  }
});

export const generateSummaryFailure = (
  moduleId: string,
  error: string
): GenerateSummaryFailureAction => ({
  type: GENERATE_SUMMARY_FAILURE,
  payload: {
    moduleId,
    error
  }
});

export const clearSummary = (): ClearSummaryAction => ({
  type: CLEAR_SUMMARY
}); 