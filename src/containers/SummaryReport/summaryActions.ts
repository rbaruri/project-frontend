import { QuizSummaryReport, StructuredAnalysis } from '@/components/quiz/SummaryReport/types';
import {
  GENERATE_SUMMARY,
  GENERATE_SUMMARY_SUCCESS,
  GENERATE_SUMMARY_FAILURE,
  CLEAR_SUMMARY
} from '@/containers/SummaryReport/summaryConstants';

// Define UUID type for clarity
export type UUID = string;

export interface GenerateSummaryAction {
  type: typeof GENERATE_SUMMARY;
  payload: {
    moduleId: UUID;
    moduleReports: QuizSummaryReport[];
    userId: UUID;
  };
}

export interface GenerateSummarySuccessAction {
  type: typeof GENERATE_SUMMARY_SUCCESS;
  payload: {
    moduleId: UUID;
    analysis: StructuredAnalysis;
  };
}

export interface GenerateSummaryFailureAction {
  type: typeof GENERATE_SUMMARY_FAILURE;
  payload: {
    moduleId: UUID;
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
  moduleId: UUID,
  moduleReports: QuizSummaryReport[],
  userId: UUID
): GenerateSummaryAction => ({
  type: GENERATE_SUMMARY,
  payload: {
    moduleId,
    moduleReports,
    userId
  }
});

export const generateSummarySuccess = (
  moduleId: UUID,
  analysis: StructuredAnalysis
): GenerateSummarySuccessAction => ({
  type: GENERATE_SUMMARY_SUCCESS,
  payload: {
    moduleId,
    analysis
  }
});

export const generateSummaryFailure = (
  moduleId: UUID,
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